import React, { useState, useEffect } from 'react';
import FilterDropdown from '../components/FilterDropdown';
import MovieCard from '../components/MovieCard';
import { Anime } from '../components/AnimeCard';

const MoviesPage = () => {
  const [movies, setMovies] = useState<Anime[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Anime[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/movies');
      const data = await response.json();

      setMovies(data);
      setFilteredMovies(data);

      const uniqueCategories = Array.from(new Set(data.map((movie: Anime) => movie.Genre).join(', ').split(', ').filter(Boolean)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error al obtener películas:', error);
    }
  };

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(movies.filter(movie => movie.Genre && movie.Genre.includes(selectedCategory)));
    }
  }, [selectedCategory, movies]);

  return (
    <div className="container mt-4">
      <h1>Películas</h1>

      <div className="mb-4">
        <FilterDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="row">
        {filteredMovies.map(movie => (
          <div key={movie.imdbID} className="col-md-4 mb-4">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviesPage;
