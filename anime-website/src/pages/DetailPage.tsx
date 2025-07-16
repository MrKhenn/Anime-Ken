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

  return (
    <div className="detail-page">
      <div className="detail-card">
        <img src={movie.Poster} alt={movie.Title} />
        <div className="detail-info">
          <h1>{movie.Title}</h1>
          <p><strong>Género:</strong> {movie.Genre}</p>
          <p>{movie.Plot}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
