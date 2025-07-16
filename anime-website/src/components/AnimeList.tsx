import React, { useState, useEffect } from 'react';
import AnimeCard, { Anime } from './AnimeCard';
import PageTitleHero from './PageTitleHero';
import { OMDb_API_KEY, OMDb_BASE_URL } from '../apiConfig';

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const imdbID = "tt11655566"; // Hardcoded IMDb ID

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${OMDb_BASE_URL}?i=${imdbID}&apikey=${OMDb_API_KEY}`);
        const data = await response.json();

        if (data.Response === "True") {
          setAnimes([data]);
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

    if (imdbID) {
      fetchAnimes();
    }
  }, []); // Removed searchQuery from dependency array to fetch only once

  const renderContent = () => {
    if (loading) {
      return <p className="loading-message">Searching for movie with ID '{imdbID}'...</p>;
    }

    if (error) {
      return <p className="error-message">Error: {error}</p>;
    }

    if (animes.length === 0) {
        return <p>No results found for movie with ID '{imdbID}'. Try a different search!</p>
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
