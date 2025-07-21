import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { OMDb_API_KEY, OMDb_BASE_URL } from '../apiConfig';
import { getCache, setCache } from '../services/cacheService';
import './AnimeDetail.css';

const DetailPage: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const cacheKey = `movie-${imdbID}`;
      const cachedData = getCache(cacheKey);

      if (cachedData) {
        setMovie(cachedData);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${OMDb_BASE_URL}?i=${imdbID}&apikey=${OMDb_API_KEY}`);
        const data = await response.json();
        if (data.Response === "True") {
          setMovie(data);
          setCache(cacheKey, data);
        } else {
          setError(data.Error);
        }
      } catch (err) {
        setError('Failed to fetch data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    if (imdbID) {
      fetchMovie();
    }
  }, [imdbID]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!movie) {
    return <h2>Película no encontrada</h2>;
  }

  const streamtapeUrl = `https://streamtape.com/e/${movie.imdbID}`;
  const approvalPercentage = (parseFloat(movie.imdbRating) / 10) * 100;
  const posterUrl = `http://img.omdbapi.com/?i=${movie.imdbID}&h=300&apikey=${OMDb_API_KEY}`;

  return (
    <div className="detail-page-background">
      <div className="detail-container">
        <div className="detail-info-container">
          <div className="poster-container">
            <img src={posterUrl} alt={movie.Title} />
          </div>
          <div className="info-container">
            <h1>{movie.Title}</h1>
            <div className="metadata">
              <span>{movie.Year}</span>
              <span>{movie.Rated}</span>
              <span>{movie.Runtime}</span>
            </div>
            <div className="rating">
              <span>★</span> {movie.imdbRating}/10
            </div>
            <div className="approval-rating">
              <span>{approvalPercentage.toFixed(0)}% de aprobación</span>
            </div>
            <p><strong>Género:</strong> {movie.Genre}</p>
            <p><strong>Director:</strong> {movie.Director}</p>
            <p><strong>Escritor:</strong> {movie.Writer}</p>
            <p><strong>Actores:</strong> {movie.Actors}</p>
            <p><strong>Sinopsis:</strong> {movie.Plot}</p>
            <p><strong>Premios:</strong> {movie.Awards}</p>
          </div>
        </div>
        <div className="video-player-container">
          <div className="video-player-wrapper">
            <iframe
              src={streamtapeUrl}
              width="100%"
              height="100%"
              allowFullScreen
              title={`Video Player - ${movie.Title}`}
              className="video-iframe"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
