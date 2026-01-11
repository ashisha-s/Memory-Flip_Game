// server/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise'); 
const bcrypt = require('bcryptjs'); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; 

// --- CRITICAL MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// --- Database Connection Setup ---
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME
});

// Test DB Connection
pool.getConnection()
    .then(connection => {
        console.log('Database connection successful!');
        connection.release();
    })
    .catch(err => {
        console.error('Database connection FAILED. Check credentials and MySQL status.');
        console.error('Error:', err.stack);
    });

// --- Authentication Routes ---

// 1. Register User (POST: /api/auth/register)
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    
    console.log(`Attempting to register user: ${username}`);
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
        const [existingUser] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).json({ error: 'Username already taken.' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [username, passwordHash]
        );
        res.status(201).json({ message: 'Registration successful!', userId: result.insertId, username: username });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// 2. Login User (POST: /api/auth/login)
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required.' });
    }
    try {
        const [users] = await pool.execute('SELECT id, password_hash FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password.' });
        }
        res.status(200).json({ message: 'Login successful!', userId: user.id, username: username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// --- Score Routes ---

// 3. Initial Score Submission (Placeholder) Route (POST: /api/score/init)
app.post('/api/score/init', async (req, res) => {
    const { userId, gridSize } = req.body; 
    if (!userId || !gridSize) {
        return res.status(400).json({ error: 'Missing required fields: userId and gridSize.' });
    }
    try {
        const query = `
            INSERT INTO scores (user_id, grid_size, time_seconds, moves) 
            VALUES (?, ?, 0, 0)
        `;
        const [result] = await pool.execute(query, [userId, gridSize]);
        res.status(201).json({ message: 'Placeholder score created successfully', scoreId: result.insertId });
    } catch (error) {
        console.error('Error creating placeholder score:', error); 
        // This is the MySQL error output you need to check if the error reoccurs
        res.status(500).json({ error: 'Failed to create placeholder score.' });
    }
});

// 4. Update Final Score Route (PUT: /api/score/:scoreId)
app.put('/api/score/:scoreId', async (req, res) => {
    const { scoreId } = req.params;
    const { timeSeconds, moves } = req.body;
    if (timeSeconds === undefined || moves === undefined) {
        return res.status(400).json({ error: 'Missing required fields: timeSeconds and moves.' });
    }
    try {
        const query = `
            UPDATE scores 
            SET time_seconds = ?, moves = ?
            WHERE id = ?
        `;
        const [result] = await pool.execute(query, [timeSeconds, moves, scoreId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Score ID not found.' });
        }
        res.status(200).json({ message: 'Score updated successfully', rowsAffected: result.affectedRows });
    } catch (error) {
        console.error('Error updating final score:', error);
        res.status(500).json({ error: 'Failed to update score.' });
    }
});

// 5. Get Leaderboard Route (GET: /api/leaderboard/:gridSize)
app.get('/api/leaderboard/:gridSize', async (req, res) => {
    const { gridSize } = req.params;
    if (![4, 6, 8].includes(parseInt(gridSize))) {
        return res.status(400).json({ error: 'Invalid grid size.' });
    }
    try {
        const query = `
            SELECT s.time_seconds, s.moves, s.completion_date, u.username as player_name
            FROM scores s
            JOIN users u ON s.user_id = u.id
            WHERE s.grid_size = ? AND s.time_seconds > 0 
            ORDER BY s.time_seconds ASC, s.moves ASC
            LIMIT 10;
        `;
        const [rows] = await pool.execute(query, [gridSize]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});