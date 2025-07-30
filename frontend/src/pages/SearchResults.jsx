import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

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
            <div className="row">
                {results.map(item => (
                    <div key={item.id} className="col-md-3 mb-4">
                        <div className="card bg-dark text-white">
                            <img src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} className="card-img-top" alt={item.title || item.name} />
                            <div className="card-body">
                                <h5 className="card-title">{item.title || item.name}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
