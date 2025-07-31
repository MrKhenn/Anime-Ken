import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCircleIcon, SearchIcon } from '@heroicons/react/24/solid';

const Header = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?query=${query}`);
        }
    };

    return (
        <nav className="fixed top-0 w-full bg-black bg-opacity-75 text-white p-4 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center space-x-8">
                    <Link to="/" className="text-netflix-red font-bold text-2xl">ANIME-KEN</Link>
                    <ul className="hidden md:flex items-center space-x-6">
                        <li><Link to="/" className="hover:text-gray-400">Inicio</Link></li>
                        <li><Link to="/movies" className="hover:text-gray-400">Películas</Link></li>
                        <li><Link to="/series" className="hover:text-gray-400">Series</Link></li>
                        <li><Link to="/genres" className="hover:text-gray-400">Géneros</Link></li>
                    </ul>
                </div>
                <div className="flex items-center space-x-4">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-dark-bg border border-gray-600 rounded-full px-4 py-1 text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </button>
                    </form>
                    <Link to="/login">
                        <UserCircleIcon className="h-8 w-8 hover:text-netflix-red" />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;
