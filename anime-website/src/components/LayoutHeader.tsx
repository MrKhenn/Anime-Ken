import React from 'react';

interface LayoutHeaderProps {
  onSearch?: (query: string) => void;
  onLogin?: () => void;
  onNavigate?: (page: string) => void;
}

const LayoutHeader: React.FC<LayoutHeaderProps> = ({ onSearch = () => {}, onLogin = () => {}, onNavigate = () => {} }) => {
  return (
    <header className="bg-black text-white p-3 border-b border-red-800 shadow-lg"> {/* p-3 para reducir altura */}
      <div className="container mx-auto flex justify-between items-center">
        <nav className="flex space-x-6">
          <button onClick={() => onNavigate('home')} className="text-lg font-semibold hover:text-red-600 transition-colors">Inicio</button>
          <button onClick={() => onNavigate('movies')} className="text-lg font-semibold hover:text-red-600 transition-colors">Películas</button>
          <button onClick={() => onNavigate('series')} className="text-lg font-semibold hover:text-red-600 transition-colors">Series</button>
          <button onClick={() => onNavigate('genres')} className="text-lg font-semibold hover:text-red-600 transition-colors">Géneros</button>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar..."
              className="bg-gray-900 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-red-600 transition-all duration-300 w-48 md:w-64"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSearch(e.currentTarget.value);
                }
              }}
            />
            <svg
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
          <button onClick={onLogin} className="p-2 rounded-full hover:bg-red-800 transition-colors">
            <svg
              className="w-6 h-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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
          </button>
        </div>
      </div>
    </header>
  );
};

export default LayoutHeader;
