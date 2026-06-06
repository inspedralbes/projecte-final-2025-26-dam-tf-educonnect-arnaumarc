const Alumno = require('../models/Alumno');
const Professor = require('../models/Professor');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
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
            res.status(401).json({ success: false, message: 'Email o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor' });
    }
};

const register = async (req, res) => {
    const { nombre, apellidos, email, password, clase, tipo_horario } = req.body;
    try {
        const existingAlumno = await Alumno.findOne({ email });
        const existingProfessor = await Professor.findOne({ email });
        
        if (existingAlumno || existingProfessor) {
            return res.status(400).json({ success: false, message: 'El email ya está registrado' });
        }

        // The password will be hashed automatically by the pre-save hook in the model
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
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Error al registrar el alumno' });
    }
};

module.exports = { login, register };
