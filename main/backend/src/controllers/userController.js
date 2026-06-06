const Alumno = require('../models/Alumno');
const Professor = require('../models/Professor');
const Course = require('../models/Course');
const Submission = require('../models/Submission');
const Message = require('../models/Message');

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

const getAllUsers = async (req, res) => {
    try {
        let students = await Alumno.find().lean();
        let professors = await Professor.find().lean();
        
        console.log(`[Backend] Found ${students.length} students and ${professors.length} professors`);

        let allUsers = [
            ...students.map(s => ({ ...s, role: 'Student' })),
            ...professors.map(p => ({ ...p, role: 'Teacher' }))
        ];
        
        console.log(`[Backend] Returning total of ${allUsers.length} users`);
        res.json(allUsers);
    } catch (e) {
        console.error('Error fetching all users:', e);
        res.status(500).json([]);
    }
};

const getUser = async (req, res) => {
    try {
        let user = await Alumno.findById(req.params.id).populate({
            path: 'enrolledCourses',
            populate: { path: 'professor' }
        });

        const submissionsCount = await Submission.countDocuments({ studentId: req.params.id });

        if (!user) {
            const professor = await Professor.findById(req.params.id).lean();
            if (professor) {
                // Return only courses where this user is the professor
                const courses = await Course.find({ professor: req.params.id }).populate('professor');
                professor.enrolledCourses = courses;
                professor.type = 'professor';
                professor.stats = {
                    submissionsCount: 0 // Professors don't submit
                };
                return res.json(professor);
            }
        }

        if (user) {
            const u = user.toObject ? user.toObject() : user;
            u.type = u.type || 'alumno';
            u.stats = {
                submissionsCount: submissionsCount
            };
            return res.json(u);
        }

        return res.json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ error: 'Error fetching user info' });
    }
};
const updateUserSettings = async (req, res) => {
    const { profileImage, theme } = req.body;
    try {
        let user = await Alumno.findById(req.params.id);
        let isAlumno = true;
        
        if (!user) {
            user = await Professor.findById(req.params.id);
            isAlumno = false;
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuari no trobat' });
        }

        if (profileImage !== undefined) user.profileImage = profileImage;
        if (theme !== undefined) user.theme = theme;

        await user.save();

        let populatedUser;
        let stats = { submissionsCount: 0 };

        if (isAlumno) {
            populatedUser = await Alumno.findById(user._id).populate({ 
                path: 'enrolledCourses', 
                populate: { path: 'professor' } 
            });
            stats.submissionsCount = await Submission.countDocuments({ studentId: user._id });
        } else {
            // Para profesores, cargamos sus cursos y los inyectamos como enrolledCourses
            const professorData = await Professor.findById(user._id).lean();
            const courses = await Course.find({ professor: user._id }).populate('professor');
            professorData.enrolledCourses = courses;
            populatedUser = professorData;
        }

        const out = populatedUser || user;
        const outObj = out && out.toObject ? out.toObject() : out;
        if (outObj) {
            outObj.type = outObj.type || (isAlumno ? 'alumno' : 'professor');
            outObj.stats = stats;
        }
        res.json({ success: true, user: outObj });
    } catch (error) {
        console.error('Error updating settings:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar ajustes' });
    }
};

module.exports = { getAllStudents, getAllUsers, getUser, updateUserSettings };



