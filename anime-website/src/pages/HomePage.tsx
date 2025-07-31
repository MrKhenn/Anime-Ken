import React, { useState, useEffect } from 'react';
import Carousel from '../components/Carousel';
import MovieGrid from '../components/MovieGrid';
import InvisibleLabel from '../components/InvisibleLabel';
import { shuffleArray } from '../utils/helpers';
import { Anime } from '../components/AnimeCard';
import { getCachedMovies, cacheMovies } from '../services/cacheService';

const HomePage: React.FC = () => {
    const [movies, setMovies] = useState<Anime[]>([]);
    const [shuffledPopularMovies, setShuffledPopularMovies] = useState<Anime[]>([]);
    const [shuffledGridMovies, setShuffledGridMovies] = useState<Anime[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            setError(null);

            const cachedMovies = getCachedMovies();
            if (cachedMovies) {
                setMovies(cachedMovies);
                setShuffledPopularMovies(shuffleArray(cachedMovies).slice(0, 5));
                setShuffledGridMovies(shuffleArray(cachedMovies).slice(0, 30));
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:4000/api/movies`);
                const data = await response.json();
                if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
                    const moviesArray = [data];
                    setMovies(moviesArray);
                    setShuffledPopularMovies(shuffleArray(moviesArray).slice(0, 5));
                    setShuffledGridMovies(shuffleArray(moviesArray).slice(0, 30));
                    cacheMovies(moviesArray);
                } else if (Array.isArray(data)) {
                    setMovies(data);
                    setShuffledPopularMovies(shuffleArray(data).slice(0, 5));
                    setShuffledGridMovies(shuffleArray(data).slice(0, 30));
                    cacheMovies(data);
                }
                else {
                    setMovies([]);
                    setError('La respuesta de la API no es un objeto o un array.');
                }
            } catch (err) {
                setError('Failed to fetch movies.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Carousel
                slides={shuffledPopularMovies.map(movie => ({
                    id: movie.imdbID,
                    src: movie.backdrop_path || movie.Poster,
                    alt: movie.Title,
                    caption: movie.Title,
                    description: `Ranking: ${movie.imdbRating} | Categorías: ${movie.Genre}`,
                    link: `/watch/${movie.imdbID}`
                }))}
                height={500}
                fade
            />
            <InvisibleLabel text="Sección de películas populares" />
            <MovieGrid movies={shuffledGridMovies} />
        </>
    );
};

export default HomePage;
