import express from 'express';
import axios from 'axios';
import cors from 'cors';
import NodeCache from 'node-cache';
import { fetchMovies, fetchSeries } from './helpers.js';
import dotenv from 'dotenv';
dotenv.config();

console.log('OMDB_API_KEY:', process.env.OMDB_API_KEY);
console.log('TMDB_API_KEY:', process.env.TMDB_API_KEY);

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // TTL 1h
app.use(cors());

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
        const filtered = all.filter(item => item.genres.includes(parseInt(genre)));
        res.json(filtered);
    } else {
        res.json(all);
    }
});

app.listen(4000, () => console.log('Proxy corriendo en http://localhost:4000'));
