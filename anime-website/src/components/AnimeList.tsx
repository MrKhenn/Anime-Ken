import React from 'react';
import AnimeCard from './AnimeCard';
import PageTitleHero from './PageTitleHero';
import { mockMovies } from '../mockMovies';

const AnimeList: React.FC = () => {
  return (
    <>
      <PageTitleHero />
      <div className="anime-list">
        {mockMovies.map(movie => (
          <AnimeCard key={movie.imdbID} anime={movie} />
        ))}
      </div>
    </>
  );
};

export default AnimeList;
