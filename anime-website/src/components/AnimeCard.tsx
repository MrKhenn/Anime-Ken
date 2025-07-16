import React from 'react';
import { Link } from 'react-router-dom';
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
  return (
    <div className="anime-card">
      <img src={anime.Poster !== 'N/A' ? anime.Poster : 'https://via.placeholder.com/100x150?text=No+Image'} alt={anime.Title} />
      <h2>{anime.Title}</h2>
      <Link to={`/movie/${anime.imdbID}`} className="details-button">
        Ver ahora
      </Link>
    </div>
  );
};

export default AnimeCard;
