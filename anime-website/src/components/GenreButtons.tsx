import React from 'react';

interface GenreButtonsProps {
  genres: string[];
  onSelectGenre: (genre: string) => void;
  selectedGenre: string;
}

const GenreButtons: React.FC<GenreButtonsProps> = ({ genres = [], onSelectGenre = () => {}, selectedGenre = '' }) => {
  return (
    <div className="mb-8 flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onSelectGenre('')}
        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          selectedGenre === ''
            ? 'bg-red-600 text-white shadow-lg'
            : 'bg-gray-800 text-gray-300 hover:bg-red-800 hover:text-white'
        }`}
      >
        Todos
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelectGenre(genre)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedGenre === genre
              ? 'bg-red-600 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 hover:bg-red-800 hover:text-white'
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
};

export default GenreButtons;
