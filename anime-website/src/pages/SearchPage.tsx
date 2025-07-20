import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnimeCard, { Anime } from '../components/AnimeCard';
import { OMDb_API_KEY, OMDb_BASE_URL } from '../apiConfig';

const SearchPage: React.FC = () => {
  const { query } = useParams<{ query: string }>();
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${OMDb_BASE_URL}?s=${query}&apikey=${OMDb_API_KEY}`);
        const data = await response.json();
        if (data.Response === "True") {
          setAnimes(data.Search);
        } else {
          setError(data.Error);
        }
      } catch (err) {
        setError('Failed to fetch data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchAnimes();
    }
  }, [query]);

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
