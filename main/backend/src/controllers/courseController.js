const Course = require('../models/Course');
const Alumno = require('../models/Alumno');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Schedule = require('../models/Schedule');

const COVER_PRESETS = [
    { id: 'preset-blue', url: '/course-covers/preset-blue.svg' },
    { id: 'preset-purple', url: '/course-covers/preset-purple.svg' },
    { id: 'preset-green', url: '/course-covers/preset-green.svg' },
    { id: 'preset-orange', url: '/course-covers/preset-orange.svg' }
];

const normalizeImageUrl = (req, urlOrPath) => {
    if (!urlOrPath) return urlOrPath;
    if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
    const base = `${req.protocol}://${req.get('host')}`;
    return `${base}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`;
};

const requireCourseOwner = async ({ courseId, professorId }) => {
    if (!professorId) {
        const err = new Error('professorId es obligatorio');
        err.status = 400;
        throw err;
    }

    const course = await Course.findById(courseId);
    if (!course) {
        const err = new Error('Assignatura no trobada');
        err.status = 404;
        throw err;
    }

    if (String(course.professor) !== String(professorId)) {
        const err = new Error('No autorizado para modificar esta asignatura');
        err.status = 403;
        throw err;
    }

    return course;
};

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('professor').lean();
        const normalized = courses.map(c => ({ ...c, image: normalizeImageUrl(req, c.image) }));
        res.json(normalized);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching courses' });
    }
};

const getCourseSchedule = async (req, res) => {
    try {
        const { courseId } = req.params;
        const schedule = await Schedule.find({ courseId });
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching course schedule' });
    }
};

const getStudentsByCourse = async (req, res) => {
    console.log(`GET /api/courses/${req.params.courseId}/students called`);
    try {
        const { courseId } = req.params;

        let students = await Alumno.find({ enrolledCourses: courseId });
        console.log(`Found ${students.length} enrolled students for course ${courseId}`);

        // Fallback: if DB is empty, return a small mock list to keep UI usable in demo mode
        if (students.length === 0) {
            console.log('No enrolled students found, returning manual student list (demo fallback)');
            students = [
                { _id: '65cf1234567890abcdef0001', nombre: 'Arnau', apellidos: 'Perera Ganuza', email: 'a24arnpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24arnpergan' },
                { _id: '65cf1234567890abcdef0002', nombre: 'Marc', apellidos: 'Cara Montes', email: 'a24marcarmon@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24marcarmon' },
                { _id: '65cf1234567890abcdef0003', nombre: 'Nil', apellidos: 'Perera Ganuza', email: 'a24nilpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24nilpergan' }
            ];
        }

        res.json(students);
    } catch (error) {
        console.error('Error in students route:', error);
        res.status(500).json({ error: 'Error fetching students' });
    }
};

const getAvailableStudentsByCourse = async (req, res) => {
    console.log(`GET /api/courses/${req.params.courseId}/available-students called`);
    try {
        const { courseId } = req.params;
        // Buscamos alumnos que NO tengan este curso en su lista de inscritos
        let students = await Alumno.find({ enrolledCourses: { $ne: courseId } });

        // Fallback para modo demo: si no hay alumnos en la base de datos, devolvemos una lista mock
        if (students.length === 0) {
            const count = await Alumno.countDocuments();
            if (count === 0) {
                console.log('No students found in DB, returning mock available students');
                students = [
                    { _id: '65cf1234567890abcdef0004', nombre: 'Eduard', apellidos: 'Garcia', email: 'eduard@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=4' },
                    { _id: '65cf1234567890abcdef0005', nombre: 'Paula', apellidos: 'Martínez', email: 'paula@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=5' },
                    { _id: '65cf1234567890abcdef0006', nombre: 'Jordi', apellidos: 'Sánchez', email: 'jordi@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=6' }
                ];
            }
        }

        res.json(students);
    } catch (error) {
        console.error('Error in available students route:', error);
        res.status(500).json({ error: 'Error fetching available students' });
    }
};

const inviteStudentToCourse = async (req, res) => {
    console.log(`POST /api/courses/${req.params.courseId}/invite-student called`);
    try {
        const { courseId } = req.params;
        const { professorId, studentId } = req.body || {};

        if (!professorId || !studentId) {
            return res.status(400).json({ success: false, message: 'professorId y studentId son obligatorios' });
        }

        const course = await Course.findById(courseId).lean();
        if (!course) {
            return res.status(404).json({ success: false, message: 'Assignatura no trobada' });
        }

        // Minimal authorization check: only the course owner can invite students
        if (String(course.professor) !== String(professorId)) {
            return res.status(403).json({ success: false, message: 'No autorizado para invitar alumnos en esta asignatura' });
        }

        const student = await Alumno.findById(studentId).lean();
        if (!student) {
            return res.status(404).json({ success: false, message: 'Alumne no trobat' });
        }

        // If already enrolled, don't create a new invite
        const alreadyEnrolled = Array.isArray(student.enrolledCourses)
            ? student.enrolledCourses.some(c => String(c) === String(courseId))
            : false;

        if (alreadyEnrolled) {
            return res.json({ success: true, message: 'El alumno ya está inscrito en esta asignatura' });
        }

        // Create a persistent notification as an invitation
        const inviteNotification = await Notification.create({
            recipient: student._id,
            recipientModel: 'Alumno',
            sender: professorId,
            senderModel: 'Professor',
            type: 'COURSE_INVITE',
            title: 'Invitación a asignatura',
            content: `Has sido invitado a unirte a la asignatura "${course.title}".`,
            link: '/asignaturas',
            meta: {
                courseId: String(courseId),
                professorId: String(professorId)
            }
        });

        // Emit real-time notification if the student is online
        const socketId = req.connectedUsers?.get(String(studentId));
        if (socketId && req.io) {
            req.io.to(socketId).emit('new_notification', inviteNotification);
        }

        return res.json({ success: true, notification: inviteNotification });
    } catch (error) {
        console.error('Error inviting student:', error);
        res.status(500).json({ success: false, message: 'Error invitando alumno', error: error.message });
    }
};

