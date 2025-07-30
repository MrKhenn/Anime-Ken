import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import SeriesCard from '../components/SeriesCard';
import { Anime } from '../components/AnimeCard';

const GenresPage = () => {
  const [items, setItems] = useState<Anime[]>([]);
  const [filteredItems, setFilteredItems] = useState<Anime[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const [moviesRes, seriesRes] = await Promise.all([
        fetch('http://localhost:4000/api/movies'),
        fetch('http://localhost:4000/api/series')
      ]);

      const movies = await moviesRes.json();
      const series = await seriesRes.json();

      const allItems = [...movies, ...series];
      setItems(allItems);
      setFilteredItems(allItems);

      const uniqueGenres = Array.from(new Set(allItems.map(item => item.Genre).join(', ').split(', ').filter(Boolean)));
      setGenres(uniqueGenres);
    } catch (error) {
      console.error('Error al obtener contenido:', error);
    }
  };

  useEffect(() => {
    if (selectedGenre === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item =>
        (item.Genre && item.Genre.includes(selectedGenre))
      ));
    }
  }, [selectedGenre, items]);

  const renderItem = (item: Anime) => {
    // Assuming 'type' property exists on the item to distinguish between movie and series
    if ('Type' in item && item.Type === 'series') {
        return <SeriesCard key={item.imdbID} serie={item} />;
    }
    return <MovieCard key={item.imdbID} movie={item} />;
  };

  return (
    <div className="container mt-4">
      <h1>Géneros</h1>

      <div className="mb-4">
        <div className="btn-group" role="group">
          <button
            className={`btn btn-outline-primary ${selectedGenre === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedGenre('all')}
          >
            Todo
          </button>
          {genres.map(genre => (
            <button
              key={genre}
              className={`btn btn-outline-primary ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="row">
        {filteredItems.map(item => (
          <div key={item.imdbID} className="col-md-4 mb-4">
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenresPage;
