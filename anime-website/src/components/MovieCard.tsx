import React from 'react';
import Swal from 'sweetalert2';
import './AnimeCard.css'; // Reusing styles for consistency

export interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Plot: string;
  Genre: string;
}

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const handleViewDetailsClick = () => {
    Swal.fire({
      title: movie.Title,
      html: `
        <p style="text-align: left;"><b>Year:</b> ${movie.Year}</p>
        <p style="text-align: left;"><b>Type:</b> ${movie.Type}</p>
        <p style="text-align: left;"><b>Genre:</b> ${movie.Genre}</p>
        <p style="text-align: left;"><b>Plot:</b> ${movie.Plot}</p>
      `,
      imageUrl: movie.Poster !== 'N/A' ? movie.Poster : undefined,
      imageAlt: movie.Title,
      confirmButtonText: 'Close',
      width: '400px',
      theme: 'dark',
      footer: `<a href="https://www.imdb.com/title/${movie.imdbID}" target="_blank" rel="noopener noreferrer" style="background-color: #f5c518; color: black; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">View on IMDb</a>`
    });
  };

  return (
    <div className="anime-card">
      <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/100x150?text=No+Image'} alt={movie.Title} />
      <h2>{movie.Title}</h2>
      <button onClick={handleViewDetailsClick} className="details-button">
        View Details
      </button>
    </div>
  );
};

export default MovieCard;
