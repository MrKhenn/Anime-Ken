import React from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './AnimeCard.css';

export interface Anime {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  imdbRating: string;
}

interface AnimeCardProps {
  anime: Anime;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const navigate = useNavigate();

  const handleViewDetailsClick = () => {
    Swal.fire({
      title: anime.Title,
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
      <div className="rating">
        <span>★</span> {anime.imdbRating}/10
      </div>
      <button onClick={handleViewDetailsClick} className="details-button">
        Ver detalles
      </button>
    </div>
  );
};

export default AnimeCard;
