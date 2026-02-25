const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const eventRoutes = require('./routes/eventRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust to your frontend URL in production
        methods: ['GET', 'POST']
    }
});
const port = process.env.PORT || 3001;

// Map to keep track of connected users (userId -> socketId)
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log(`Usuario conectado al socket: ${socket.id}`);

    // Register user ID with their socket
    socket.on('register_user', (userId) => {
        if (userId) {
            connectedUsers.set(String(userId), socket.id);
            console.log(`Usuario registrado en socket: ${userId} -> ${socket.id}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
        // Remove from connected users
        for (const [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                break;
            }
        }
    });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// Connect to MongoDB
connectDB();

// Middleware to inject io and connectedUsers into requests
app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;
    next();
});

// Mount API Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', messageRoutes);
app.use('/api', eventRoutes);
app.use('/api', scheduleRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    // If we're hitting an API route that doesn't exist, don't return index.html
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
