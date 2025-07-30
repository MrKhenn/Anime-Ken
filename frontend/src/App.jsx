import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import Genres from './pages/Genres';
import SearchResults from './pages/SearchResults';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

function App() {
    return (
        <Router>
            <Header />
            <main className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movies" element={<Movies />} />
                    <Route path="/series" element={<Series />} />
                    <Route path="/genres" element={<Genres />} />
                    <Route path="/search" element={<SearchResults />} />
                </Routes>
            </main>
            <Footer />
        </Router>
    );
}

export default App;
