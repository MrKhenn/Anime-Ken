import React from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <div className="anime-card">
      {anime.imageUrl && <img src={anime.imageUrl} alt={anime.title} style={{maxWidth: '100px'}} />}
      <h2>{anime.title}</h2>
      <Link to={`/anime/\${anime.id}`}>View Details</Link>
    </div>
  );
};

export default AnimeCard;
