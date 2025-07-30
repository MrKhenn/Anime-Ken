const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'data', 'users.json');

const readUsers = () => {
    const usersData = fs.readFileSync(usersFilePath);
    return JSON.parse(usersData);
};

const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

app.post('/register', (req, res) => {
    const users = readUsers();
    const newUser = { id: Date.now().toString(), ...req.body };
    users.push(newUser);
    writeUsers(users);
    res.status(201).send(newUser);
});

app.post('/login', (req, res) => {
    const users = readUsers();
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.send(user);
    } else {
        res.status(400).send('Invalid credentials');
    }
});

app.put('/users/:id', (req, res) => {
    const users = readUsers();
    const { id } = req.params;
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
        users[index] = { ...users[index], ...req.body };
        writeUsers(users);
        res.send(users[index]);
    } else {
        res.status(404).send('User not found');
    }
});

app.delete('/users/:id', (req, res) => {
    let users = readUsers();
    const { id } = req.params;
    const filteredUsers = users.filter(u => u.id !== id);
    if (users.length !== filteredUsers.length) {
        writeUsers(filteredUsers);
        res.status(204).send();
    } else {
        res.status(404).send('User not found');
    }
});

app.get('/users/:id', (req, res) => {
    const users = readUsers();
    const { id } = req.params;
    const user = users.find(u => u.id === id);
    if (user) {
        res.send(user);
    } else {
        res.status(404).send('User not found');
    }
});

const likesFilePath = path.join(__dirname, 'data', 'likes.json');
const commentsFilePath = path.join(__dirname, 'data', 'comments.json');

const readLikes = () => {
    const likesData = fs.readFileSync(likesFilePath);
    return JSON.parse(likesData);
};

const writeLikes = (likes) => {
    fs.writeFileSync(likesFilePath, JSON.stringify(likes, null, 2));
};

const readComments = () => {
    const commentsData = fs.readFileSync(commentsFilePath);
    return JSON.parse(commentsData);
};

const writeComments = (comments) => {
    fs.writeFileSync(commentsFilePath, JSON.stringify(comments, null, 2));
};

app.post('/movies/:id/like', (req, res) => {
    const likes = readLikes();
    const { id } = req.params;
    const { userId } = req.body;

    if (!likes[id]) {
        likes[id] = { likes: [], dislikes: [] };
    }

    if (!likes[id].likes.includes(userId)) {
        likes[id].likes.push(userId);
        likes[id].dislikes = likes[id].dislikes.filter(uid => uid !== userId);
    }

    writeLikes(likes);
    res.send(likes[id]);
});

app.post('/movies/:id/dislike', (req, res) => {
    const likes = readLikes();
    const { id } = req.params;
    const { userId } = req.body;

    if (!likes[id]) {
        likes[id] = { likes: [], dislikes: [] };
    }

    if (!likes[id].dislikes.includes(userId)) {
        likes[id].dislikes.push(userId);
        likes[id].likes = likes[id].likes.filter(uid => uid !== userId);
    }

    writeLikes(likes);
    res.send(likes[id]);
});

app.post('/movies/:id/comment', (req, res) => {
    const comments = readComments();
    const { id } = req.params;
    const { userId, comment } = req.body;

    if (!comments[id]) {
        comments[id] = [];
    }

    comments[id].push({ userId, comment, date: new Date() });
    writeComments(comments);
    res.status(201).send(comments[id]);
});

app.get('/movies/:id/comments', (req, res) => {
    const comments = readComments();
    const { id } = req.params;
    res.send(comments[id] || []);
});


const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const OMDB_API_KEY = process.env.OMDB_API_KEY;

app.get('/api/movies/popular', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching popular movies' });
    }
});

app.get('/api/search', async (req, res) => {
    const { query } = req.query;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${query}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error searching' });
    }
});

app.get('/api/genres', async (req, res) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching genres' });
    }
});

app.get('/api/movies/genre/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${id}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movies by genre' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
