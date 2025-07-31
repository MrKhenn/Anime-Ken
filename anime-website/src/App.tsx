import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LayoutHeader from './components/LayoutHeader';
import LayoutFooter from './components/LayoutFooter';
import DetailPage from './pages/DetailPage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import GenresPage from './pages/GenresPage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserProvider } from './context/UserContext';
import HomePage from './pages/HomePage'; // Assuming you move the home page logic to a separate component

const App: React.FC = () => {
  const handleSearch = (query: string = '') => {
    if (!query) return;
    window.location.href = `/search?q=${query}`;
  };

  return (
    <Router>
      <UserProvider>
        <div className="min-h-screen bg-black text-white font-sans">
          <LayoutHeader onSearch={handleSearch} />
          <main className="pt-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/series" element={<SeriesPage />} />
              <Route path="/genres" element={<GenresPage />} />
              <Route path="/watch/:imdbID" element={<DetailPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
          <LayoutFooter />
        </div>
      </UserProvider>
    </Router>
  );
};

export default App;
