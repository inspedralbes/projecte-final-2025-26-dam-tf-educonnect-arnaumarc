const Course = require('../models/Course');
const Alumno = require('../models/Alumno');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Schedule = require('../models/Schedule');

const getCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('professor');
        res.json(courses);
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
        const students = await Alumno.find({ enrolledCourses: { $nin: [courseId] } });
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
            return res.status(404).json({ success: false, message: 'Asignatura no encontrada' });
        }

        // Minimal authorization check: only the course owner can invite students
        if (String(course.professor) !== String(professorId)) {
            return res.status(403).json({ success: false, message: 'No autorizado para invitar alumnos en esta asignatura' });
        }

        const student = await Alumno.findById(studentId).lean();
        if (!student) {
            return res.status(404).json({ success: false, message: 'Alumno no encontrado' });
        }

        // If already enrolled, don't create a new invite
        const alreadyEnrolled = Array.isArray(student.enrolledCourses)
            && student.enrolledCourses.some((c) => String(c) === String(courseId));
        if (alreadyEnrolled) {
            return res.json({ success: true, message: 'El alumno ya está inscrito en esta asignatura' });
        }

        // Avoid duplicate pending invites (same student/course) by reusing unread invites
        const existingInvite = await Notification.findOne({
            recipient: studentId,
            recipientModel: 'Alumno',
            type: 'COURSE_INVITE',
            read: false,
            'meta.courseId': String(courseId)
        }).lean();

        if (existingInvite) {
            return res.json({ success: true, message: 'Ya existe una invitación pendiente para este alumno' });
        }

        const inviteNotification = await Notification.create({
            recipient: studentId,
            recipientModel: 'Alumno',
            sender: professorId,
            senderModel: 'Professor',
            type: 'COURSE_INVITE',
            title: `Invitación a ${course.title}`,
            content: `Has sido invitado a unirte a la asignatura \"${course.title}\".`,
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
            return res.status(404).json({ success: false, message: 'No se han encontrado estudiantes en esta asignatura' });
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
            title: 'Aviso de Clase: ' + title,
            content: content,
            link: '/asignaturas' // O la ruta del curso
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

        res.json({ success: true, message: `Notificación enviada a ${students.length} estudiantes (${sentCount} en línea)` });
    } catch (error) {
        console.error('Error enviando notificación a toda la clase:', error);
        res.status(500).json({ success: false, message: 'Error enviando notificación', error: error.message });
    }
};

module.exports = {
    getCourses,
    getStudentsByCourse,
    getAvailableStudentsByCourse,
    inviteStudentToCourse,
    notifyAllStudents,
    getCourseSchedule
};
