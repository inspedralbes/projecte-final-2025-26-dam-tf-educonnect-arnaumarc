const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Professor = require('./models/Professor');
const Alumno = require('./models/Alumno');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/educonnect?authSource=admin';

async function connectDB() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Successfully connected to MongoDB.');

        // Seed data if empty
        await seedData();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

async function seedData() {
    try {
        const professorCount = await Professor.countDocuments();
        if (professorCount === 0) {
            const professor = await Professor.create({
                dni: '12345678A',
                nombre: 'Xavier',
                apellidos: 'García',
                email: 'xavi@inspedralbes.cat',
                especialidad: 'Programación'
            });
            console.log('Seed: Professor created');

            const alumnoCount = await Alumno.countDocuments();
            if (alumnoCount === 0) {
                await Alumno.create([
                    {
                        nombre: 'Arnau',
                        apellidos: 'Perera Ganuza',
                        email: 'a24arnpergan@inspedralbes.cat',
                        clase: '2DAM',
                        tipo_horario: 'Mañana',
                        tutor: professor._id
                    },
                    {
                        nombre: 'Marc',
                        apellidos: 'Cara Montes',
                        email: 'a24marcarmon@inspedralbes.cat',
                        clase: '2DAM',
                        tipo_horario: 'Mañana',
                        tutor: professor._id
                    },
                    {
                        nombre: 'Nil',
                        apellidos: 'Perera Ganuza',
                        email: 'a24nilpergan@inspedralbes.cat',
                        clase: '2DAM',
                        tipo_horario: 'Mañana',
                        tutor: professor._id
                    }
                ]);
                console.log('Seed: Alumnos created');
            }
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

connectDB();

// API Routes
app.get('/api', (req, res) => {
    res.json({ message: 'EduConnect API is running!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    // If we're hitting an API route that doesn't exist, don't return index.html
    if (req.url.startsWith('/api')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
