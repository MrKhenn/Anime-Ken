import React, { useState, useEffect } from 'react';
import AnimeCard, { Anime } from './AnimeCard';

const HomePageMovies: React.FC = () => {
  const [movies, setMovies] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const movieTitles = [
    'Dune: Part Two', 'Pulp Fiction', 'Spider-Man: Across the Spider-Verse',
    'Oppenheimer', 'Inception', 'Barbie', 'Parasite', 'Gladiator',
    'Your Name.', 'Blade Runner 2049', 'Everything Everywhere All at Once',
    'The Godfather', 'La La Land', 'Top Gun: Maverick', 'Forrest Gump',
    'Guardians of the Galaxy Vol. 3', 'Interstellar', 'Whiplash',
    'Killers of the Flower Moon', 'Coco', 'Se7en', 'Arrival',
    'The Lord of the Rings: The Return of the King', 'Amelie',
    'Mad Max: Fury Road', 'The Wolf of Wall Street', 'Roma',
    'Avengers: Endgame', 'Soul', 'The Dark Knight'
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/movies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ titles: movieTitles }),
        });
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError('Failed to fetch movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [movieTitles]);

  return (
    <div className="anime-list">
      {loading && <p>Loading movies...</p>}
      {error && <p>Error: {error}</p>}
      {movies.map(movie => (
        <AnimeCard key={movie.imdbID} anime={movie} />
      ))}
    </div>
  );
};

export default HomePageMovies;
