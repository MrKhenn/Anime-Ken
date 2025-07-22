import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AnimeCard, { Anime } from '../components/AnimeCard';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newQuery = new URLSearchParams(location.search).get('query');
    if (newQuery) {
      setQuery(newQuery);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchAnimes = async () => {
      if (!query) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/search?query=${query}`);
        const data = await response.json();
        if (data.Response === "True") {
          setAnimes(data.Search);
        } else {
          setAnimes([]);
          setError(data.Error);
        }
      } catch (err) {
        setError('Failed to fetch data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [query]);

  return (
    <div className="anime-list">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && animes.length > 0 && animes.map(anime => (
        <AnimeCard key={anime.imdbID} anime={anime} />
      ))}
      {!loading && !error && animes.length === 0 && query && (
        <p>No se encontraron resultados para "{query}".</p>
      )}
    </div>
  );
};

export default SearchPage;
