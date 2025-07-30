import React from 'react';
import { Link } from 'react-router-dom';
import './MovieList.css';

const MovieList = ({ movies }) => {
    return (
        <div className="row">
            {movies.map(movie => (
                <div key={movie.id} className="col-md-3 mb-4">
                    <div className="card movie-card">
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="card-img-top" alt={movie.title} />
                        <div className="card-body movie-card-body">
                            <h5 className="card-title">{movie.title}</h5>
                            <p className="card-text">Ranking: {movie.vote_average}</p>
                            <Link to={`/movie/${movie.id}`} className="btn btn-danger">Ver ahora</Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MovieList;
