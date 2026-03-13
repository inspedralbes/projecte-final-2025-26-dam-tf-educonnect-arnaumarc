const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const eventRoutes = require('./routes/eventRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const topicRoutes = require('./routes/topicRoutes');

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

    // --- WebRTC Signaling Events ---

    // When a user initiates a call
    socket.on('call_user', (data) => {
        const { to, offer, from, fromName } = data;
        const targetSocket = connectedUsers.get(String(to));
        if (targetSocket) {
            console.log(`Forwarding offer from ${from} to ${to}`);
            io.to(targetSocket).emit('incoming_call', {
                from,
                fromName,
                offer
            });
        } else {
            console.log(`Call target ${to} not connected`);
            socket.emit('call_failed', { reason: 'User not online' });
        }
    });

    // When a user answers a call
    socket.on('answer_call', (data) => {
        const { to, answer } = data;
        const targetSocket = connectedUsers.get(String(to));
        if (targetSocket) {
            console.log(`Forwarding answer to ${to}`);
            io.to(targetSocket).emit('call_answered', {
                answer,
                from: data.from
            });
        }
    });

    // Exchange ICE candidates
    socket.on('ice_candidate', (data) => {
        const { to, candidate } = data;
        const targetSocket = connectedUsers.get(String(to));
        if (targetSocket) {
            io.to(targetSocket).emit('ice_candidate', {
                candidate,
                from: data.from
            });
        }
    });

    // Reject a call
    socket.on('reject_call', (data) => {
        const { to } = data;
        const targetSocket = connectedUsers.get(String(to));
        if (targetSocket) {
            io.to(targetSocket).emit('call_rejected', { from: data.from });
        }
    });

    // Hang up or cancel a call
    socket.on('end_call', (data) => {
        const { to } = data;
        const targetSocket = connectedUsers.get(String(to));
        if (targetSocket) {
            io.to(targetSocket).emit('call_ended', { from: data.from });
        }
    });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the 'public' folder
const publicPath = path.join(__dirname, '../public');
console.log(`Serving static files from: ${publicPath}`);
app.use(express.static(publicPath));

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
app.use('/api', topicRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    // If we're hitting an API route that doesn't exist, don't return index.html
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error(`Error: index.html not found at ${indexPath}`);
        res.status(404).send(`
            <h1>Error: Frontend build not found</h1>
            <p>Looking for index.html at: <code>${indexPath}</code></p>
            <p>Make sure you have run <code>npm run build</code> in the main folder and are running from the <code>dist</code> directory.</p>
        `);
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
