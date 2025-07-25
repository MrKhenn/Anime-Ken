import React from 'react';
import Swal from 'sweetalert2';
import { Anime } from './AnimeCard';

interface MovieGridProps {
  movies: Anime[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies = [] }) => {
  const handleWatchNow = (imdbID: string) => {
    Swal.fire({
      title: '¿Ver ahora?',
      text: 'Serás redirigido a la página de detalles de la película.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, ver ahora',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/watch/${imdbID}`;
      }
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.map((movie) => (
          <div key={movie.imdbID} className="relative group rounded-lg overflow-hidden shadow-xl border border-red-900 hover:border-red-600 transition-all duration-300 transform hover:scale-105" onClick={() => handleWatchNow(movie.imdbID)}>
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <div className="text-white">
                <h3 className="text-lg font-bold">{movie.Title}</h3>
                <p className="text-sm text-gray-300">{movie.Year} | {movie.Genre}</p>
                <div className="flex items-center mt-1">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.729c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"></path></svg>
                  <span className="text-sm font-semibold">{movie.imdbRating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
