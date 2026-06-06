const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const eventRoutes = require('./routes/eventRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const topicRoutes = require('./routes/topicRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const Notification = require('./models/Notification');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3005;
const defaultAllowedOrigins = 'https://projecteeduconnect.cat,http://localhost:5173,http://localhost:5174,http://localhost:3000,http://localhost:3006';
const originsFromEnv = process.env.ALLOWED_ORIGINS || process.env.CORS_ORIGINS || defaultAllowedOrigins;
const allowedOrigins = originsFromEnv
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

const normalizeOrigin = (origin) => {
    try {
        return new URL(origin).origin;
    } catch {
        return origin;
    }
};

const allowedOriginsSet = new Set(allowedOrigins.map(normalizeOrigin));

const isDevOriginAllowed = (origin) => {
    if (!origin) return true;
    // In local/dev we allow private-network origins for convenience
    if (process.env.NODE_ENV !== 'production') {
        return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\]|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?$/i.test(origin);
    }
    return false;
};

const isOriginAllowed = (origin) => {
    if (!origin) return true;
    const normalizedOrigin = normalizeOrigin(origin);
    if (allowedOriginsSet.has('*')) return true;
    if (allowedOriginsSet.has(normalizedOrigin)) return true;
    if (isDevOriginAllowed(normalizedOrigin)) return true;
    return false;
};

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isOriginAllowed(origin)) return callback(null, true);
            return callback(new Error(`CORS blocked for socket origin: ${origin}`));
        },
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Map to keep track of connected users (userId -> socketId)
const connectedUsers = new Map();
// Map to keep track of user states (userId -> state: 'ONLINE' | 'BUSY' | 'OFFLINE')
const userStates = new Map();

const broadcastUserState = (userId, state) => {
    io.emit('user_state_changed', { userId, state });
};

io.on('connection', (socket) => {
    console.log(`Usuario conectado al socket: ${socket.id}`);

    // Register user ID with their socket
    socket.on('register_user', async (userId) => {
        if (userId) {
            socket.join(String(userId));
            connectedUsers.set(String(userId), socket.id);
            userStates.set(String(userId), 'ONLINE');
            broadcastUserState(String(userId), 'ONLINE');
            console.log(`Usuario registrado en sala: ${userId} (socket: ${socket.id})`);

            // Enviar estados actuales al nuevo usuario
            const currentStates = Object.fromEntries(userStates);
            socket.emit('sync_user_states', currentStates);
        }
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
        // Remove from connected users
        for (const [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                userStates.delete(userId);
                broadcastUserState(userId, 'OFFLINE');
                break;
            }
        }
    });

    // --- WebRTC Signaling Events ---

    // When a user initiates a call
    socket.on('call_user', async (data) => {
        const { to, offer, from, fromName } = data;
        const targetSocket = connectedUsers.get(String(to));
        const targetState = userStates.get(String(to));

        if (targetState === 'BUSY') {
            return socket.emit('call_failed', { reason: 'User is busy' });
        }

        // Mark caller as busy
        userStates.set(String(from), 'BUSY');
        broadcastUserState(String(from), 'BUSY');

        // Persist call event as notification
        try {
            const Alumno = require('./models/Alumno');
            const Professor = require('./models/Professor');

            const [targetIsAlumno, senderIsProfessor] = await Promise.all([
                Alumno.exists({ _id: to }),
                Professor.exists({ _id: from })
            ]);

            const notification = await Notification.create({
                recipient: to,
                recipientModel: targetIsAlumno ? 'Alumno' : 'Professor',
                sender: from,
                senderModel: senderIsProfessor ? 'Professor' : 'Alumno',
                type: 'MEET_CALL',
                title: 'Llamada de Meet',
                content: `${fromName} te está llamando...`,
                link: '/meet'
            });

            console.log(`[Backend] Persisted call notification: ${notification._id}`);

            if (targetSocket) {
                // First inform about the persistent notification
                io.to(targetSocket).emit('new_notification', notification);
                
                // Then trigger the WebRTC signaling
                console.log(`Forwarding offer from ${from} to ${to}`);
                io.to(targetSocket).emit('incoming_call', {
                    from,
                    fromName,
                    offer
                });
            } else {
                console.log(`Call target ${to} not connected`);
                // Reset caller state if target not online
                userStates.set(String(from), 'ONLINE');
                broadcastUserState(String(from), 'ONLINE');
                socket.emit('call_failed', { reason: 'User not online' });
            }
        } catch (err) {
            console.error('Error creating call notification:', err);
            // Reset caller state on error
            userStates.set(String(from), 'ONLINE');
            broadcastUserState(String(from), 'ONLINE');
            socket.emit('call_failed', { reason: 'Internal server error during call initialization' });
        }
    });

    // When a user answers a call
    socket.on('answer_call', (data) => {
        const { to, answer, from } = data;
        const targetSocket = connectedUsers.get(String(to));
        
        // Both participants are now officially busy
        userStates.set(String(from), 'BUSY');
        broadcastUserState(String(from), 'BUSY');
        userStates.set(String(to), 'BUSY');
        broadcastUserState(String(to), 'BUSY');

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
        const { to, from } = data;
        
        userStates.set(String(from), 'ONLINE');
        broadcastUserState(String(from), 'ONLINE');
        userStates.set(String(to), 'ONLINE');
        broadcastUserState(String(to), 'ONLINE');

        const targetSocket = connectedUsers.get(String(to));
        if (targetSocket) {
            io.to(targetSocket).emit('call_rejected', { from: data.from });
        }
    });

    // Hang up or cancel a call
    socket.on('end_call', (data) => {
        const { to, from } = data;

        userStates.set(String(from), 'ONLINE');
        broadcastUserState(String(from), 'ONLINE');
        userStates.set(String(to), 'ONLINE');
        broadcastUserState(String(to), 'ONLINE');

        const targetSocket = connectedUsers.get(String(to));
        if (targetSocket) {
            io.to(targetSocket).emit('call_ended', { from: data.from });
        }
    });
});

