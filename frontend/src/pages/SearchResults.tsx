import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import MovieList from '../components/MovieList';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
                setResults(response.data.results);
            };
            fetchResults();
        }
    }, [query]);

    return (
        <div>
            <h1>Resultados de Búsqueda para "{query}"</h1>
            <MovieList movies={results} />
        </div>
    );
};

export default SearchResults;
