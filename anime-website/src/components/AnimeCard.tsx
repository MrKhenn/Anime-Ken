import React from 'react';
// Removed Link import as we are changing to a button
// import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AnimeCard.css'; // Assuming some styles might be here or in App.css

export interface Anime {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const handleViewDetailsClick = () => {
    // Note: The details in OMDb free API are limited.
    // A full synopsis would require another API call using the imdbID.
    // For this modal, we'll just show the available info.
    Swal.fire({
      title: anime.Title,
      html: `
        <p style="text-align: left;"><b>Year:</b> ${anime.Year}</p>
        <p style="text-align: left;"><b>Type:</b> ${anime.Type}</p>
      `,
      imageUrl: anime.Poster !== 'N/A' ? anime.Poster : undefined,
      imageAlt: anime.Title,
      confirmButtonText: 'Close',
      width: '400px',
      theme: 'dark',
      footer: `<a href="https://www.imdb.com/title/${anime.imdbID}" target="_blank" rel="noopener noreferrer" style="background-color: #f5c518; color: black; padding: 10px 15px; border-radius: 5px; text-decoration: none; font-weight: bold;">View on IMDb</a>`
    });
  };

  return (
    <div className="anime-card">
      <img src={anime.Poster !== 'N/A' ? anime.Poster : 'https://via.placeholder.com/100x150?text=No+Image'} alt={anime.Title} />
      <h2>{anime.Title}</h2>
      {/* Changed Link to button */}
      <button onClick={handleViewDetailsClick} className="details-button">
        View Details
      </button>
    </div>
  );
};

export default AnimeCard;
