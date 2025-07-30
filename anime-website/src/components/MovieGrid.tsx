import React from 'react';
import Swal from 'sweetalert2';
import { Anime } from './AnimeCard';

interface MovieGridProps {
  movies: Anime[];
}

const MovieGrid: React.FC<MovieGridProps> = ({ movies = [] }) => {
  const handleWatchNow = (movie: Anime) => {
    Swal.fire({
      title: movie.title,
      imageUrl: movie.poster,
      imageAlt: movie.title,
      background: '#000',
      showCancelButton: true,
      confirmButtonText: 'Ver ahora',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      customClass: {
        title: 'text-white',
        popup: 'border-2 border-red-600',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = `/watch/${movie.imdbID}`;
      }
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {movies.filter(movie => movie.imdbID).map((movie) => (
          <div key={movie.imdbID} className="card" onClick={() => handleWatchNow(movie)}>
            <img
              src={movie.poster}
              alt={movie.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://via.placeholder.com/300x450?text=No+Image';
              }}
            />
            <div className="overlay">
              <h3>{movie.title}</h3>
              <p>{movie.year} | {(movie.Genre || '').split(',')[0]}</p>
              <p>⭐ {movie.imdbRating}</p>
              <a href={`/watch/${movie.imdbID}`}>Ver más</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieGrid;
