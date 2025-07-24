import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { Anime } from './AnimeCard';
import './HeroCarousel.css';

const popularMovies = [
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

const HeroCarousel: React.FC = () => {
  const [movies, setMovies] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      if (movies.length > 0) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const shuffled = popularMovies.sort(() => 0.5 - Math.random());
        const selectedTitles = shuffled.slice(0, 5);

        const response = await fetch(`http://localhost:5000/api/movies`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ titles: selectedTitles }),
        });
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError('Failed to fetch movies for carousel.');
      } finally {
        setLoading(false);
      }
    };

    fetchRandomMovies();
  }, [movies.length]);

  if (loading) return <p>Loading carousel...</p>;
  if (error) return <p>Error loading carousel: {error}</p>;

  return (
    <Carousel>
      {movies.map(movie => (
        <Carousel.Item key={movie.imdbID}>
          <img
            className="d-block w-100 hero-carousel-image"
            src={movie.Poster}
            alt={movie.Title}
          />
          <Carousel.Caption className="hero-carousel-caption">
            <h3>{movie.Title}</h3>
            <p>🌟🌟🌟🌟🌟 Digno de Oscar</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default HeroCarousel;
