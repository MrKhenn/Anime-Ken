import express from 'express';
import axios from 'axios';
import cors from 'cors';
import NodeCache from 'node-cache';
import { fetchMovies, fetchSeries } from './helpers.js';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fs from 'fs';
dotenv.config();

console.log('OMDB_API_KEY:', process.env.OMDB_API_KEY);
console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY);

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // TTL 1h
app.use(cors());
app.use(bodyParser.json());

const OMDB_URL = 'https://www.omdbapi.com';
const TMDB_URL = 'https://api.themoviedb.org/3';

/* 1.1  Búsqueda fusionada */
app.get('/api/search', async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).send('query missing');

  const cacheKey = `search_${q}`;
  if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

  try {
    // OMDb
    const omdb = await axios.get(`${OMDB_URL}/?apikey=${process.env.OMDB_API_KEY}&s=${q}&type=movie`);
    const omdbResults = (omdb.data.Search || []).map(m => ({
      imdbID: m.imdbID,
      title: m.Title,
      year: m.Year,
      poster: m.Poster !== 'N/A' ? m.Poster : null
    }));

    // TMDB (búsqueda + imagen 4K)
    const tmdb = await axios.get(`${TMDB_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${q}&language=es-ES`);
    const tmdbResults = tmdb.data.results.map(m => ({
      tmdbID: m.id,
      imdbID: null, // lo pediremos después
      title: m.title,
      year: m.release_date?.slice(0, 4),
      poster: m.poster_path ? `https://image.tmdb.org/t/p/original${m.poster_path}` : null
    }));

    // cruzar datos (simple): si coincide título + año → merge
    const merged = [...omdbResults, ...tmdbResults];
    cache.set(cacheKey, merged);
    res.json(merged);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* 1.2  Detalle completo */
app.get('/api/movies', async (req, res) => {
    const page = req.query.page || 1;
    const movies = await fetchMovies(page);
    console.log('Movies data:', movies);
    res.json(movies);
});

app.get('/api/series', async (req, res) => {
    const page = req.query.page || 1;
    const series = await fetchSeries(page);
    res.json(series);
});

app.get('/api/genres', async (req, res) => {
    const genre = req.query.genre;
    const page = req.query.page || 1;
    const movies = await fetchMovies(page);
    const series = await fetchSeries(page);
    const all = [...movies, ...series];
    if (genre) {
        const filtered = all.filter(item => item.Genre.includes(genre));
        res.json(filtered);
    } else {
        res.json(all);
    }
});

app.get('/api/detail/:imdbID', async (req, res) => {
    const id = req.params.imdbID;
    const cacheKey = `detail_${id}`;
    if (cache.has(cacheKey)) return res.json(cache.get(cacheKey));

    try {
      // OMDb
      const omdb = await axios.get(`${OMDB_URL}/?apikey=${process.env.OMDB_API_KEY}&i=${id}&plot=full`);
      // TMDB (necesitamos tmdbID)
      const tmdbFind = await axios.get(`${TMDB_URL}/find/${id}?external_source=imdb_id&api_key=${process.env.TMDB_API_KEY}`);
      const movieTmdb = tmdbFind.data.movie_results[0];
      let tmdbExtra = {};
      if (movieTmdb) {
        const [detail, videos] = await Promise.all([
          axios.get(`${TMDB_URL}/movie/${movieTmdb.id}?api_key=${process.env.TMDB_API_KEY}&language=es-ES`),
          axios.get(`${TMDB_URL}/movie/${movieTmdb.id}/videos?api_key=${process.env.TMDB_API_KEY}`)
        ]);
        tmdbExtra = {
          backdropPath: detail.data.backdrop_path ? `https://image.tmdb.org/t/p/original${detail.data.backdrop_path}` : null,
          trailer: videos.data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer')
        };
      }

      const final = {
        ...omdb.data,
        backdropPath: tmdbExtra.backdropPath,
        trailer: tmdbExtra.trailer ? `https://www.youtube.com/watch?v=${tmdbExtra.trailer.key}` : null
      };
      cache.set(cacheKey, final);
      res.json(final);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

// Auth routes
const USERS_FILE = './users.json';

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Missing required fields');
    }

    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading from database');
        }

        const users = JSON.parse(data);
        const userExists = users.find(user => user.email === email);

        if (userExists) {
            return res.status(400).send('User already exists');
        }

        const newUser = { id: Date.now().toString(), username, email, password }; // In a real app, hash the password
        users.push(newUser);

        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to database');
            }
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Missing required fields');
    }

    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading from database');
        }

        const users = JSON.parse(data);
        const user = users.find(user => user.email === email && user.password === password); // In a real app, compare hashed passwords

        if (!user) {
            return res.status(401).send('Invalid credentials');
        }

        res.status(200).json({ message: 'Login successful', user });
    });
});

// Interactions routes
const INTERACTIONS_FILE = './interactions.json';

const readInteractions = () => {
    try {
        const data = fs.readFileSync(INTERACTIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
};

const writeInteractions = (data) => {
    fs.writeFileSync(INTERACTIONS_FILE, JSON.stringify(data, null, 2));
};

app.get('/api/interactions/:id', (req, res) => {
    const { id } = req.params;
    const interactions = readInteractions();
    res.status(200).json(interactions[id] || { likes: [], dislikes: [], comments: [] });
});

app.post('/api/interactions/like', (req, res) => {
    const { movieId, userId } = req.body;
    if (!movieId || !userId) return res.status(400).send('Missing fields');

    const interactions = readInteractions();
    if (!interactions[movieId]) {
        interactions[movieId] = { likes: [], dislikes: [], comments: [] };
    }

    interactions[movieId].likes = [...new Set([...interactions[movieId].likes, userId])];
    interactions[movieId].dislikes = interactions[movieId].dislikes.filter(id => id !== userId);

    writeInteractions(interactions);
    res.status(200).json(interactions[movieId]);
});

app.post('/api/interactions/dislike', (req, res) => {
    const { movieId, userId } = req.body;
    if (!movieId || !userId) return res.status(400).send('Missing fields');

    const interactions = readInteractions();
    if (!interactions[movieId]) {
        interactions[movieId] = { likes: [], dislikes: [], comments: [] };
    }

    interactions[movieId].dislikes = [...new Set([...interactions[movieId].dislikes, userId])];
    interactions[movieId].likes = interactions[movieId].likes.filter(id => id !== userId);

    writeInteractions(interactions);
    res.status(200).json(interactions[movieId]);
});

app.post('/api/interactions/comment', (req, res) => {
    const { movieId, userId, username, text } = req.body;
    if (!movieId || !userId || !username || !text) return res.status(400).send('Missing fields');

    const interactions = readInteractions();
    if (!interactions[movieId]) {
        interactions[movieId] = { likes: [], dislikes: [], comments: [] };
    }

    const newComment = { userId, username, text, date: new Date().toISOString() };
    interactions[movieId].comments.push(newComment);

    writeInteractions(interactions);
    res.status(201).json(interactions[movieId]);
});


app.listen(4000, () => console.log('Proxy corriendo en http://localhost:4000'));
