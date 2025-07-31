import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MovieList from '../components/MovieList';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [popularMovies, setPopularMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            const response = await axios.get('http://localhost:5000/api/movies/popular');
            setMovies(response.data.results);
            setPopularMovies(response.data.results);
        };
        fetchMovies();
    }, []);

    const featuredMovie = movies[0];

    return (
        <div>
            {featuredMovie && (
                <div className="relative h-screen -mt-20">
                    <img
                        src={`https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path}`}
                        className="w-full h-full object-cover"
                        alt={featuredMovie.title}
                    />
                    <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black via-transparent to-transparent w-full h-1/2 p-12">
                        <h1 className="text-5xl font-bold mb-4">{featuredMovie.title}</h1>
                        <p className="max-w-2xl mb-6">{featuredMovie.overview}</p>
                        <div className="flex space-x-4">
                            <button className="bg-white text-black px-8 py-2 rounded hover:bg-opacity-80">
                                Reproducir
                            </button>
                            <button className="bg-gray-600 bg-opacity-70 px-8 py-2 rounded hover:bg-opacity-50">
                                + Mi Lista
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto mt-8">
                <MovieList title="Populares en Anime-Ken" movies={popularMovies} />
            </div>
        </div>
    );
};

export default Home;
