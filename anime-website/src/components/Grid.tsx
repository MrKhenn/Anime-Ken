import React from 'react';
import useUnifiedData from '../hooks/useUnifiedData';
import MovieGrid from './MovieGrid';

interface GridProps {
    section: 'movies' | 'series' | 'genres';
    genre?: string;
}

const genresList = { 28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime', 99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History', 27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction', 10770: 'TV Movie', 53: 'Thriller', 10752: 'War' };

const Grid: React.FC<GridProps> = ({ section, genre }) => {
  const { data, loadMore, hasMore } = useUnifiedData(section, genre);

  return (
    <div className="container mx-auto py-8 px-4">
        <MovieGrid movies={data.map(item => ({...item, Genre: Array.isArray(item.genres) ? item.genres.map((id: number) => (genresList as any)[id]).join(', ') : ''}))} />
      {hasMore && <button onClick={loadMore} className="bg-red-600 text-white px-4 py-2 rounded-full mt-8">Cargar más</button>}
    </div>
  );
}

export default Grid;
