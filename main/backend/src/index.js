const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const Professor = require('./models/Professor');
const Alumno = require('./models/Alumno');
const Course = require('./models/Course');
const Event = require('./models/Event');
const Schedule = require('./models/Schedule');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

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
        // 1. Ensure Professor exists
        let professor = await Professor.findOne({ email: 'xavi@inspedralbes.cat' });
        if (!professor) {
            professor = await Professor.create({
                dni: '12345678A',
                nombre: 'Xavier',
                apellidos: 'García',
                email: 'xavi@inspedralbes.cat',
                password: 'xavi@inspedralbes.cat',
                especialidad: 'Programación'
            });
            console.log('Seed: Professor created');
        }

        // 2. Ensure Courses exist
        let courseCount = await Course.countDocuments();
        let courses = [];
        if (courseCount === 0) {
            courses = await Course.create([
                { title: 'IPO II', description: 'Interacció Persona-Ordinador II.', professor: 'Carles Narváez', image: 'https://picsum.photos/300/200?random=1' },
                { title: 'Projecte', description: 'Projecte de Desenvolupament d\'Aplicacions Multiplataforma.', professor: 'Equip Docent', image: 'https://picsum.photos/300/200?random=2' },
                { title: 'PSP', description: 'Programació de Serveis i Processos.', professor: 'Pol Prats', image: 'https://picsum.photos/300/200?random=3' },
                { title: 'Accés a Dades', description: 'Gestió i accés a bases de dades.', professor: 'Toni Martí', image: 'https://picsum.photos/300/200?random=4' },
                { title: 'Progr. Mòbils', description: 'Programació de dispositius mòbils.', professor: 'Pol Prats', image: 'https://picsum.photos/300/200?random=5' },
                { title: 'Des. Interfície', description: 'Desenvolupament d\'interfícies.', professor: 'Álvaro Pérez', image: 'https://picsum.photos/300/200?random=6' }
            ]);
            console.log('Seed: Courses created');
        } else {
            courses = await Course.find();
        }

        const courseIds = courses.map(c => c._id);

        // 3. Ensure Alumnos exist and are updated
        const alumnosData = [
            { nombre: 'Arnau', apellidos: 'Perera Ganuza', email: 'a24arnpergan@inspedralbes.cat' },
            { nombre: 'Marc', apellidos: 'Cara Montes', email: 'a24marcarmon@inspedralbes.cat' },
            { nombre: 'Nil', apellidos: 'Perera Ganuza', email: 'a24nilpergan@inspedralbes.cat' }
        ];

        for (const data of alumnosData) {
            let alumno = await Alumno.findOne({ email: data.email });
            if (!alumno) {
                await Alumno.create({
                    ...data,
                    password: data.email,
                    clase: '2DAM',
                    tipo_horario: 'Mañana',
                    tutor: professor._id,
                    enrolledCourses: courseIds
                });
                console.log(`Seed: Alumno created: ${data.nombre}`);
            } else if (!alumno.password || !alumno.enrolledCourses || alumno.enrolledCourses.length === 0) {
                // Update existing alumnos if they lack passwords or courses
                alumno.password = alumno.password || alumno.email;
                alumno.enrolledCourses = courseIds;
                await alumno.save();
                console.log(`Seed: Alumno updated: ${data.nombre}`);
            }
        }

        // 4. Ensure Events exist
        const eventCount = await Event.countDocuments();
        if (eventCount === 0) {
            await Event.create([
                { type: 'activity', title: 'Entrega Projecte Final', date: new Date(2026, 1, 18), courseId: courseIds[1] },
                { type: 'activity', title: 'Exercicis Unitat 3', date: new Date(2026, 1, 20), courseId: courseIds[2] },
                { type: 'exam', title: 'Examen IPO II', date: new Date(2026, 1, 25), courseId: courseIds[0] },
                { type: 'event', title: 'Xerrada Ciberseguretat', date: new Date(2026, 1, 12) }
            ]);
            console.log('Seed: Events created');
        }

        // Migration logic for any other missing passwords
        const professorsToUpdate = await Professor.find({ password: { $exists: false } });
        for (const p of professorsToUpdate) {
            p.password = p.email;
            await p.save();
            console.log(`Updated password for professor: ${p.email}`);
        }

        const alumnosToUpdate = await Alumno.find({ password: { $exists: false } });
        for (const a of alumnosToUpdate) {
            a.password = a.email;
            await a.save();
            console.log(`Updated password for alumno: ${a.email}`);
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

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Search in Alumnos
        let user = await Alumno.findOne({ email, password });
        let type = 'alumno';

        if (!user) {
            // Search in Professors
            user = await Professor.findOne({ email, password });
            type = 'professor';
        }

        if (user) {
            res.json({ success: true, user, type });
        } else {
            res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
});

// Courses route
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
});

// Events route
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find().populate('courseId');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
});

// User info route (to get populated version of user)
app.get('/api/user/:id', async (req, res) => {
    try {
        let user = await Alumno.findById(req.params.id).populate('enrolledCourses');
        if (!user) {
            user = await Professor.findById(req.params.id);
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user info' });
    }
});

// Update user settings (profile image, theme)
app.patch('/api/user/:id/settings', async (req, res) => {
    const { profileImage, theme } = req.body;
    try {
        let user = await Alumno.findById(req.params.id);
        if (!user) {
            user = await Professor.findById(req.params.id);
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        if (profileImage !== undefined) user.profileImage = profileImage;
        if (theme !== undefined) user.theme = theme;

        await user.save();
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar ajustes' });
    }
});

// Register route (only for Alumnos in this example)
app.post('/api/register', async (req, res) => {
    const { nombre, apellidos, email, password, clase, tipo_horario } = req.body;
    try {
        const existingAlumno = await Alumno.findOne({ email });
        if (existingAlumno) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }

        const newAlumno = await Alumno.create({
            nombre,
            apellidos,
            email,
            password,
            clase,
            tipo_horario
        });

        res.json({ success: true, alumno: newAlumno });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al registrar el alumno' });
    }
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
