import React from 'react';
import { useParams } from 'react-router-dom';
import { mockMovies } from '../mockMovies';
import StarRating from '../components/StarRating';
import './DetailPage.css';

const DetailPage: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const movie = mockMovies.find(m => m.imdbID === imdbID);

  if (!movie) {
    return <h2>Película no encontrada</h2>;
  }

  const streamtapeUrl = `https://streamtape.com/e/${movie.imdbID}`;

  const approvalPercentage = (parseFloat(movie.imdbRating) / 10) * 100;

  return (
    <div className="detail-page-background">
      <div className="detail-container">
        <div className="detail-info-container">
          <div className="poster-container">
            <img src={movie.Poster} alt={movie.Title} />
          </div>
          <div className="info-container">
            <h1>{movie.Title}</h1>
            <div className="metadata">
              <span>{movie.Year}</span>
              <span>{movie.Rated}</span>
              <span>{movie.Runtime}</span>
            </div>
            <StarRating rating={movie.Rating} />
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
