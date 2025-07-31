import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { signInUser } from '../utils/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInUser(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
    >
      <div className="bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md border border-red-900">
        <h1 className="text-4xl font-bold text-red-700 mb-6 text-center">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-300"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 bg-gray-800 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all duration-300"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <motion.button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
          >
            {loading ? 'Iniciando...' : 'Entrar'}
          </motion.button>
        </form>
        <p className="text-center text-gray-400 text-md mt-6">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="text-red-500 hover:text-red-400 font-bold transition-colors">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
