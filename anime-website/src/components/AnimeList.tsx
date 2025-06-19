import React, { useState, useEffect } from 'react';
import AnimeCard, { Anime } from './AnimeCard';

// Placeholder data for now
const placeholderAnimes: Anime[] = [
  { id: '1', title: 'Anime Title 1', imageUrl: 'https://via.placeholder.com/100x150?text=Anime1', synopsis: 'Synopsis for anime 1...' },
  { id: '2', title: 'Anime Title 2', imageUrl: 'https://via.placeholder.com/100x150?text=Anime2', synopsis: 'Synopsis for anime 2...' },
  { id: '3', title: 'Anime Title 3', synopsis: 'Synopsis for anime 3...' },
  { id: '4', title: 'Chronicles of the Void', imageUrl: 'https://via.placeholder.com/100x150?text=VoidChron', synopsis: 'A journey through space-time to uncover ancient secrets.' },
  { id: '5', title: 'Steel Alchemist: Legacy', imageUrl: 'https://via.placeholder.com/100x150?text=SteelLegacy', synopsis: 'In a world of machines and magic, a new hero rises.' },
  { id: '6', title: 'Cyber Runner Zero', imageUrl: 'https://via.placeholder.com/100x150?text=CyberZero', synopsis: 'Hacking the system in a dystopian future to fight for freedom.' },
  { id: '7', title: 'Forest Spirit Tales', imageUrl: 'https://via.placeholder.com/100x150?text=ForestSpirit', synopsis: 'Mystical creatures and hidden wonders in an enchanted forest.' },
  { id: '8', title: 'Island Survival Challenge', synopsis: 'Stranded on a deserted island, contestants face nature and each other.' },
  { id: '9', title: 'The Last Spellcaster', imageUrl: 'https://via.placeholder.com/100x150?text=Spellcaster', synopsis: 'Magic is fading, and only one can restore it.' },
  { id: '10', title: 'Galactic Footballers', imageUrl: 'https://via.placeholder.com/100x150?text=StarBall', synopsis: 'The biggest sport in the galaxy, played between planets!' },
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
