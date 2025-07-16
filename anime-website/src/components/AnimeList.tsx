import React, { useState, useEffect } from 'react';
import AnimeCard, { Anime } from './AnimeCard';
import PageTitleHero from './PageTitleHero';
import { OMDb_API_KEY, OMDb_BASE_URL } from '../apiConfig';

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchQuery = "Lilo & Stitch"; // Hardcoded search query

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${OMDb_BASE_URL}?s=${searchQuery}&apikey=${OMDb_API_KEY}&type=movie`);
        const data = await response.json();

        if (data.Response === "True") {
          setAnimes(data.Search);
        } else {
          setAnimes([]);
          setError(data.Error);
        }
      } catch (err) {
        setAnimes([]);
        setError('Failed to fetch data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    if (searchQuery) {
      fetchAnimes();
    }
  }, []); // Removed searchQuery from dependency array to fetch only once

  const renderContent = () => {
    if (loading) {
      return <p className="loading-message">Searching for '{searchQuery}'...</p>;
    }

    if (error) {
      return <p className="error-message">Error: {error}</p>;
    }

    if (animes.length === 0) {
        return <p>No results found for '{searchQuery}'. Try a different search!</p>
    }

    return (
      <div className="anime-list">
        {animes.map(anime => (
          <AnimeCard key={anime.imdbID} anime={anime} />
        ))}
      </div>
    );
  };

  return (
    <>
      <PageTitleHero />
      {renderContent()}
    </>
  );
};

export default AnimeList;
