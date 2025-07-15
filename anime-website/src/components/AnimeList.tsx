import React from 'react';
import MovieCard, { Movie } from './MovieCard';
import PageTitleHero from './PageTitleHero';

const mockMovie: Movie = {
  Title: 'Lilo y Stitch',
  Year: '2025',
  imdbID: 'tt10384958',
  Type: 'Comedia/Ciencia ficción',
  Poster: 'https://www.cineycine.com/archivos/2021/04/lilo-y-stitch-poster.jpg',
  Plot: 'Una nueva versión de la película de 2002 que sigue las aventuras de una joven solitaria que adopta a una extraña criatura azul del espacio exterior.',
  Genre: 'Comedia, Ciencia ficción',
};

const AnimeList: React.FC = () => {
  return (
    <>
      <PageTitleHero />
      <div className="anime-list">
        <MovieCard movie={mockMovie} />
      </div>
    </>
  );
};

export default AnimeList;
