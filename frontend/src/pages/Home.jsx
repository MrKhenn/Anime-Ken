import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await axios.get('http://localhost:5000/api/movies/popular');
            setMovies(response.data.results.slice(0, 5));
            setPopularMovies(response.data.results);
        };
        fetchMovies();
    }, []);

    return (
        <div className="bg-dark-bg">
            <Carousel>
                {movies.map(movie => (
                    <Carousel.Item key={movie.id} style={{ height: '80vh' }}>
                        <img
                            className="d-block w-100"
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                            style={{ objectFit: 'cover', height: '100%' }}
                        />
                        <Carousel.Caption className="bg-black bg-opacity-50 p-4 rounded">
                            <h3>{movie.title}</h3>
                            <p>{movie.overview}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            <div className="container mx-auto mt-8">
                <MovieList title="Populares en Anime-Ken" movies={popularMovies} />
            </div>
        </div>
    );
};

export default Home;
