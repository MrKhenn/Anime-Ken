import React from 'react';

interface Genre {
  id: number;
  name: string;
}

interface GenreDropdownProps {
  genres: Genre[];
  onSelectGenre: (genre: string | null) => void;
  selectedGenre: string | null;
}

const GenreDropdown: React.FC<GenreDropdownProps> = ({ genres, onSelectGenre, selectedGenre }) => {
  return (
    <div className="mb-8">
      <label htmlFor="genre-filter" className="block text-gray-300 text-lg font-semibold mb-2">Filtrar por Género:</label>
      <select
        id="genre-filter"
        className="w-full md:w-1/3 bg-gray-900 text-white px-4 py-2 rounded-lg border border-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
        onChange={(e) => onSelectGenre(e.target.value)}
        value={selectedGenre || ''}
      >
        <option value="">Todos los Géneros</option>
        {genres.map(genre => (
          <option key={genre.id} value={genre.name}>{genre.name}</option>
        ))}
      </select>
    </div>
  );
};

export default GenreDropdown;
