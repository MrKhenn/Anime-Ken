import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getMediaDetailsFromSupabase, getGenresFromSupabase, addInteraction, getCommentsForMedia, MediaDetails, Genre, Comment } from '../utils/api';
import { Star, Film, Tv, Calendar, Info, Link as LinkIcon, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface DetailPageProps {
    currentUser: User | null;
}

const DetailPage: React.FC<DetailPageProps> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const mediaType = queryParams.get('type') as 'movie' | 'tv';

  const [details, setDetails] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [genresMap, setGenresMap] = useState<{ [key: number]: string }>({});
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetailsAndComments = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!id) return;
        const genreData = await getGenresFromSupabase();
        const map: { [key: number]: string } = {};
        genreData.forEach(genre => {
          map[genre.id] = genre.name;
        });
        setGenresMap(map);

        const mediaDetails = await getMediaDetailsFromSupabase(id, mediaType);
        setDetails(mediaDetails);

        const mediaComments = await getCommentsForMedia(parseInt(id, 10), mediaType);
        setComments(mediaComments);

      } catch (err) {
        console.error("Error al cargar detalles:", err);
        setError("¡Vaya! No pudimos cargar los detalles de esta joya. Intenta de nuevo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetailsAndComments();
  }, [id, mediaType]);

  const handleLike = async (isLike: boolean) => {
    if (!currentUser || !details) {
      alert('Necesitas iniciar sesión para dar "Me gusta" o "No me gusta".');
      return;
    }
    try {
      await addInteraction(currentUser.id, details.id, details.media_type, isLike ? 'like' : 'dislike');
      alert(`¡Has dado ${isLike ? 'Me gusta' : 'No me gusta'} a ${details.title || details.name}!`);
    } catch (error) {
      alert('Error al registrar tu interacción. Intenta de nuevo.');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser || !details) {
      alert('Necesitas iniciar sesión para comentar.');
      return;
    }
    if (!commentText.trim()) {
      alert('El comentario no puede estar vacío.');
      return;
    }

    setSubmittingComment(true);
    try {
      await addInteraction(currentUser.id, details.id, details.media_type, 'comment', commentText.trim());
      setCommentText('');
      const updatedComments = await getCommentsForMedia(details.id, mediaType);
      setComments(updatedComments);
      alert('¡Comentario añadido con éxito!');
    } catch (error) {
      alert('Error al añadir el comentario. Intenta de nuevo.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-gray-400 text-xl">Cargando los secretos de esta obra maestra...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-gray-400 text-xl">No hay detalles para mostrar. ¿Seguro que existe?</p>
      </div>
    );
  }

  const imageUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';
  const backdropUrl = details.backdrop_path
    ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
    : '';

  const title = details.title || details.name;
  const overview = details.overview || "Sinopsis no disponible. ¡Qué misterio!";
  const releaseDate = details.release_date || details.first_air_date;
  const rating = details.vote_average ? details.vote_average.toFixed(1) : 'N/A';
  const genres = details.genre_ids && details.genre_ids.length > 0
    ? details.genre_ids.map(id => genresMap[id]).filter(Boolean).join(', ')
    : 'Desconocido';

  const omdbDetails = details.omdbDetails;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gray-900 rounded-xl shadow-2xl overflow-hidden border border-red-900"
    >
      {backdropUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        ></div>
      )}

      <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center gap-8">
        <motion.img
          src={imageUrl}
          alt={title}
          className="w-full md:w-80 h-auto rounded-lg shadow-xl border border-gray-700 flex-shrink-0"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />

        <div className="flex-1 text-left">
          <h1 className="text-5xl font-extrabold text-red-600 mb-4 leading-tight">{title}</h1>
          <div className="flex items-center text-gray-300 text-lg mb-4">
            {mediaType === 'movie' ? <Film className="w-6 h-6 mr-2" /> : <Tv className="w-6 h-6 mr-2" />}
            <span>{mediaType === 'movie' ? 'Película' : 'Serie'}</span>
            <span className="mx-3 text-gray-600">|</span>
            <Star className="w-6 h-6 mr-2 text-yellow-400" />
            <span className="font-bold text-yellow-300">{rating}</span>
          </div>

          <p className="text-gray-400 text-lg mb-6 leading-relaxed">{overview}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center text-gray-300">
              <Calendar className="w-5 h-5 mr-2 text-red-500" />
              <span>Fecha de Lanzamiento: {releaseDate}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Info className="w-5 h-5 mr-2 text-red-500" />
              <span>Géneros: {genres}</span>
            </div>
            {omdbDetails && omdbDetails.Director && (
              <div className="flex items-center text-gray-300">
                <LinkIcon className="w-5 h-5 mr-2 text-red-500" />
                <span>Director: {omdbDetails.Director}</span>
              </div>
            )}
            {omdbDetails && omdbDetails.Actors && (
              <div className="flex items-center text-gray-300">
                <LinkIcon className="w-5 h-5 mr-2 text-red-500" />
                <span>Actores: {omdbDetails.Actors}</span>
              </div>
            )}
            {omdbDetails && omdbDetails.Runtime && (
              <div className="flex items-center text-gray-300">
                <LinkIcon className="w-5 h-5 mr-2 text-red-500" />
                <span>Duración: {omdbDetails.Runtime}</span>
              </div>
            )}
          </div>

          <motion.button
            className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors duration-300 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => console.log('Reproducir:', title)}
          >
            Reproducir Ahora
          </motion.button>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <h2 className="text-3xl font-bold text-red-600 mb-6">Interacciones</h2>
            <div className="flex space-x-4 mb-8">
              <motion.button
                onClick={() => handleLike(true)}
                className="flex items-center bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsUp className="w-5 h-5 mr-2" /> Me gusta
              </motion.button>
              <motion.button
                onClick={() => handleLike(false)}
                className="flex items-center bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ThumbsDown className="w-5 h-5 mr-2" /> No me gusta
              </motion.button>
            </div>

            <h3 className="text-2xl font-bold text-red-500 mb-4">Comentarios ({comments.length})</h3>
            {currentUser ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-700 resize-y min-h-[100px]"
                  placeholder="Escribe tu comentario aquí..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  disabled={submittingComment}
                ></textarea>
                <motion.button
                  type="submit"
                  className="mt-4 bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={submittingComment}
                >
                  {submittingComment ? 'Enviando...' : 'Enviar Comentario'}
                </motion.button>
              </form>
            ) : (
              <p className="text-gray-400 mb-8">
                <Link to="/login" className="text-red-500 hover:underline">Inicia sesión</Link> para dejar un comentario.
              </p>
            )}

            <div className="space-y-4">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-left"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <p className="text-gray-300 font-semibold mb-1">
                      {comment.users?.username || 'Usuario Desconocido'}
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-gray-400">{comment.comment_text}</p>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500">Sé el primero en comentar esta joya.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DetailPage;
