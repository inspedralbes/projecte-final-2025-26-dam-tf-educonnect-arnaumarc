const Alumno = require('../models/Alumno');
const Professor = require('../models/Professor');
const Course = require('../models/Course');

const getAllStudents = async (req, res) => {
    try {
        let students = await Alumno.find();
        if (students.length === 0) {
            students = [
                { _id: '65cf1234567890abcdef0001', nombre: 'Arnau', apellidos: 'Perera Ganuza', email: 'a24arnpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24arnpergan' },
                { _id: '65cf1234567890abcdef0002', nombre: 'Marc', apellidos: 'Cara Montes', email: 'a24marcarmon@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24marcarmon' },
                { _id: '65cf1234567890abcdef0003', nombre: 'Nil', apellidos: 'Perera Ganuza', email: 'a24nilpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24nilpergan' }
            ];
        }
        res.json(students);
    } catch (e) {
        res.status(500).json([]);
    }
};

const getUser = async (req, res) => {
    try {
        let user = await Alumno.findById(req.params.id).populate('enrolledCourses');
        if (!user) {
            const professor = await Professor.findById(req.params.id).lean();
            if (professor) {
                const courses = await Course.find();
                professor.enrolledCourses = courses;
                return res.json(professor);
            }
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user info' });
    }
};

const updateUserSettings = async (req, res) => {
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
};

module.exports = { getAllStudents, getUser, updateUserSettings };
