import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Anime } from '../components/AnimeCard';
import { useUser } from '../context/UserContext';

interface Interaction {
    likes: string[];
    dislikes: string[];
    comments: { userId: string; username: string; text: string; date: string }[];
}

const DetailPage: React.FC = () => {
    const { imdbID } = useParams<{ imdbID: string }>();
    const [movie, setMovie] = useState<Anime | null>(null);
    const [interactions, setInteractions] = useState<Interaction>({ likes: [], dislikes: [], comments: [] });
    const [streamUrl, setStreamUrl] = useState<string>('');
    const [commentText, setCommentText] = useState('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchDetails = async () => {
            if (!imdbID) return;
            setLoading(true);
            setError(null);

            try {
                // Fetch movie details
                const movieCacheKey = `detail_${imdbID}`;
                const cachedMovie = sessionStorage.getItem(movieCacheKey);
                if (cachedMovie) {
                    setMovie(JSON.parse(cachedMovie));
                } else {
                    const movieResponse = await fetch(`http://localhost:4000/api/detail/${imdbID}`);
                    const movieData = await movieResponse.json();
                    setMovie(movieData);
                    sessionStorage.setItem(movieCacheKey, JSON.stringify(movieData));
                }

                // Fetch interactions
                const interactionsResponse = await fetch(`http://localhost:4000/api/interactions/${imdbID}`);
                const interactionsData = await interactionsResponse.json();
                setInteractions(interactionsData);

                // Fetch stream URL
                const streamResponse = await fetch(`http://localhost:4000/api/stream/${imdbID}`);
                const streamData = await streamResponse.json();
                setStreamUrl(streamData.url);

            } catch (err) {
                setError('Failed to fetch details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [imdbID]);

    const handleInteraction = async (type: 'like' | 'dislike') => {
        if (!user || !imdbID) return;
        try {
            const response = await fetch(`http://localhost:4000/api/interactions/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movieId: imdbID, userId: user.id }),
            });
            const data = await response.json();
            setInteractions(data);
        } catch (error) {
            console.error(`Failed to ${type}`, error);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !imdbID || !commentText.trim()) return;
        try {
            const response = await fetch(`http://localhost:4000/api/interactions/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movieId: imdbID, userId: user.id, username: user.username, text: commentText }),
            });
            const data = await response.json();
            setInteractions(data);
            setCommentText('');
        } catch (error) {
            console.error('Failed to post comment', error);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!movie) return <p>No movie found.</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-red-600 mb-8 text-center">{movie.Title}</h1>
            <div className="flex flex-col md:flex-row">
                <img src={movie.backdrop_path || (movie.Poster !== 'N/A' ? movie.Poster : '')} alt={movie.Title} className="w-full md:w-1/3 rounded-lg" style={{ height: '400px', objectFit: 'cover' }} />
                <div className="md:ml-8 mt-8 md:mt-0">
                    <p><strong>Año:</strong> {movie.Year}</p>
                    <p><strong>Género:</strong> {movie.Genre}</p>
                    <p><strong>Ranking:</strong> {movie.imdbRating}</p>
                    <p><strong>Director:</strong> {movie.Director}</p>
                    <p><strong>Actores:</strong> {movie.Actors}</p>
                    <p><strong>Sinopsis:</strong> {movie.Plot}</p>
                    {movie.trailer && <a href={movie.trailer} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">Ver trailer</a>}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Ver Película</h2>
                {streamUrl ? (
                    <iframe src={streamUrl} title={movie.Title} width="100%" height="500" allowFullScreen></iframe>
                ) : (
                    <p>Cargando video...</p>
                )}
            </div>

            <div className="mt-8 flex justify-end items-center space-x-4">
                <button onClick={() => handleInteraction('like')} disabled={!user} className="bg-transparent border-none text-gray-400 hover:text-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <i className="fas fa-thumbs-up"></i> Me gusta ({interactions.likes.length})
                </button>
                <button onClick={() => handleInteraction('dislike')} disabled={!user} className="bg-transparent border-none text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <i className="fas fa-thumbs-down"></i> No me gusta ({interactions.dislikes.length})
                </button>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Comentarios</h2>
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="mb-8">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control bg-dark text-light border-0"
                                placeholder="Añade un comentario..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button type="submit" className="btn btn-danger"><i className="fas fa-paper-plane"></i></button>
                        </div>
                    </form>
                ) : (
                    <div className="mb-8">
                        <Link to="/login" className="btn btn-danger">Inicia sesión para comentar</Link>
                    </div>
                )}
                <div className="space-y-4">
                    {interactions.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-900 p-4 rounded-lg">
                            <p className="font-semibold text-red-500">{comment.username}</p>
                            <p className="text-gray-300">{comment.text}</p>
                            <p className="text-xs text-gray-500 mt-2">{new Date(comment.date).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailPage;
