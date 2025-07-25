import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Anime } from '../components/AnimeCard';

const DetailPage: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  const [movie, setMovie] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5000/api/movies/${imdbID}`);
        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError('Failed to fetch movie details.');
      } finally {
        setLoading(false);
      }
    };

    if (imdbID) {
      fetchMovie();
    }
  }, [imdbID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>No movie found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">{movie.Title}</h1>
      <div className="flex flex-col md:flex-row">
        <img src={movie.Poster} alt={movie.Title} className="w-full md:w-1/3 rounded-lg" />
        <div className="md:ml-8 mt-8 md:mt-0">
          <p><strong>Año:</strong> {movie.Year}</p>
          <p><strong>Género:</strong> {movie.Genre}</p>
          <p><strong>Ranking:</strong> {movie.imdbRating}</p>
          <p><strong>Sinopsis:</strong> Próximamente...</p>
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
