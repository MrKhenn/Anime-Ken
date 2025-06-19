import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Anime } from './AnimeCard'; // Re-use the Anime interface

// Placeholder data for now
const placeholderAnimes: Anime[] = [
  { id: '1', title: 'Anime Title 1', imageUrl: 'https://via.placeholder.com/150x220?text=Anime1', synopsis: 'This is a detailed synopsis for Anime Title 1. It tells the story of...' },
  { id: '2', title: 'Anime Title 2', imageUrl: 'https://via.placeholder.com/150x220?text=Anime2', synopsis: 'This is a detailed synopsis for Anime Title 2. It follows the adventures of...' },
  { id: '3', title: 'Anime Title 3', synopsis: 'This is a detailed synopsis for Anime Title 3 without an image. It is an intriguing tale about...' },
  { id: '4', title: 'Chronicles of the Void', imageUrl: 'https://via.placeholder.com/150x220?text=VoidChron', synopsis: 'A journey through space-time to uncover ancient secrets. This epic tale follows Elara as she pilots the starship Chronos into the unknown.' },
  { id: '5', title: 'Steel Alchemist: Legacy', imageUrl: 'https://via.placeholder.com/150x220?text=SteelLegacy', synopsis: 'In a world of machines and magic, a new hero rises. Kael must master both alchemy and engineering to save his city from a mechanical threat.' },
  { id: '6', title: 'Cyber Runner Zero', imageUrl: 'https://via.placeholder.com/150x220?text=CyberZero', synopsis: 'Hacking the system in a dystopian future to fight for freedom. Zero, a ghost in the machine, takes on the all-powerful OmniCorp.' },
  { id: '7', title: 'Forest Spirit Tales', imageUrl: 'https://via.placeholder.com/150x220?text=ForestSpirit', synopsis: 'Mystical creatures and hidden wonders in an enchanted forest. Join Lina as she befriends the spirits and protects their ancient home.' },
  { id: '8', title: 'Island Survival Challenge', synopsis: 'Stranded on a deserted island, contestants face nature and each other. A gripping reality show where only the most resourceful will triumph.' },
  { id: '9', title: 'The Last Spellcaster', imageUrl: 'https://via.placeholder.com/150x220?text=Spellcaster', synopsis: 'Magic is fading, and only one can restore it. Lyra, the last of her kind, embarks on a quest to find the source of magic.' },
  { id: '10', title: 'Galactic Footballers', imageUrl: 'https://via.placeholder.com/150x220?text=StarBall', synopsis: 'The biggest sport in the galaxy, played between planets! Follow the Earth team as they compete for the Galactic Cup.' },
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

  if (loading) return <p className="loading-message">Loading details...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;
  if (!anime) return <p className="error-message">Anime not found.</p>;

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
