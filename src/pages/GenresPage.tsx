import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGenresFromSupabase, getMoviesFromSupabase, getTvShowsFromSupabase, Media, Genre } from '../utils/api';
import MovieCard from '../components/MovieCard';

const GenresPage: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [filteredItems, setFilteredItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [allMoviesAndTv, setAllMoviesAndTv] = useState<Media[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [genreData, movieData, tvShowData] = await Promise.all([
          getGenresFromSupabase(),
          getMoviesFromSupabase(),
          getTvShowsFromSupabase()
        ]);
        setGenres(genreData);
        setAllMoviesAndTv([...movieData, ...tvShowData]);
        setFilteredItems([...movieData, ...tvShowData]);
      } catch (err) {
        console.error("Error al cargar datos de géneros:", err);
        setError("¡Vaya! No pudimos cargar los géneros o los títulos. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGenre) {
      const items = allMoviesAndTv.filter(item => item.genre_ids && item.genre_ids.includes(selectedGenre.id));
      setFilteredItems(items);
    } else {
      setFilteredItems(allMoviesAndTv);
    }
  }, [selectedGenre, allMoviesAndTv]);

  const handleGenreClick = (genre: Genre) => {
    setSelectedGenre(prev => (prev && prev.id === genre.id ? null : genre));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-gray-400 text-xl">Cargando géneros y títulos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold text-red-600 mb-8">Explorar por Géneros</h1>
      <p className="text-lg text-gray-300 mb-12">
        ¿Te apetece algo de acción, comedia o drama? Selecciona un género para filtrar
        películas y series.
      </p>

      <motion.div
        className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-red-900 mb-12"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-2xl font-bold text-red-600 mb-6">Filtra por Género</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {genres.map((genre) => (
            <motion.button
              key={genre.id}
              onClick={() => handleGenreClick(genre)}
              className={`px-5 py-2 rounded-full font-semibold text-lg transition-all duration-300
                ${selectedGenre && selectedGenre.id === genre.id
                  ? 'bg-red-700 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-red-800 hover:text-white'
                }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {genre.name}
            </motion.button>
          ))}
          {selectedGenre && (
            <motion.button
              onClick={() => setSelectedGenre(null)}
              className="px-5 py-2 rounded-full font-semibold text-lg bg-gray-600 text-white hover:bg-gray-500 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Mostrar Todos
            </motion.button>
          )}
        </div>
      </motion.div>

      {filteredItems.length > 0 ? (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {filteredItems.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-500 text-xl mt-8">
          No se encontraron títulos para el género seleccionado. ¡Qué mala suerte!
        </p>
      )}
    </motion.div>
  );
};

export default GenresPage;
