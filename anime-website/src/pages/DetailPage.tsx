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

  return (
    <div className="detail-page-background">
      <div className="detail-container">
        <div className="detail-info-container">
          <div className="poster-container">
            <img src={movie.Poster} alt={movie.Title} />
          </div>
          <div className="info-container">
            <h1>{movie.Title}</h1>
            <StarRating rating={movie.Rating} />
            <p><strong>Género:</strong> {movie.Genre}</p>
            <p>{movie.Plot}</p>
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
