import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';

const Genres = () => {
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);

    useEffect(() => {
        const fetchGenres = async () => {
            const response = await axios.get('http://localhost:5000/api/genres');
            setGenres(response.data.genres);
        };
        fetchGenres();
    }, []);

    const handleGenreClick = async (genreId) => {
        setSelectedGenre(genreId);
        const response = await axios.get(`http://localhost:5000/api/movies/genre/${genreId}`);
        setMovies(response.data.results);
    };

    return (
        <div>
            <h1>Géneros</h1>
            <div>
                {genres.map(genre => (
                    <button
                        key={genre.id}
                        className={`btn ${selectedGenre === genre.id ? 'btn-danger' : 'btn-outline-danger'} me-2 mb-2`}
                        onClick={() => handleGenreClick(genre.id)}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
            <div className="mt-4">
                <MovieList movies={movies} />
            </div>
        </div>
    );
};

export default Genres;
