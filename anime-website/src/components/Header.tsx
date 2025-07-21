import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch as FaSearchOrig, FaUserCircle as FaUserCircleOrig, FaPlayCircle as FaPlayCircleOrig } from 'react-icons/fa';
import './Header.css';

// Type assertion workaround for react-icons
const FaPlayCircle = FaPlayCircleOrig as any;
const FaSearch = FaSearchOrig as any;
const FaUserCircle = FaUserCircleOrig as any;

const Header: React.FC = () => {
  const [localQuery, setLocalQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (localQuery.trim()) {
      navigate(`/search?query=${localQuery.trim()}`);
    }
  };

  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <FaPlayCircle className="logo-icon" />
          <span className="logo-text">MovieStream</span>
        </Link>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/premieres">Estrenos</Link>
          <Link to="/about">Acerca de</Link>
        </nav>
      </div>
      <div className="header-right">
        <form className="search-bar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search for movies..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </form>
        <FaUserCircle className="user-icon" />
      </div>
    </header>
  );
};

export default Header;
