import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const MovieList = ({ title, movies }) => {
    const scrollRef = React.useRef(null);

    const scroll = (direction) => {
        const { current } = scrollRef;
        if (direction === 'left') {
            current.scrollLeft -= 500;
        } else {
            current.scrollLeft += 500;
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 px-4">{title}</h2>
            <div className="relative group">
                <div ref={scrollRef} className="flex overflow-x-scroll scrollbar-hide space-x-4 px-4">
                    {movies.map(movie => (
                        <Link to={`/movie/${movie.id}`} key={movie.id} className="flex-none w-64">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="movie-card"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                    alt={movie.title}
                                    className="rounded-lg w-full h-36 object-cover"
                                />
                                <div className="mt-2">
                                    <h3 className="font-semibold truncate">{movie.title}</h3>
                                    <div className="flex justify-between text-sm text-gray-400">
                                        <span>{movie.release_date?.split('-')[0]}</span>
                                        <span>⭐ {movie.vote_average}</span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronLeftIcon className="h-6 w-6" />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <ChevronRightIcon className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
};

export default MovieList;
