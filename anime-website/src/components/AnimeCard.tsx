import React from 'react';
// Removed Link import as we are changing to a button
// import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AnimeCard.css'; // Assuming some styles might be here or in App.css

export interface Anime {
  id: string;
  title: string;
  imageUrl?: string; // Optional image
  synopsis?: string;
}

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const handleViewDetailsClick = () => {
    Swal.fire({
      title: anime.title,
      html: `
        ${anime.imageUrl ? `<img src="${anime.imageUrl}" alt="${anime.title}" style="max-width: 100%; height: auto; margin-bottom: 15px; border-radius: 5px;">` : ''}
        <p style="text-align: left; font-size: 0.9em;">${anime.synopsis || 'No synopsis available.'}</p>
      `,
      confirmButtonText: 'Close',
      width: '500px', // A bit wider for content
      theme: 'dark', // Apply dark theme directly
    });
  };

  return (
    <div className="anime-card">
      {anime.imageUrl && <img src={anime.imageUrl} alt={anime.title} /* style from App.css */ />}
      <h2>{anime.title}</h2>
      {/* Changed Link to button */}
      <button onClick={handleViewDetailsClick} className="details-button">
        View Details
      </button>
    </div>
  );
};

export default AnimeCard;
