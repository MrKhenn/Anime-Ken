import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);

    useEffect(() => {
        const fetchMovie = async () => {
            const response = await axios.get(`http://localhost:5000/api/movie/${id}`);
            setMovie(response.data);
        };
        fetchMovie();
    }, [id]);

    if (!movie) {
        return <div>Loading...</div>;
    }

    const director = movie.credits.crew.find(person => person.job === 'Director');

    return (
        <div className="row">
            <div className="col-md-4">
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className="img-fluid rounded" alt={movie.title} />
            </div>
            <div className="col-md-8">
                <h1>{movie.title}</h1>
                <p>{movie.overview}</p>
                <p><strong>Fecha de lanzamiento:</strong> {movie.release_date}</p>
                <p><strong>Puntuación:</strong> {movie.vote_average}</p>
                <p><strong>Director:</strong> {director ? director.name : 'N/A'}</p>
                <h5>Elenco:</h5>
                <ul>
                    {movie.credits.cast.slice(0, 10).map(actor => (
                        <li key={actor.cast_id}>{actor.name} como {actor.character}</li>
                    ))}
                </ul>
                <div className="mt-4">
                    <iframe
                        src={`https://streamtape.com/e/`}
                        width="100%"
                        height="450"
                        allowFullScreen
                        title="Streamtape Player"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default MovieDetail;
