const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Professor = require('./models/Professor');
const Alumno = require('./models/Alumno');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
    res.json({ message: 'EduConnect Backend (MongoDB) is running!' });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
