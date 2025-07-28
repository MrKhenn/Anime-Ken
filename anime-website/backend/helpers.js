import axios from 'axios';
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 3600 });

const OMDB_URL = 'https://www.omdbapi.com';
const TMDB_URL = 'https://api.themoviedb.org/3';

export async function fetchMovies(page = 1) {
  const key = `movies_${page}`;
  if (cache.has(key)) return cache.get(key);

  // TMDB – películas populares
  const tmdbRes = await axios.get(`${TMDB_URL}/movie/popular`, {
    params: { api_key: process.env.TMDB_API_KEY, page, language: 'es-ES' }
  });

  // OMDb – detalles por cada tmdb movie
  const merged = await Promise.all(
    tmdbRes.data.results.map(async m => {
      try {
        const tmdbMovie = await axios.get(`${TMDB_URL}/movie/${m.id}?api_key=${process.env.TMDB_API_KEY}&language=es-ES`);
        const imdb_id = tmdbMovie.data.imdb_id;
        const omdb = await axios.get(`${OMDB_URL}/?apikey=${process.env.OMDB_API_KEY}&i=${imdb_id}`);
        return {
          id: m.id,
          imdbID: imdb_id,
          title: omdb.data.Title || m.title,
          year: omdb.data.Year || m.release_date?.slice(0, 4),
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : omdb.data.Poster,
          genres: m.genre_ids, // array numérico
          type: 'movie'
        };
      } catch (error) {
        console.error(`Error fetching OMDb data for ${m.title}:`, error.message);
        return null;
      }
    })
  );

  return merged.filter(Boolean);

  cache.set(key, merged);
  return merged;
}

export async function fetchSeries(page = 1) {
    const key = `series_${page}`;
    if (cache.has(key)) return cache.get(key);

    // TMDB – series populares
    const tmdbRes = await axios.get(`${TMDB_URL}/tv/popular`, {
      params: { api_key: process.env.TMDB_API_KEY, page, language: 'es-ES' }
    });

    // OMDb – detalles por cada tmdb movie
    const merged = await Promise.all(
      tmdbRes.data.results.map(async s => {
      try {
        const tmdbSerie = await axios.get(`${TMDB_URL}/tv/${s.id}?api_key=${process.env.TMDB_API_KEY}&language=es-ES`);
        const imdb_id = tmdbSerie.data.external_ids.imdb_id;
        const omdb = await axios.get(`${OMDB_URL}/?apikey=${process.env.OMDB_API_KEY}&i=${imdb_id}`);
        return {
          id: s.id,
          imdbID: imdb_id,
          title: omdb.data.Title || s.name,
          year: omdb.data.Year || s.first_air_date?.slice(0, 4),
          poster: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : omdb.data.Poster,
          genres: s.genre_ids, // array numérico
          type: 'series'
        };
      } catch (error) {
        console.error(`Error fetching OMDb data for ${s.name}:`, error.message);
        return {
            id: s.id,
            imdbID: null,
            title: s.name,
            year: s.first_air_date?.slice(0, 4),
            poster: s.poster_path ? `https://image.tmdb.org/t/p/w500${s.poster_path}` : null,
            genres: s.genre_ids,
            type: 'series'
        };
      }
      })
    );

  return merged.filter(Boolean);

    cache.set(key, merged);
    return merged;
  }
