import React, { useState, useEffect, useMemo } from 'react';
import LayoutHeader from './components/LayoutHeader';
import MovieCarousel from './components/MovieCarousel';
import MovieGrid from './components/MovieGrid';
import LayoutFooter from './components/LayoutFooter';
import InvisibleLabel from './components/InvisibleLabel';
import MovieFilter from './components/MovieFilter';
import GenreButtons from './components/GenreButtons';
import { shuffleArray } from './utils/helpers';
import { Anime } from './components/AnimeCard';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DetailPage from './pages/DetailPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
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
      try {
        const response = await fetch(`http://localhost:5000/api/movies/popular`);
        const data = await response.json();
        if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
          const moviesArray = [data];
          setMovies(moviesArray);
          setShuffledPopularMovies(shuffleArray(moviesArray).slice(0, 5));
          setShuffledGridMovies(shuffleArray(moviesArray).slice(0, 30));
        } else if (Array.isArray(data)) {
          setMovies(data);
          setShuffledPopularMovies(shuffleArray(data).slice(0, 5));
          setShuffledGridMovies(shuffleArray(data).slice(0, 30));
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

  const handleSearch = (query: string = '') => {
    console.log('Buscando:', query);
    // Lógica para filtrar películas o navegar a una página de resultados
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

  const handleFilterChange = (genre: string = '') => {
    setSelectedGenre(genre);
  };

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    movies.forEach(movie => {
      (movie.Genre || '').split(', ').forEach(g => genres.add(g));
    });
    return Array.from(genres).sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    if (!selectedGenre) {
      return movies;
    }
    return movies.filter(movie => (movie.Genre || '').includes(selectedGenre));
  }, [selectedGenre, movies]);

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
                <MovieCarousel movies={shuffledPopularMovies} />
                <InvisibleLabel text="Sección de películas populares" />
                <MovieGrid movies={shuffledGridMovies} />
              </>
            } />
            <Route path="/movies" element={
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-4xl font-bold text-red-600 mb-8 text-center">Todas las Películas</h2>
                <MovieFilter onFilterChange={handleFilterChange} currentFilter={selectedGenre} />
                <MovieGrid movies={filteredMovies} />
              </div>
            } />
            <Route path="/series" element={
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-4xl font-bold text-red-600 mb-8 text-center">Próximamente: Series</h2>
                <MovieFilter onFilterChange={handleFilterChange} currentFilter={selectedGenre} />
                <p className="text-center text-gray-400 mt-4">¡Estamos trabajando en ello! Vuelve pronto para ver nuestras series.</p>
                <MovieGrid movies={filteredMovies.filter(movie => (movie.Type || '').includes('series'))} />
              </div>
            } />
            <Route path="/genres" element={
              <div className="container mx-auto px-4 py-8">
                <h2 className="text-4xl font-bold text-red-600 mb-8 text-center">Explorar Géneros</h2>
                <GenreButtons genres={allGenres} onSelectGenre={handleFilterChange} selectedGenre={selectedGenre} />
                <MovieGrid movies={filteredMovies} />
              </div>
            } />
            <Route path="/watch/:imdbID" element={<DetailPage />} />
          </Routes>
        </main>

        <LayoutFooter />
      </div>
    </Router>
  );
};

export default App;
