import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTrendingMoviesAndStore, getPopularMoviesAndStore, getPopularTvShowsAndStore, getGenresFromSupabase, Media, Genre } from '../utils/api';
import MovieCard from '../components/MovieCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

interface HomePageProps {
  searchResults: Media[];
  loadingSearch: boolean;
  errorSearch: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ searchResults, loadingSearch, errorSearch }) => {
  const [trendingMovies, setTrendingMovies] = useState<Media[]>([]);
  const [popularMovies, setPopularMovies] = useState<Media[]>([]);
  const [popularTvShows, setPopularTvShows] = useState<Media[]>([]);
  const [genresMap, setGenresMap] = useState<{ [key: number]: string }>({});
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const [errorContent, setErrorContent] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingContent(true);
      setErrorContent(null);
      try {
        const [trending, movies, tvShows, genres] = await Promise.all([
          getTrendingMoviesAndStore(1),
          getPopularMoviesAndStore(1),
          getPopularTvShowsAndStore(1),
          getGenresFromSupabase()
        ]);

        setTrendingMovies(trending);
        setPopularMovies(movies);
        setPopularTvShows(tvShows);

        const map: { [key: number]: string } = {};
        genres.forEach(genre => {
          map[genre.id] = genre.name;
        });
        setGenresMap(map);
      } catch (err) {
        console.error("Error al cargar datos de la página de inicio:", err);
        setErrorContent("¡Vaya! No pudimos cargar el contenido principal. Intenta de nuevo más tarde.");
      } finally {
        setLoadingContent(false);
      }
    };
    fetchData();
  }, []);

  const getGenreNames = (genreIds: number[]): string => {
    if (!genreIds || genreIds.length === 0) return 'Desconocido';
    return genreIds.map(id => genresMap[id] || 'Desconocido').join(', ');
  };

  if (loadingContent) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-gray-400 text-xl">Cargando el universo cinematográfico...</p>
      </div>
    );
  }

  if (errorContent) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <p className="text-red-500 text-xl">{errorContent}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="text-center"
    >
      <h1 className="text-5xl font-extrabold text-red-700 mb-6 tracking-wide">
        Bienvenido a CineNerd
      </h1>
      <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
        Tu destino definitivo para explorar el vasto universo de películas y series.
        Prepárate para perderte en horas de entretenimiento de alta calidad.
      </p>

      {trendingMovies.length > 0 && (
        <motion.div
          className="bg-gray-900 p-6 rounded-xl shadow-2xl mb-12 border border-red-900"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-red-600 mb-6">Películas y Series de la Semana</h2>
          <div id="movieCarousel" className="carousel slide carousel-fade" data-bs-ride="carousel">
            <div className="carousel-indicators">
              {trendingMovies.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#movieCarousel"
                  data-bs-slide-to={index}
                  className={index === 0 ? 'active' : ''}
                  aria-current={index === 0 ? 'true' : 'false'}
                  aria-label={`Slide ${index + 1}`}
                ></button>
              ))}
            </div>
            <div className="carousel-inner rounded-lg">
              {trendingMovies.slice(0, 5).map((item, index) => (
                <div key={item.id} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                  <div className="relative w-full h-[500px] bg-cover bg-center rounded-lg overflow-hidden"
                       style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${item.backdrop_path})` }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent flex flex-col justify-end p-8 text-left">
                      <h3 className="text-5xl font-extrabold text-white mb-3 drop-shadow-lg">{item.title || item.name}</h3>
                      <p className="text-gray-300 text-lg mb-2">{getGenreNames(item.genre_ids)}</p>
                      <div className="flex items-center text-yellow-400 text-xl mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-6 h-6 mr-2 bi bi-star-fill" viewBox="0 0 16 16">
                          <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                        </svg>
                        <span className="font-bold">{item.vote_average.toFixed(1)}</span>
                      </div>
                      <motion.button
                        className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full self-start transition-colors duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => console.log('Ver detalles de:', item.title || item.name)}
                      >
                        Ver ahora
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#movieCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#movieCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </motion.div>
      )}

      {loadingSearch && (
        <p className="text-center text-gray-400 mt-8">Buscando en los confines del multiverso...</p>
      )}

      {errorSearch && (
        <p className="text-center text-red-500 mt-8">{errorSearch}</p>
      )}

      {searchResults.length > 0 && !loadingSearch && (
        <motion.div
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-red-600 mb-6 text-left">Resultados de Búsqueda</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {searchResults.map((item) => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>
      )}

      {popularMovies.length > 0 && (
        <motion.div
          className="mt-12 bg-gray-900 p-6 rounded-xl shadow-2xl border border-red-900"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-red-600 mb-6 text-left">Películas Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} item={movie} />
            ))}
          </div>
        </motion.div>
      )}

      {popularTvShows.length > 0 && (
        <motion.div
          className="mt-12 bg-gray-900 p-6 rounded-xl shadow-2xl border border-red-900"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-red-600 mb-6 text-left">Series Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {popularTvShows.map((tvShow) => (
              <MovieCard key={tvShow.id} item={tvShow} />
            ))}
          </div>
        </motion.div>
      )}

      {searchResults.length === 0 && !loadingSearch && !errorSearch && trendingMovies.length === 0 && popularMovies.length === 0 && popularTvShows.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          Cargando el universo cinematográfico... o quizás no hay nada que mostrar.
        </p>
      )}
    </motion.div>
  );
};

export default HomePage;
