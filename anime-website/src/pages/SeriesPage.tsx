import React, { useState, useEffect } from 'react';
import FilterDropdown from '../components/FilterDropdown';
import SeriesCard from '../components/SeriesCard';
import { Anime } from '../components/AnimeCard';

const SeriesPage = () => {
  const [series, setSeries] = useState<Anime[]>([]);
  const [filteredSeries, setFilteredSeries] = useState<Anime[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/series');
      const data = await response.json();

      setSeries(data);
      setFilteredSeries(data);

      const uniqueCategories = Array.from(new Set(data.map((serie: Anime) => serie.Genre).join(', ').split(', ').filter(Boolean)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error al obtener series:', error);
    }
  };

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredSeries(series);
    } else {
      setFilteredSeries(series.filter(serie => serie.Genre && serie.Genre.includes(selectedCategory)));
    }
  }, [selectedCategory, series]);

  return (
    <div className="container mt-4">
      <h1>Series</h1>

      <div className="mb-4">
        <FilterDropdown
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      <div className="row">
        {filteredSeries.map(serie => (
          <div key={serie.imdbID} className="col-md-4 mb-4">
            <SeriesCard serie={serie} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeriesPage;
