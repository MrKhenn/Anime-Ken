import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-bootstrap';
import MovieList from '../components/MovieList';
import './Home.css';

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
        <div>
            <Carousel className="full-width-carousel">
                {movies.map(movie => (
                    <Carousel.Item key={movie.id}>
                        <img
                            className="d-block w-100"
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                        />
                        <Carousel.Caption>
                            <h3>{movie.title}</h3>
                            <p>{movie.overview}</p>
                        </Carousel.Caption>
                    </Carousel.Item>
                ))}
            </Carousel>

            <div className="container mt-5">
                <h2>Descripción de la Página</h2>
                <p>
                    Bienvenido a nuestra plataforma de streaming de películas y series. Aquí encontrarás una gran variedad de contenido para disfrutar.
                </p>
            </div>

            <div className="container mt-5">
                <h2>Películas Populares</h2>
                <MovieList movies={popularMovies} />
            </div>
        </div>
    );
};

export default Home;
