import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnimeCard, { Anime } from '../components/AnimeCard';
import { OMDb_API_KEY, OMDb_BASE_URL } from '../apiConfig';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      if (!query) return; // No hacer nada si no hay consulta

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/search?query=${query}`);
        const data = await response.json();
        if (data.Response === "True") {
          setAnimes(data.Search);
        } else {
          setAnimes([]); // Limpiar resultados anteriores si hay un error
          setError(data.Error);
        }
      } catch (err) {
        setError('Failed to fetch data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [location.search]); // Depender de location.search para detectar cambios en la URL

  return (
    <div className="anime-list">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {animes.map(anime => (
        <AnimeCard key={anime.imdbID} anime={anime} />
      ))}
    </div>
  );
};

export default SearchPage;
