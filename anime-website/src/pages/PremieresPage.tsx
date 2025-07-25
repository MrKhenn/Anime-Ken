import React, { useEffect, useState } from 'react';
import AnimeCard from '../components/AnimeCard'; // Assuming AnimeCard can be reused

const PremieresPage: React.FC = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremieres = async () => {
      try {
        const response = await fetch('/premieres.json');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching premieres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPremieres();
  }, []);

  if (loading) {
    return <p>Loading premieres...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>Estrenos 2025</h1>
      <div className="anime-list">
        {movies.map((movie) => (
          <AnimeCard
            key={movie.title}
            anime={{
              imdbID: movie.title,
              Title: movie.title,
              Year: '2025',
              Poster: movie.poster,
              imdbRating: 'N/A',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PremieresPage;
