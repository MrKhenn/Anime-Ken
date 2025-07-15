import React, { useState, useEffect } from 'react';
import AnimeCard, { Anime } from './AnimeCard';
import PageTitleHero from './PageTitleHero';
import { OMDb_API_KEY, OMDb_BASE_URL } from '../apiConfig';
import { useSearch } from '../context/SearchContext'; // Import useSearch

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { searchQuery } = useSearch(); // Consume search query from context

  useEffect(() => {
    // Do not fetch if search query is empty
    if (!searchQuery) {
        setAnimes([]);
        setLoading(false);
        return;
    }

    const fetchAnimes = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${OMDb_BASE_URL}?s=${searchQuery}&apikey=${OMDb_API_KEY}&type=series`);
        const data = await response.json();

        if (data.Response === "True") {
          setAnimes(data.Search);
        } else {
          setAnimes([]); // Clear previous results on new search error
          setError(data.Error);
        }
      } catch (err) {
        setAnimes([]);
        setError('Failed to fetch data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimes();
  }, [searchQuery]); // Re-run effect when searchQuery changes

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
