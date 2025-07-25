import React, { useState, useCallback } from 'react';
import { Carousel } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Anime } from './AnimeCard';

interface MovieCarouselProps {
  movies: Anime[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies = [] }) => {
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

  if (movies.length === 0) {
    return <div className="text-white text-center py-8">No hay películas para mostrar en el carrusel.</div>;
  }

  return (
    <Carousel fade interval={5000} pause="hover" style={{ height: '500px' }}>
      {movies.map((movie) => (
        <Carousel.Item key={movie.imdbID} onClick={() => handleWatchNow(movie.imdbID)}>
          <img
            className="d-block w-100"
            src={movie.Poster}
            alt={movie.Title}
            style={{ height: '500px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>{movie.Title}</h3>
            <p>Ranking: {movie.imdbRating}</p>
            <p>Categorías: {movie.Genre}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default MovieCarousel;
