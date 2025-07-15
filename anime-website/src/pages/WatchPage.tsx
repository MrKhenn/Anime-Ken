import React from 'react';
import { useParams } from 'react-router-dom';
import { Anime } from '../components/AnimeCard'; // Import the Anime interface
import './WatchPage.css'; // Styles for this page

// We need the anime data here to find the streamtapeId.
// In a real app, this might come from a global state (context/redux) or a dedicated API call.
// For this template, we'll redefine the placeholder data. It's redundant but keeps the component self-contained for now.
const placeholderAnimes: Anime[] = [
  { id: '1', title: 'Anime Title 1', imageUrl: 'https://via.placeholder.com/150x220?text=Anime1', synopsis: 'This is a detailed synopsis for Anime Title 1. It tells the story of...', streamtapeId: 'rbAarvRPXdYbaxY' },
  { id: '2', title: 'Anime Title 2', imageUrl: 'https://via.placeholder.com/150x220?text=Anime2', synopsis: 'This is a detailed synopsis for Anime Title 2. It follows the adventures of...', streamtapeId: 'XklyYLYAZZZDZW' },
  { id: '3', title: 'Anime Title 3', synopsis: 'This is a detailed synopsis for Anime Title 3 without an image. It is an intriguing tale about...', streamtapeId: 'B4GaCbJAAAyBxb' },
  { id: '4', title: 'Chronicles of the Void', imageUrl: 'https://via.placeholder.com/150x220?text=VoidChron', synopsis: 'A journey through space-time to uncover ancient secrets. This epic tale follows Elara as she pilots the starship Chronos into the unknown.' },
  { id: '5', title: 'Steel Alchemist: Legacy', imageUrl: 'https://via.placeholder.com/150x220?text=SteelLegacy', synopsis: 'In a world of machines and magic, a new hero rises. Kael must master both alchemy and engineering to save his city from a mechanical threat.' },
  { id: '6', title: 'Cyber Runner Zero', imageUrl: 'https://via.placeholder.com/150x220?text=CyberZero', synopsis: 'Hacking the system in a dystopian future to fight for freedom. Zero, a ghost in the machine, takes on the all-powerful OmniCorp.' },
  { id: '7', title: 'Forest Spirit Tales', imageUrl: 'https://via.placeholder.com/150x220?text=ForestSpirit', synopsis: 'Mystical creatures and hidden wonders in an enchanted forest. Join Lina as she befriends the spirits and protects their ancient home.' },
  { id: '8', title: 'Island Survival Challenge', synopsis: 'Stranded on a deserted island, contestants face nature and each other. A gripping reality show where only the most resourceful will triumph.' },
  { id: '9', title: 'The Last Spellcaster', imageUrl: 'https://via.placeholder.com/150x220?text=Spellcaster', synopsis: 'Magic is fading, and only one can restore it. Lyra, the last of her kind, embarks on a quest to find the source of magic.' },
  { id: '10', 'title': 'Galactic Footballers', 'imageUrl': 'https://via.placeholder.com/150x220?text=StarBall', 'synopsis': 'The biggest sport in the galaxy, played between planets! Follow the Earth team as they compete for the Galactic Cup.' }
];


const WatchPage: React.FC = () => {
  const { animeId } = useParams<{ animeId: string }>();
  const anime = placeholderAnimes.find(a => a.id === animeId);

  if (!anime) {
    return <div className="watch-page-container"><p>Anime not found.</p></div>;
  }

  return (
    <div className="watch-page-container">
      <h1 className="watch-title">Now Watching: {anime.title}</h1>
      {anime.streamtapeId ? (
        <div className="video-player-wrapper">
          <iframe
            src={`https://streamtape.com/e/\${anime.streamtapeId}`}
            width="100%"
            height="100%"
            allowFullScreen
            allow="autoplay; fullscreen"
            title={`Streamtape Player - \${anime.title}`}
            className="video-iframe"
          ></iframe>
        </div>
      ) : (
        <p className="video-not-available">Video is not available for this anime.</p>
      )}
    </div>
  );
};

export default WatchPage;
