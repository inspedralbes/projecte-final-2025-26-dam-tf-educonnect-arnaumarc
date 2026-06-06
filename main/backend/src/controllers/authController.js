const Alumno = require('../models/Alumno');
const Professor = require('../models/Professor');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // Find user by email first
        let user = await Alumno.findOne({ email }).populate({
            path: 'enrolledCourses',
            populate: { path: 'professor' }
        });
        let type = 'alumno';

        if (!user) {
            user = await Professor.findOne({ email });
            type = 'professor';
        }

        // If user found, check password using bcrypt
        if (user && await user.comparePassword(password)) {
            // Generate JWT Token
            const token = jwt.sign(
                { id: user._id, type: type, email: user.email },
                process.env.JWT_SECRET || 'fallback_secret_for_dev',
                { expiresIn: '24h' }
            );

            res.json({ success: true, user, type, token });
        } else {
            const error = new Error('Email o contraseña incorrectos');
            error.statusCode = 401;
            throw error;
        }
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    const { nombre, apellidos, email, password, clase, tipo_horario } = req.body;
    try {
        const existingAlumno = await Alumno.findOne({ email });
        const existingProfessor = await Professor.findOne({ email });
        
        if (existingAlumno || existingProfessor) {
            const error = new Error('El email ya está registrado');
            error.statusCode = 400;
            throw error;
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
        next(error);
    }
};

module.exports = { login, register };
