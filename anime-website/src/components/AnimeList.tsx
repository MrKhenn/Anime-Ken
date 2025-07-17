import React, { useState, useEffect } from 'react';
import AnimeCard, { Anime } from './AnimeCard';
import PageTitleHero from './PageTitleHero';
import { OMDb_API_KEY, OMDb_BASE_URL } from '../apiConfig';

const AnimeList: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimes = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${OMDb_BASE_URL}?s=Guardians of the Galaxy&apikey=${OMDb_API_KEY}`);
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
    fetchAnimes();
  }, []);

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
