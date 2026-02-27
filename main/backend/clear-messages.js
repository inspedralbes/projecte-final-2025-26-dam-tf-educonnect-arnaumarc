require('dotenv').config();
const mongoose = require('mongoose');
const Message = require('./src/models/Message'); // Ajusta la ruta si es necesario
const connectDB = require('./src/config/db');

async function clearMessages() {
    try {
        await connectDB();
        console.log('Conectado a MongoDB');

        const result = await Message.deleteMany({});
        console.log(`Se han eliminado ${result.deletedCount} mensajes de la base de datos.`);

        process.exit(0);
    } catch (error) {
        console.error('Error al limpiar mensajes:', error);
        process.exit(1);
    }
}

clearMessages();
