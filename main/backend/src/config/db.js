const mongoose = require('mongoose');
const seedData = require('./seed');

const mongoUri = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/educonnect?authSource=admin';

async function connectDB() {
    try {
        const options = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(mongoUri, options);
        console.log('Successfully connected to MongoDB.');

        // Seed data if empty
        await seedData();
    } catch (error) {
        console.error('Initial MongoDB connection error:', error);
        // We don't exit here to allow Mongoose to keep trying if it's a transient error, 
        // but for the initial connection, we might want to know if it failed.
    }
}

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected! Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected successfully.');
});

module.exports = connectDB;
