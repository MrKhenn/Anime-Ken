const request = require('supertest');
const app = require('./index'); // Asegúrate de exportar tu app de Express para poder probarla

describe('API Endpoints', () => {
  // Prueba para el endpoint de búsqueda
  describe('GET /api/search', () => {
    it('debería devolver resultados para una consulta de búsqueda válida', async () => {
      const response = await request(app)
        .get('/api/search?query=naruto')
        .expect(200);

      expect(response.body.Search).toBeDefined();
      expect(Array.isArray(response.body.Search)).toBe(true);
    });

    it('debería devolver un error 400 si no se proporciona una consulta de búsqueda', async () => {
      await request(app)
        .get('/api/search')
        .expect(400);
    });
  });

  // Prueba para el endpoint de detalles de la película
  describe('GET /api/movie/:imdbID', () => {
    it('debería devolver los detalles de una película para un imdbID válido', async () => {
      // Usamos un imdbID de ejemplo que sabemos que existe
      const imdbID = 'tt0409591'; // Naruto
      const response = await request(app)
        .get(`/api/movie/${imdbID}`)
        .expect(200);

      expect(response.body.Title).toBeDefined();
      expect(response.body.imdbID).toBe(imdbID);
    });

    it('debería devolver un error 404 para un imdbID que no existe', async () => {
      const imdbID = 'tt0000000'; // Un ID que probablemente no exista
      await request(app)
        .get(`/api/movie/${imdbID}`)
        .expect(404);
    });
  });
});
