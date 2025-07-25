import React, { useState, useCallback } from 'react';
import { Anime } from './AnimeCard';

interface MovieCarouselProps {
  movies: Anime[];
}

const MovieCarousel: React.FC<MovieCarouselProps> = ({ movies = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
  }, [movies.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + movies.length) % movies.length);
  }, [movies.length]);

  const goToSlide = useCallback((slideIndex: number) => {
    setCurrentIndex(slideIndex);
  }, []);

  if (movies.length === 0) {
    return <div className="text-white text-center py-8">No hay películas para mostrar en el carrusel.</div>;
  }

  return (
    <div className="relative w-full overflow-hidden bg-black py-8">
      <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
        {movies.map((movie, index) => (
          <div
            key={movie.imdbID}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex items-end p-8">
              <h3 className="text-white text-4xl md:text-5xl font-bold drop-shadow-lg">{movie.Title}</h3>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-red-800 p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-800 p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentIndex ? 'bg-red-600' : 'bg-gray-600 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;
