import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <h1>Anime Website</h1>
      <nav>
        <Link to="/">Home</Link>
        {/* Add other navigation links here if needed */}
      </nav>
    </header>
  );
};

export default Header;
