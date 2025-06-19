import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserCircle, FaFilm } from 'react-icons/fa'; // Using FaFilm as a generic logo
import './Header.css'; // We will create this CSS file in the next step

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <FaFilm className="logo-icon" />
          <span className="logo-text">AniSite</span>
        </Link>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          {/* Add more links here if needed, e.g., <Link to="/browse">Browse</Link> */}
        </nav>
      </div>
      <div className="header-right">
        <div className="search-bar">
          <input type="text" placeholder="Search anime..." />
          <button type="submit" aria-label="Search">
            <FaSearch />
          </button>
        </div>
        <FaUserCircle className="user-icon" />
      </div>
    </header>
  );
};

export default Header;