const notifyAllStudents = async (req, res) => {
    const { title, content, senderId } = req.body;
    try {
        // Find all students enrolled in this course
        let students = await Alumno.find({ enrolledCourses: req.params.courseId });

        // Fallback to mock students if DB is empty for this course
        if (students.length === 0) {
            students = await Alumno.find(); // Try getting any students

            if (students.length === 0) {
                // If DB has no students at all, use the mock array
                students = [
                    { _id: '65cf1234567890abcdef0001', nombre: 'Arnau', apellidos: 'Perera Ganuza', email: 'a24arnpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24arnpergan' },
                    { _id: '65cf1234567890abcdef0002', nombre: 'Marc', apellidos: 'Cara Montes', email: 'a24marcarmon@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24marcarmon' },
                    { _id: '65cf1234567890abcdef0003', nombre: 'Nil', apellidos: 'Perera Ganuza', email: 'a24nilpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24nilpergan' }
                ];
            }
        }

        if (students.length === 0) {
            return res.status(404).json({ success: false, message: 'No s\'han trobat estudiants en aquesta assignatura' });
        }

        // Create a message for each student
        const messagesToCreate = students.map(student => ({
            sender: senderId,
            senderModel: 'Professor',
            receiver: student._id,
            course: req.params.courseId,
            title,
            content
        }));

        await Message.insertMany(messagesToCreate);

        // Crear notificaciones persistentes
        const notificationsToCreate = students.map(student => ({
            recipient: student._id,
            recipientModel: 'Alumno',
            sender: senderId,
            senderModel: 'Professor',
            type: 'ANNOUNCEMENT',
            title: 'Avís de classe: ' + title,
            content: content,
            link: '/asignaturas',
            meta: { courseId: req.params.courseId }
        }));

        const savedNotifications = await Notification.insertMany(notificationsToCreate);

        // Emit real-time notifications to connected students
        let sentCount = 0;
        students.forEach((student, index) => {
            const socketId = req.connectedUsers?.get(String(student._id));
            if (socketId && req.io) {
                req.io.to(socketId).emit('new_notification', savedNotifications[index]);
                sentCount++;
            }
        });

        res.json({ success: true, message: `Notificació enviada a ${students.length} estudiants (${sentCount} en línia)` });
    } catch (error) {
        console.error('Error enviando notificación a toda la clase:', error);
        res.status(500).json({ success: false, message: 'Error enviando notificación', error: error.message });
    }
};

const unenrollStudent = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { studentId } = req.body;

        if (!studentId) {
            return res.status(400).json({ success: false, message: 'studentId es obligatorio' });
        }

        const result = await Alumno.findByIdAndUpdate(
            studentId,
            { $pull: { enrolledCourses: courseId } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Alumne no trobat' });
        }

        res.json({ success: true, message: 'Te has desapuntado de la asignatura correctamente' });
    } catch (error) {
        console.error('Error unenrolling student:', error);
        res.status(500).json({ success: false, message: 'Error al desapuntarse de la asignatura' });
    }
};

const getCourseCoverPresets = async (req, res) => {
    res.json({ presets: COVER_PRESETS.map(p => ({ ...p, url: normalizeImageUrl(req, p.url) })) });
};

const updateCourseCoverPreset = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { professorId, presetId } = req.body || {};

        if (!presetId) {
            return res.status(400).json({ success: false, message: 'presetId es obligatorio' });
        }

        const preset = COVER_PRESETS.find(p => p.id === presetId);
        if (!preset) {
            return res.status(400).json({ success: false, message: 'presetId no válido' });
        }

        const course = await requireCourseOwner({ courseId, professorId });
        course.image = preset.url;
        await course.save();

        res.json({ success: true, course: { ...course.toObject(), image: normalizeImageUrl(req, course.image) } });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || 'Error actualizando portada' });
    }
};

const updateCourseCoverUpload = async (req, res) => {
    try {
        const { courseId } = req.params;
        const professorId = req.body?.professorId;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Falta el archivo (campo "cover")' });
        }

        const course = await requireCourseOwner({ courseId, professorId });
        course.image = `/uploads/course-covers/${req.file.filename}`;
        await course.save();

        res.json({ success: true, course: { ...course.toObject(), image: normalizeImageUrl(req, course.image) } });
    } catch (error) {
        res.status(error.status || 500).json({ success: false, message: error.message || 'Error subiendo portada' });
    }
};

module.exports = {
    getCourses,
    getStudentsByCourse,
    getAvailableStudentsByCourse,
    inviteStudentToCourse,
    notifyAllStudents,
    getCourseSchedule,
    unenrollStudent,
    getCourseCoverPresets,
    updateCourseCoverPreset,
    updateCourseCoverUpload
};


