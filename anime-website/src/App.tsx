import React from 'react';
import { SearchProvider } from './context/SearchContext';
import 'sweetalert2/dist/sweetalert2.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimeList from './components/AnimeList';
import AnimeDetail from './components/AnimeDetail';
import PremieresPage from './pages/PremieresPage';
import AboutPage from './pages/AboutPage';
import WatchPage from './pages/WatchPage';
import SearchPage from './pages/SearchPage';
import './App.css'; // Assuming you have some basic app-wide styles

const App: React.FC = () => {
  return (
    <SearchProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<AnimeList />} />
              <Route path="/movie/:imdbID" element={<AnimeDetail />} />
              <Route path="/premieres" element={<PremieresPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/watch/:animeId" element={<WatchPage />} />
              <Route path="/search" element={<SearchPage />} />
              {/* You can add more routes here, e.g., for specific genres, user profiles, etc. */}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </SearchProvider>
  );
};

export default App;
