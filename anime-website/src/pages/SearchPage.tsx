import React from 'react';
import { useLocation } from 'react-router-dom';
import Grid from '../components/Grid';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const SearchPage: React.FC = () => {
    const query = useQuery().get('q');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">Resultados de la búsqueda para: "{query}"</h1>
            <Grid section="movies" genre={query || ''} />
        </div>
    );
};

export default SearchPage;
