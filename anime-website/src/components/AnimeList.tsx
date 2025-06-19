import React, { useState, useEffect } from 'react';
import AnimeCard, { Anime } from './AnimeCard';

// Placeholder data for now
const placeholderAnimes: Anime[] = [
  { id: '1', title: 'Anime Title 1', imageUrl: 'https://via.placeholder.com/100x150?text=Anime1', synopsis: 'Synopsis for anime 1...' },
  { id: '2', title: 'Anime Title 2', imageUrl: 'https://via.placeholder.com/100x150?text=Anime2', synopsis: 'Synopsis for anime 2...' },
  { id: '3', title: 'Anime Title 3', synopsis: 'Synopsis for anime 3...' },
];

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch data from an API here
    setLoading(true);
    setTimeout(() => { // Simulate API call
      setAnimes(placeholderAnimes);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p className="loading-message">Loading anime...</p>;
  if (error) return <p className="error-message">Error loading anime: {error}</p>;

  return (
    <div className="anime-list">
      {animes.map(anime => (
        <AnimeCard key={anime.id} anime={anime} />
      ))}
    </div>
  );
};

export default AnimeList;
