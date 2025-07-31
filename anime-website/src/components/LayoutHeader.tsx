import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface LayoutHeaderProps {
  onSearch?: (query: string) => void;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({ onSearch = () => {} }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-black text-white p-2 border-b border-red-800 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold text-red-600">
            KenMovie
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-md font-semibold hover:text-red-600 transition-colors">Inicio</Link>
            <Link to="/movies" className="text-md font-semibold hover:text-red-600 transition-colors">Películas</Link>
            <Link to="/series" className="text-md font-semibold hover:text-red-600 transition-colors">Series</Link>
            <Link to="/genres" className="text-md font-semibold hover:text-red-600 transition-colors">Géneros</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-gray-900 text-white px-3 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300 w-32 md:w-48"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSearch(e.currentTarget.value);
                }
              }}
            />
            <svg
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-semibold">Hola, {user.username}</span>
              <button onClick={handleLogout} className="bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="p-1 rounded-full hover:bg-red-800 transition-colors">
              <svg
                className="w-5 h-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;
