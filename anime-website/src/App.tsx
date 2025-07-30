import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutHeader from './components/LayoutHeader';
import LayoutFooter from './components/LayoutFooter';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import GenresPage from './pages/GenresPage';
import DetailPage from './pages/DetailPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  const handleSearch = (query: string = '') => {
    if (!query) return;
    window.location.href = `/search?q=${query}`;
  };

  const handleLogin = () => {
    console.log('Iniciar sesión clickeado');
  };

  const handleNavigate = (page: string = 'home') => {
    console.log('Navegando a:', page);
  };

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans">
        <LayoutHeader onSearch={handleSearch} onLogin={handleLogin} onNavigate={handleNavigate} />

        <main className="pt-0">
          <Routes>
            <Route path="/" element={<MoviesPage />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/genres" element={<GenresPage />} />
            <Route path="/watch/:imdbID" element={<DetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login"
             element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>

        <LayoutFooter />
      </div>
    </Router>
  );
};

export default App;
