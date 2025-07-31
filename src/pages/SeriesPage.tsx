import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTvShowsFromSupabase, getGenresFromSupabase, Media, Genre } from '../utils/api';
import MovieCard from '../components/MovieCard';

const SeriesPage: React.FC = () => {
  const [series, setSeries] = useState<Media[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genresMap, setGenresMap] = useState<{ [key: number]: string }>({});
  const [selectedGenreId, setSelectedGenreId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tvShowData, genreData] = await Promise.all([
          getTvShowsFromSupabase(),
          getGenresFromSupabase()
        ]);
        setSeries(tvShowData);

        const map: { [key: number]: string } = {};
        genreData.forEach(genre => {
          map[genre.id] = genre.name;
        });
        setGenresMap(map);
      } catch (err) {
        console.error("Error al cargar series:", err);
        setError("¡Vaya! No pudimos cargar las series. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredSeries = selectedGenreId
    ? series.filter(tvShow => tvShow.genre_ids && tvShow.genre_ids.includes(parseInt(selectedGenreId)))
    : series;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-gray-400 text-xl">Cargando el universo de series...</p>
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
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <h1 className="text-4xl font-bold text-red-600 mb-8">Todas las Series</h1>
      <p className="text-lg text-gray-300 mb-8">
        Sumérgete en el mundo de las series. Aquí podrás encontrar tu próxima maratón.
      </p>

      <motion.div
        className="mb-8 text-left max-w-xs mx-auto md:mx-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <label htmlFor="genre-select" className="block text-gray-300 text-lg font-semibold mb-2">
          Filtrar por Género:
        </label>
        <select
          id="genre-select"
          className="block w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-300"
          value={selectedGenreId}
          onChange={(e) => setSelectedGenreId(e.target.value)}
        >
          <option value="">Todos los Géneros</option>
          {Object.entries(genresMap).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>
      </motion.div>

      {filteredSeries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredSeries.map((tvShow) => (
            <MovieCard key={tvShow.id} item={tvShow} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-xl mt-8">No se encontraron series para el género seleccionado. ¡Qué desilusión!</p>
      )}
    </motion.div>
  );
};

export default SeriesPage;
