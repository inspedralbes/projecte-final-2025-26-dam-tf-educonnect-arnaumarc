const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'educonnect',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create a pool instead of a single connection for better handling
const pool = mysql.createPool(dbConfig);

// Test the connection
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to the database.');
        connection.release();
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

testConnection();

app.get('/', (req, res) => {
    res.json({ message: 'EduConnect Backend is running!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
