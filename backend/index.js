const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const OMDb_API_KEY = '274e7f62';
const OMDb_BASE_URL = 'http://www.omdbapi.com/';

app.use(cors());

app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  try {
    const response = await axios.get(`${OMDb_BASE_URL}?s=${query}&apikey=${OMDb_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from OMDb API' });
  }
});

app.get('/api/movie/:imdbID', async (req, res) => {
  const { imdbID } = req.params;
  try {
    const response = await axios.get(`${OMDb_BASE_URL}?i=${imdbID}&apikey=${OMDb_API_KEY}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from OMDb API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
