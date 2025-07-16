import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './AnimeCard.css';

export interface Anime {
  imdbID: string;
  Title: string;
  Genre: string;
  Plot: string;
  Poster: string;
}

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const navigate = useNavigate();

  const handleViewDetailsClick = () => {
    Swal.fire({
      title: anime.Title,
      html: `
        <p style="text-align: left;"><b>Género:</b> ${anime.Genre}</p>
        <p style="text-align: left;"><b>Sinopsis:</b> ${anime.Plot}</p>
      `,
      imageUrl: anime.Poster,
      imageAlt: anime.Title,
      confirmButtonText: 'Ver ahora',
      showCancelButton: true,
      cancelButtonText: 'Cerrar',
      theme: 'dark',
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/movie/${anime.imdbID}`);
      }
    });
  };

  return (
    <div className="anime-card">
      <img src={anime.Poster !== 'N/A' ? anime.Poster : 'https://via.placeholder.com/100x150?text=No+Image'} alt={anime.Title} />
      <h2>{anime.Title}</h2>
      <button onClick={handleViewDetailsClick} className="details-button">
        Ver detalles
      </button>
    </div>
  );
};

export default AnimeCard;
