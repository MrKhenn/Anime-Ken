import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { Anime } from './AnimeCard';
import './TopMoviesCarousel.css';

const TopMoviesCarousel: React.FC = () => {
  const [movies, setMovies] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        // Haremos una búsqueda amplia y luego filtraremos y ordenaremos los resultados
        const response = await fetch(`http://localhost:5000/api/search?query=2025`);
        const data = await response.json();
        if (data.Response === "True") {
          const sortedMovies = data.Search
            .filter((movie: Anime) => movie.imdbRating && movie.imdbRating !== 'N/A')
            .sort((a: Anime, b: Anime) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating))
            .slice(0, 10);
          setMovies(sortedMovies);
        } else {
          setError(data.Error);
        }
      } catch (err) {
        setError('Failed to fetch top movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovies();
  }, []);

  if (loading) return <p>Loading carousel...</p>;
  if (error) return <p>Error loading carousel: {error}</p>;

  return (
    <Carousel>
      {movies.map(movie => (
        <Carousel.Item key={movie.imdbID}>
          <img
            className="d-block w-100"
            src={movie.Poster}
            alt={movie.Title}
          />
          <Carousel.Caption>
            <h3>{movie.Title}</h3>
            <p>{movie.Year} - ★ {movie.imdbRating}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default TopMoviesCarousel;
