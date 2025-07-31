import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';

const Movies = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await axios.get('http://localhost:5000/api/movies/popular');
            setMovies(response.data.results);
        };

        const fetchGenres = async () => {
            const response = await axios.get('http://localhost:5000/api/genres');
            setGenres(response.data.genres);
        };

        fetchMovies();
        fetchGenres();
    }, []);

    const handleGenreChange = async (e) => {
        const genreId = e.target.value;
        setSelectedGenre(genreId);
        if (genreId) {
            const response = await axios.get(`http://localhost:5000/api/movies/genre/${genreId}`);
            setMovies(response.data.results);
        } else {
            const response = await axios.get('http://localhost:5000/api/movies/popular');
            setMovies(response.data.results);
        }
    };

    return (
        <div>
            <h1>Películas</h1>
            <div className="mb-4">
                <select className="form-select" onChange={handleGenreChange} value={selectedGenre}>
                    <option value="">Todos los géneros</option>
                    {genres.map(genre => (
                        <option key={genre.id} value={genre.id}>{genre.name}</option>
                    ))}
                </select>
            </div>
            <MovieList movies={movies} />
        </div>
    );
};

export default Movies;
