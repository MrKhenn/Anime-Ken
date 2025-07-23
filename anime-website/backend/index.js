// Importaciones
const dotenv = require('dotenv');
const path = require('path');
dotenv.config(); // Intenta cargar las variables de entorno automáticamente

// Si la carga automática falla, intenta cargar manualmente desde la ruta del proyecto
if (!process.env.OMDB_API_KEY) {
  dotenv.config({ path: path.resolve(__dirname, '.env') });
}

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { query, param, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

// Configuración de la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000; // Usa el puerto de entorno o 5000 por defecto

// Configuración de las APIs
const OMDb_API_KEY = process.env.OMDB_API_KEY;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OMDb_BASE_URL = 'http://www.omdbapi.com/';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

if (!OMDb_API_KEY || !TMDB_API_KEY) {
  throw new Error('Las variables de entorno OMDB_API_KEY y TMDB_API_KEY son requeridas.');
}

// --- Middlewares ---
// Habilita CORS para todas las solicitudes.
app.use(cors());

// Limita las solicitudes para proteger la API de OMDb
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limita cada IP a 100 solicitudes por ventana de 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos',
});

app.use('/api/', limiter); // Aplica el limitador de velocidad a todas las rutas de la API

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Configuración del límite de solicitudes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 solicitudes por ventana de 15 minutos
  standardHeaders: true, // Devuelve la información del límite en los encabezados `RateLimit-*`
  legacyHeaders: false, // Deshabilita los encabezados `X-RateLimit-*`
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos',
});

// Aplica el límite de solicitudes a todas las rutas de la API
app.use('/api', apiLimiter);

// --- Rutas de la API ---

/**
 * @route GET /api/search
 * @desc Busca películas/series en la API de OMDb por un término de búsqueda.
 * @param {string} query - El término de búsqueda.
 * @access Public
 */
app.get(
  '/api/search',
  [
    query('query')
      .notEmpty()
      .withMessage('El parámetro "query" es requerido para la búsqueda.')
      .isString()
      .withMessage('El parámetro "query" debe ser una cadena de texto.')
      .trim()
      .escape(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { query } = req.query;

    try {
    const response = await axios.get(`${OMDb_BASE_URL}?s=${encodeURIComponent(query)}&apikey=${OMDb_API_KEY}`);

    // Manejo de respuestas vacías o errores específicos de OMDb
    if (response.data.Response === 'False') {
      // OMDb envía 'Response: "False"' cuando no encuentra resultados o hay un error en la API Key
      return res.status(404).json({ error: response.data.Error || 'No se encontraron resultados para la búsqueda.' });
    }

    res.json(response.data); // Envía los datos directamente desde OMDb
  } catch (error) {
    if (error.response) {
      // La solicitud se hizo y el servidor respondió con un código de estado
      // que no está en el rango de 2xx
      console.error('Error de respuesta de OMDb API:', error.response.data);
      res.status(error.response.status).json({ error: 'Error al comunicarse con la API de OMDb.' });
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error('No se recibió respuesta de OMDb API:', error.request);
      res.status(503).json({ error: 'El servicio de OMDb no está disponible en este momento.' });
    } else {
      // Algo sucedió al configurar la solicitud que provocó un error
      console.error('Error al configurar la solicitud a OMDb API:', error.message);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
});

/**
 * @route GET /api/movie/:imdbID
 * @desc Obtiene los detalles de una película/serie específica por su ID de OMDb (imdbID).
 * @param {string} imdbID - El ID de IMDb de la película/serie.
 * @access Public
 */
app.get(
  '/api/movie/:imdbID',
  [
    param('imdbID')
      .isString()
      .withMessage('El parámetro "imdbID" debe ser una cadena de texto.')
      .matches(/^tt\d{7,8}$/)
      .withMessage('El parámetro "imdbID" no tiene un formato válido.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { imdbID } = req.params;

    try {
    const response = await axios.get(`${OMDb_BASE_URL}?i=${encodeURIComponent(imdbID)}&apikey=${OMDb_API_KEY}`);

    // Manejo de respuestas vacías o errores específicos de OMDb
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error || 'No se encontraron detalles para el ID proporcionado.' });
    }

    res.json(response.data); // Envía los datos directamente desde OMDb
  } catch (error) {
    if (error.response) {
      console.error('Error de respuesta de OMDb API:', error.response.data);
      res.status(error.response.status).json({ error: 'Error al comunicarse con la API de OMDb.' });
    } else if (error.request) {
      console.error('No se recibió respuesta de OMDb API:', error.request);
      res.status(503).json({ error: 'El servicio de OMDb no está disponible en este momento.' });
    } else {
      console.error('Error al configurar la solicitud a OMDb API:', error.message);
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
});

// Ruta para manejar solicitudes a rutas no definidas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.response) {
    // Errores de la API de OMDb
    return res.status(err.response.status).json({ error: err.response.data.Error || 'Error en la API de OMDb.' });
  } else if (err.request) {
    // La solicitud se hizo pero no se recibió respuesta
    return res.status(503).json({ error: 'No se pudo contactar con la API de OMDb. Inténtalo de nuevo más tarde.' });
  } else {
    // Otros errores
    res.status(500).json({ error: 'Ha ocurrido un error interno en el servidor.' });
  }
});

// --- Inicio del Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express ejecutándose en http://localhost:${PORT}`);
  console.log('Presiona Ctrl+C para detener el servidor.');
});

module.exports = app; // Exportar la app para poder usarla en las pruebas
