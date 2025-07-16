import React from 'react';
import { useParams } from 'react-router-dom';
import { mockMovies } from '../mockMovies';
import './DetailPage.css';

const DetailPage: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const movie = mockMovies.find(m => m.imdbID === imdbID);

  if (!movie) {
    return <h2>Película no encontrada</h2>;
  }

  // Simulated Streamtape URL
  const streamtapeUrl = `https://streamtape.com/e/${movie.imdbID}`;

  return (
    <div className="detail-page">
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
      <div className="detail-info">
        <h1>{movie.Title}</h1>
        <p><strong>Género:</strong> {movie.Genre}</p>
        <p>{movie.Plot}</p>
        {/* Add more details here as needed */}
      </div>
    </div>
  );
};

export default DetailPage;
