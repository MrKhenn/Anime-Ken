import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import { searchMediaFromSupabase, fetchAndStoreGenres, Media } from './utils/api';
import HomePage from './pages/HomePage';
import MoviesPage from './pages/MoviesPage';
import SeriesPage from './pages/SeriesPage';
import GenresPage from './pages/GenresPage';
import DetailPage from './pages/DetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { User as UserIcon, LogOut } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { supabase } from './utils/supabase';
import { User } from '@supabase/supabase-js';

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Media[]>([]);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [errorSearch, setErrorSearch] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const syncInitialData = async () => {
      try {
        await fetchAndStoreGenres();
      } catch (err: any) {
        setGlobalError("Error al sincronizar datos iniciales: " + err.message);
        console.error("Error al sincronizar datos iniciales:", err);
      }
    };
    syncInitialData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (err: any) {
        setGlobalError("Error al obtener el usuario: " + err.message);
        console.error("Error al obtener el usuario:", err);
      }
    };
    getUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSearch = async (query: string) => {
    setLoadingSearch(true);
    setErrorSearch(null);
    try {
      const results = await searchMediaFromSupabase(query);
      setSearchResults(results);
    } catch (err) {
      setErrorSearch("¡Ups! Parece que el universo de las películas no quiere cooperar hoy. Intenta de nuevo más tarde.");
      console.error(err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error: any) {
      setGlobalError("Error al cerrar sesión: " + error.message);
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white">
        {globalError && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-0 right-0 bg-red-800 text-white p-3 text-center z-50 shadow-lg"
          >
            <p className="font-bold">¡Error crítico! {globalError}</p>
            <button onClick={() => setGlobalError(null)} className="ml-4 text-white/80 hover:text-white font-semibold">
              X
            </button>
          </motion.div>
        )}

        <motion.nav
          className="bg-gray-900 p-3 shadow-lg border-b border-red-900"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-3xl font-extrabold text-red-700 hover:text-red-600 transition-colors tracking-wide">
              CineNerd
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">Inicio</Link>
              <Link to="/peliculas" className="text-gray-300 hover:text-white transition-colors font-medium">Películas</Link>
              <Link to="/series" className="text-gray-300 hover:text-white transition-colors font-medium">Series</Link>
              <Link to="/genero" className="text-gray-300 hover:text-white transition-colors font-medium">Géneros</Link>
              <SearchBar onSearch={handleSearch} />
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-300 text-sm hidden md:block">Hola, {user.user_metadata?.username || user.email}</span>
                  <motion.button
                    onClick={handleLogout}
                    className="p-2 rounded-full bg-red-700 hover:bg-red-600 text-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Cerrar Sesión"
                  >
                    <LogOut className="w-5 h-5" />
                  </motion.button>
                </div>
              ) : (
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">
                  <UserIcon className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>
        </motion.nav>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<HomePage searchResults={searchResults} loadingSearch={loadingSearch} errorSearch={errorSearch} />} />
            <Route path="/peliculas" element={<MoviesPage />} />
            <Route path="/series" element={<SeriesPage />} />
            <Route path="/genero" element={<GenresPage />} />
            <Route path="/detalle/:id" element={<DetailPage currentUser={user} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
