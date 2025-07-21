// Importaciones
const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Para permitir solicitudes desde otros dominios

// Configuración de la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000; // Usa el puerto de entorno o 5000 por defecto

// Configuración de la API de OMDb
// ¡Importante! Nunca expongas tu API Key directamente en el código fuente en producción.
// Usa variables de entorno para esto.
const OMDb_API_KEY = process.env.OMDB_API_KEY || '274e7f62';
const OMDb_BASE_URL = 'http://www.omdbapi.com/';

// --- Middlewares ---
// Habilita CORS para todas las solicitudes.
// Esto es crucial para que tu frontend (si está en un dominio diferente) pueda comunicarse con tu backend.
app.use(cors());

// Middleware para parsear JSON en el cuerpo de las solicitudes (aunque no lo uses directamente en este caso, es buena práctica)
app.use(express.json());

// --- Rutas de la API ---

/**
 * @route GET /api/search
 * @desc Busca películas/series en la API de OMDb por un término de búsqueda.
 * @param {string} query - El término de búsqueda.
 * @access Public
 */
app.get('/api/search', async (req, res) => {
  const { query } = req.query; // Desestructuración para obtener 'query' de req.query

  // Validar si el parámetro 'query' existe
  if (!query) {
    return res.status(400).json({ error: 'El parámetro "query" es requerido para la búsqueda.' });
  }

  try {
    const response = await axios.get(`${OMDb_BASE_URL}?s=${encodeURIComponent(query)}&apikey=${OMDb_API_KEY}`);

    // Manejo de respuestas vacías o errores específicos de OMDb
    if (response.data.Response === 'False') {
      // OMDb envía 'Response: "False"' cuando no encuentra resultados o hay un error en la API Key
      return res.status(404).json({ error: response.data.Error || 'No se encontraron resultados para la búsqueda.' });
    }

    res.json(response.data); // Envía los datos directamente desde OMDb
  } catch (error) {
    // Registro del error para depuración
    console.error('Error al buscar en OMDb API:', error.message);
    // Respuesta de error genérica para el cliente
    res.status(500).json({ error: 'Error interno del servidor al buscar datos en OMDb.' });
  }
});

/**
 * @route GET /api/movie/:imdbID
 * @desc Obtiene los detalles de una película/serie específica por su ID de OMDb (imdbID).
 * @param {string} imdbID - El ID de IMDb de la película/serie.
 * @access Public
 */
app.get('/api/movie/:imdbID', async (req, res) => {
  const { imdbID } = req.params; // Desestructuración para obtener 'imdbID' de req.params

  // Validar si el parámetro 'imdbID' existe
  if (!imdbID) {
    return res.status(400).json({ error: 'El parámetro "imdbID" es requerido para obtener detalles de la película.' });
  }

  try {
    const response = await axios.get(`${OMDb_BASE_URL}?i=${encodeURIComponent(imdbID)}&apikey=${OMDb_API_KEY}`);

    // Manejo de respuestas vacías o errores específicos de OMDb
    if (response.data.Response === 'False') {
      return res.status(404).json({ error: response.data.Error || 'No se encontraron detalles para el ID proporcionado.' });
    }

    res.json(response.data); // Envía los datos directamente desde OMDb
  } catch (error) {
    // Registro del error para depuración
    console.error('Error al obtener detalles de OMDb API:', error.message);
    // Respuesta de error genérica para el cliente
    res.status(500).json({ error: 'Error interno del servidor al obtener detalles de OMDb.' });
  }
});

// Ruta para manejar solicitudes a rutas no definidas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores global (opcional pero recomendado para errores no capturados)
app.use((err, req, res, next) => {
    console.error(err.stack); // Imprime el stack trace del error en la consola del servidor
    res.status(500).send('¡Algo salió mal!');
});

// --- Inicio del Servidor ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor Express ejecutándose en http://localhost:${PORT}`);
  console.log('Presiona Ctrl+C para detener el servidor.');
});

module.exports = app; // Exportar la app para poder usarla en las pruebas
