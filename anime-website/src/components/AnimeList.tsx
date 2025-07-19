import React, { useState, useEffect } from 'react';
import AnimeCard, { Anime } from './AnimeCard';
import PageTitleHero from './PageTitleHero';
import { OMDb_API_KEY, OMDb_BASE_URL } from '../apiConfig';
import { useSearch } from '../context/SearchContext';
import { getCache, setCache } from '../services/cacheService';

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch();

  useEffect(() => {
    const fetchAnimes = async () => {
      const query = searchQuery || 'Matrix';
      const cacheKey = `anime-list-${query}`;
      const cachedData = getCache(cacheKey);

      if (cachedData) {
        setAnimes(cachedData);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${OMDb_BASE_URL}?s=${query}&apikey=${OMDb_API_KEY}`);
        const data = await response.json();
        if (data.Response === "True") {
          setAnimes(data.Search);
          setCache(cacheKey, data.Search);
        } else {
          setError(data.Error);
        }
      } catch (err) {
        setError('Failed to fetch data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnimes();
  }, [searchQuery]);

  return (
    <>
      <PageTitleHero />
      <div className="anime-list">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {animes.map(anime => (
          <AnimeCard key={anime.imdbID} anime={anime} />
        ))}
      </div>
    </>
  );
};

export default AnimeList;
