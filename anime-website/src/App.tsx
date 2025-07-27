import React, { useState, useEffect, useMemo } from 'react';
import LayoutHeader from './components/LayoutHeader';
import Carousel from './components/Carousel';
import MovieGrid from './components/MovieGrid';
import LayoutFooter from './components/LayoutFooter';
import InvisibleLabel from './components/InvisibleLabel';
import { shuffleArray } from './utils/helpers';
import { Anime } from './components/AnimeCard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DetailPage from './pages/DetailPage';
import { getCachedMovies, cacheMovies } from './services/cacheService';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import GenresPage from './pages/GenresPage';

const App: React.FC = () => {
  const [, setCurrentPage] = useState('home');
  const [movies, setMovies] = useState<Anime[]>([]);
  const [shuffledPopularMovies, setShuffledPopularMovies] = useState<Anime[]>([]);
  const [shuffledGridMovies, setShuffledGridMovies] = useState<Anime[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      const cachedMovies = getCachedMovies();
      if (cachedMovies) {
        setMovies(cachedMovies);
        setShuffledPopularMovies(shuffleArray(cachedMovies).slice(0, 5));
        setShuffledGridMovies(shuffleArray(cachedMovies).slice(0, 30));
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/api/movies`);
        const data = await response.json();
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          const moviesArray = [data];
          setMovies(moviesArray);
          setShuffledPopularMovies(shuffleArray(moviesArray).slice(0, 5));
          setShuffledGridMovies(shuffleArray(moviesArray).slice(0, 30));
          cacheMovies(moviesArray);
        } else if (Array.isArray(data)) {
          setMovies(data);
          setShuffledPopularMovies(shuffleArray(data).slice(0, 5));
          setShuffledGridMovies(shuffleArray(data).slice(0, 30));
          cacheMovies(data);
        }
        else {
          setMovies([]);
          setError('La respuesta de la API no es un objeto o un array.');
        }
      } catch (err) {
        setError('Failed to fetch movies.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = async (query: string = '') => {
    if (!query) return;
    setLoading(true);
    setError(null);

    const cacheKey = `search_${query}`;
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      const data = JSON.parse(cached);
      setMovies(data);
      setShuffledGridMovies(data);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/search?q=${query}`);
      const data = await response.json();
      setMovies(data);
      setShuffledGridMovies(data);
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      setError('Failed to fetch search results.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    console.log('Iniciar sesión clickeado');
    // Lógica para mostrar un modal de inicio de sesión
  };

  const handleNavigate = (page: string = 'home') => {
    setCurrentPage(page);
    setSelectedGenre(''); // Reset filter when navigating
    console.log('Navegando a:', page);
  };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans">
        <LayoutHeader onSearch={handleSearch} onLogin={handleLogin} onNavigate={handleNavigate} />

        <main className="pt-0">
          <Routes>
            <Route path="/" element={
              <>
                <Carousel
                  slides={shuffledPopularMovies.map(movie => ({
                    id: movie.imdbID,
                    src: movie.backdrop_path || movie.Poster,
                    alt: movie.Title,
                    caption: movie.Title,
                    description: `Ranking: ${movie.imdbRating} | Categorías: ${movie.Genre}`,
                    link: `/watch/${movie.imdbID}`
                  }))}
                  height={500}
                  fade
                />
                <InvisibleLabel text="Sección de películas populares" />
                <MovieGrid movies={shuffledGridMovies} />
              </>
            } />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/watch/:imdbID" element={<DetailPage />} />
          </Routes>
        </main>

        <LayoutFooter />
      </div>
    </Router>
  );
};

export default App;