app.use(cors({
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) return callback(null, true);
        return callback(new Error(`CORS blocked for HTTP origin: ${origin}`));
    },
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static files from the 'public' folder
const publicPath = path.join(__dirname, '../public');
console.log(`Serving static files from: ${publicPath}`);
app.use(express.static(publicPath));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
app.use('/api/submissions', submissionRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

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

// --- Automatización de Limpieza de Notificaciones ---

/**
 * Elimina notificaciones de Meet (llamadas y mensajes) con más de 24 horas.
 /**
  * Mantenimiento de notificaciones:
  * 1. Elimina notificaciones de Meet de más de 24h.
  * 2. Elimina cualquier notificación de más de 30 días.
  */
 const cleanOldNotifications = async () => {
     try {
         console.log('[Cleanup] Iniciando mantenimiento de notificaciones...');

         // 1. Notificaciones de Meet (24h)
         const meetLimit = new Date(Date.now() - 24 * 60 * 60 * 1000);
         const meetResult = await Notification.deleteMany({
             type: { $in: ['MEET_CALL', 'MEET_MESSAGE'] },
             createdAt: { $lt: meetLimit }
         });

         // 2. Notificaciones generales (30 días)
         const generalLimit = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
         const generalResult = await Notification.deleteMany({
             createdAt: { $lt: generalLimit }
         });

         const totalDeleted = meetResult.deletedCount + generalResult.deletedCount;
         if (totalDeleted > 0) {
             console.log(`[Cleanup] Mantenimiento completado. Eliminadas: ${meetResult.deletedCount} de Meet, ${generalResult.deletedCount} antiguas.`);
         }
     } catch (error) {
         console.error('[Cleanup] Error en el mantenimiento de notificaciones:', error);
     }
 };

 // Ejecutar limpieza inicial y luego cada 12 horas
 cleanOldNotifications();
 setInterval(cleanOldNotifications, 12 * 60 * 60 * 1000);



