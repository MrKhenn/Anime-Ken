import React from 'react';
import 'sweetalert2/dist/sweetalert2.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AnimeList from './components/AnimeList';
import AnimeDetail from './components/AnimeDetail';
import './App.css'; // Assuming you have some basic app-wide styles

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<AnimeList />} />
            <Route path="/anime/:animeId" element={<AnimeDetail />} />
            {/* You can add more routes here, e.g., for specific genres, user profiles, etc. */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
