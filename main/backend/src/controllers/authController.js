const Alumno = require('../models/Alumno');
const Professor = require('../models/Professor');

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await Alumno.findOne({ email, password });
        let type = 'alumno';

        if (!user) {
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
};

const register = async (req, res) => {
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
};

module.exports = { login, register };
