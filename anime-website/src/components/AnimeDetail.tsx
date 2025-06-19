import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Anime } from './AnimeCard'; // Re-use the Anime interface

// Placeholder data for now
const placeholderAnimes: Anime[] = [
  { id: '1', title: 'Anime Title 1', imageUrl: 'https://via.placeholder.com/150x220?text=Anime1', synopsis: 'This is a detailed synopsis for Anime Title 1. It tells the story of...' },
  { id: '2', title: 'Anime Title 2', imageUrl: 'https://via.placeholder.com/150x220?text=Anime2', synopsis: 'This is a detailed synopsis for Anime Title 2. It follows the adventures of...' },
  { id: '3', title: 'Anime Title 3', synopsis: 'This is a detailed synopsis for Anime Title 3 without an image. It is an intriguing tale about...' },
];


const AnimeDetail: React.FC = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch data from an API here based on animeId
    setLoading(true);
    setTimeout(() => { // Simulate API call
      const foundAnime = placeholderAnimes.find(a => a.id === animeId);
      if (foundAnime) {
        setAnime(foundAnime);
      } else {
        setError('Anime not found.');
      }
      setLoading(false);
    }, 500);
  }, [animeId]);

  if (loading) return <p>Loading details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!anime) return <p>Anime not found.</p>;

  return (
    <div className="anime-detail">
      <h1>{anime.title}</h1>
      {anime.imageUrl && <img src={anime.imageUrl} alt={anime.title} style={{maxWidth: '200px'}} />}
      <p>{anime.synopsis}</p>
      {/* Add more details here: e.g., episodes, rating, genre */}
    </div>
  );
};

export default AnimeDetail;
