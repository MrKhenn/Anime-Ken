import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGenresFromSupabase, Genre } from '../utils/api';
import { Media } from '../utils/api';

interface MovieCardProps {
  item: Media;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  const navigate = useNavigate();
  const [genresMap, setGenresMap] = useState<{[key: number]: string}>({});

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genres = await getGenresFromSupabase();
        const map: {[key: number]: string} = {};
        genres.forEach(genre => {
          map[genre.id] = genre.name;
        });
        setGenresMap(map);
      } catch (error) {
        console.error("Error al cargar géneros para MovieCard:", error);
      }
    };
    fetchGenres();
  }, []);

  const imageUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  const title = item.title || item.name;
  const mediaType = item.media_type === 'movie' ? 'Película' : 'Serie';
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const categories = item.genre_ids && item.genre_ids.length > 0
    ? item.genre_ids.map(id => genresMap[id]).filter(Boolean).join(', ')
    : 'Desconocido';

  const handleViewDetails = () => {
    navigate(`/detalle/${item.id}?type=${item.media_type}`);
  };

  return (
    <motion.div
      className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 cursor-pointer group"
      whileHover={{ scale: 1.05, boxShadow: "0 15px 25px -5px rgba(0, 0, 0, 0.4)" }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-red-500 mb-2 truncate">{title}</h3>
        <p className="text-gray-400 text-sm">{mediaType}</p>
        <div className="flex items-center text-yellow-400 text-sm mt-2">
          <Star className="w-4 h-4 mr-1" />
          <span>{rating}</span>
        </div>
      </div>

      {/* Hover Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm mb-1">{categories}</p>
        <div className="flex items-center text-yellow-400 text-lg mb-4">
          <Star className="w-5 h-5 mr-2" />
          <span>{rating}</span>
        </div>
        <motion.button
          onClick={handleViewDetails}
          className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Play className="w-5 h-5 mr-2" />
          Ver ahora
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default MovieCard;
