import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Anime } from '../components/AnimeCard';
import CommentSection from '../components/CommentSection';

const DetailPage: React.FC = () => {
  const { imdbID } = useParams<{ imdbID: string }>();
  console.log('imdbID:', imdbID);
  const [movie, setMovie] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!imdbID) return;
      setLoading(true);
      setError(null);

      const cacheKey = `detail_${imdbID}`;
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setMovie(JSON.parse(cached));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/detail/${imdbID}`);
        const data = await response.json();
        setMovie(data);
        sessionStorage.setItem(cacheKey, JSON.stringify(data));
      } catch (err) {
        setError('Failed to fetch movie details.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [imdbID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!movie) return <p>No movie found.</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">{movie.Title}</h1>
      <div className="flex flex-col md:flex-row">
        <img src={movie.backdrop_path || (movie.Poster !== 'N/A' ? movie.Poster : '')} alt={movie.Title} className="w-full md:w-1/3 rounded-lg" style={{ height: '400px', objectFit: 'cover' }} />
        <div className="md:ml-8 mt-8 md:mt-0">
          <p><strong>Año:</strong> {movie.Year}</p>
          <p><strong>Género:</strong> {movie.Genre}</p>
          <p><strong>Ranking:</strong> {movie.imdbRating}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Actores:</strong> {movie.Actors}</p>
          <p><strong>Sinopsis:</strong> {movie.Plot}</p>
          {movie.trailer && <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Ver trailer</a>}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Ver Película</h2>
        <iframe src={`https://streamtape.com/e/${movie.imdbID}`} title={movie.Title} width="100%" height="500" allowFullScreen></iframe>
      </div>
      <div className="mt-8 flex justify-end space-x-4">
        <button className="bg-transparent border-none text-gray-400 hover:text-green-500 transition-colors">
            <i className="fas fa-thumbs-up"></i> Me gusta
        </button>
        <button className="bg-transparent border-none text-gray-400 hover:text-red-500 transition-colors">
            <i className="fas fa-thumbs-down"></i> No me gusta
        </button>
        <button className="bg-transparent border-none text-gray-400 hover:text-yellow-500 transition-colors">
            <i className="fas fa-flag"></i> Reportar
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Calificaciones y comentarios</h2>
        <div className="flex">
            <div className="w-1/2">
                <button className="btn btn-danger">Inicia sesión para comentar</button>
            </div>
            <div className="w-1/2">
                <div className="input-group">
                    <input type="text" className="form-control bg-dark text-light border-0" placeholder="Añade un comentario..." />
                    <button className="btn btn-danger"><i className="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
        <div className="mt-8">
            <CommentSection />
        </div>
      </div>
    </div>
  );
};

export default DetailPage;
