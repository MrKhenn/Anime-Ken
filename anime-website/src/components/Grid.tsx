import React from 'react';
import useUnifiedData from '../hooks/useUnifiedData';
import MovieGrid from './MovieGrid';

interface GridProps {
    section: 'movies' | 'series' | 'genres';
    genre?: string;
}

const genres = { 28: 'Action', 12: 'Adventure', 18: 'Drama', 35: 'Comedy' };

const Grid: React.FC<GridProps> = ({ section, genre }) => {
  const { data, loadMore, hasMore } = useUnifiedData(section, genre);

  return (
    <div className="container mx-auto py-8 px-4">
        <MovieGrid movies={data.map(item => ({...item, Genre: Array.isArray(item.genres) ? item.genres.map((id: number) => (genres as any)[id]).join(', ') : ''}))} />
      {hasMore && <button onClick={loadMore} className="bg-red-600 text-white px-4 py-2 rounded-full mt-8">Cargar más</button>}
    </div>
  );
}

export default Grid;
