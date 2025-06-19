import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch as FaSearchOrig, FaUserCircle as FaUserCircleOrig, FaPlayCircle as FaPlayCircleOrig } from 'react-icons/fa';
import './Header.css';

const FaPlayCircle = FaPlayCircleOrig as any;
const FaSearch = FaSearchOrig as any;
const FaUserCircle = FaUserCircleOrig as any;

const Header: React.FC = () => {
  return (
    <header className="site-header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <FaPlayCircle className="logo-icon" />
          <span className="logo-text">Ani-Verse</span>
        </Link>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/premieres">Estrenos</Link>
          <Link to="/about">Acerca de</Link>
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
