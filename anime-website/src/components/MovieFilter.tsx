import React from 'react';

interface MovieFilterProps {
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

const MovieFilter: React.FC<MovieFilterProps> = ({ onFilterChange = () => {}, currentFilter = '' }) => {
  return (
    <div className="mb-8">
      <label htmlFor="genre-filter" className="block text-gray-300 text-lg font-semibold mb-2">Filtrar por Género:</label>
      <select
        id="genre-filter"
        className="w-full md:w-1/3 bg-gray-900 text-white px-4 py-2 rounded-lg border border-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300"
        onChange={(e) => onFilterChange(e.target.value)}
        value={currentFilter}
      >
        <option value="">Todos los Géneros</option>
        <option value="Acción">Acción</option>
        <option value="Aventura">Aventura</option>
        <option value="Animación">Animación</option>
        <option value="Biografía">Biografía</option>
        <option value="Ciencia ficción">Ciencia ficción</option>
        <option value="Comedia">Comedia</option>
        <option value="Crimen">Crimen</option>
        <option value="Drama">Drama</option>
        <option value="Familia">Familia</option>
        <option value="Fantasía">Fantasía</option>
        <option value="Historia">Historia</option>
        <option value="Música">Música</option>
        <option value="Romance">Romance</option>
        <option value="Thriller">Thriller</option>
        <option value="Western">Western</option>
      </select>
    </div>
  );
};

export default MovieFilter;
