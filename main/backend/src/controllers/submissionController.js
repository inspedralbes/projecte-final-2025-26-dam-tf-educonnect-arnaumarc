const Submission = require('../models/Submission');
const Resource = require('../models/Topic'); // El modelo Topic contiene el esquema Resource
const Event = require('../models/Event');
const Alumno = require('../models/Alumno');
const path = require('path');
const fs = require('fs');

const createSubmission = async (req, res) => {
    try {
        const { studentId, activityId, activityType, courseId, submissionType } = req.body;
        let { content } = req.body;

        // Tarea 6.2: Validación de Identidad (Básica por ahora, asumiendo que el ID viene en el body)
        // En un sistema con JWT real, compararíamos req.user.id con studentId.
        
        // Si hay un archivo (Multer)
        let originalFilename = '';
        if (req.file) {
            content = `/uploads/submissions/${req.file.filename}`;
            originalFilename = req.file.originalname;
        }

        // Validar si la actividad existe y obtener su fecha límite
        let activity;
        if (activityType === 'resource') {
            const topic = await Resource.findOne({ 'resources._id': activityId });
            if (topic) {
                activity = topic.resources.id(activityId);
            }
        } else {
            activity = await Event.findById(activityId);
        }

        if (!activity) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }

        const dueDate = activity.dueDate || activity.date;
        const submittedAt = new Date();
        const status = (dueDate && submittedAt > new Date(dueDate)) ? 'TARDE' : 'A TIEMPO';

        // Tarea 6.5: Lógica de limpieza (Opcional: borrar archivo anterior si existe)
        const existingSubmission = await Submission.findOne({ studentId, activityId });
        if (existingSubmission && existingSubmission.submissionType === 'file' && existingSubmission.content.startsWith('/uploads/')) {
            const oldPath = path.join(__dirname, '../../', existingSubmission.content);
            if (fs.existsSync(oldPath)) {
                try { fs.unlinkSync(oldPath); } catch (e) { console.error('Error deleting old file:', e); }
            }
        }

        const submission = await Submission.findOneAndUpdate(
            { studentId, activityId },
            { 
                activityType, 
                courseId, 
                submissionType, 
                content,
                originalFilename,
                submittedAt, 
                status 
            },
            { upsert: true, new: true }
        );

        if (req.app.get('io')) {
            req.app.get('io').emit('submission_updated', {
                submission,
                courseId
            });
        }

        res.status(201).json(submission);
    } catch (error) {
        console.error('Error creating submission:', error);
        res.status(500).json({ error: 'Error al procesar la entrega' });
    }
};

const getCourseSubmissions = async (req, res) => {
    try {
        const { courseId } = req.params;
        const submissions = await Submission.find({ courseId }).populate('studentId', 'nombre apellidos profileImage');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las entregas' });
    }
};

const getActivitySubmissions = async (req, res) => {
    try {
        const { activityId } = req.params;
        const submissions = await Submission.find({ activityId }).populate('studentId', 'nombre apellidos profileImage');
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las entregas de la actividad' });
    }
};

const sendBulkReminders = async (req, res) => {
    try {
        const { courseId, activityId, activityTitle, pendingStudentIds, senderId } = req.body;
        const Notification = require('../models/Notification');

        if (!pendingStudentIds || pendingStudentIds.length === 0) {
            return res.json({ success: true, message: 'No hay alumnos pendientes' });
        }

        const notifications = pendingStudentIds.map(studentId => ({
            recipient: studentId,
            recipientModel: 'Alumno',
            sender: senderId,
            senderModel: 'Professor',
            type: 'SYSTEM',
            title: `Recordatorio: ${activityTitle}`,
            content: `Aún no has realizado la entrega de "${activityTitle}". Por favor, revísalo lo antes posible.`,
            course: courseId
        }));

        await Notification.insertMany(notifications);

        // Notificar por socket si están conectados
        if (req.app.get('io')) {
            const connectedUsers = req.app.get('connectedUsers');
            pendingStudentIds.forEach(studentId => {
                const socketId = connectedUsers.get(String(studentId));
                if (socketId) {
                    req.app.get('io').to(socketId).emit('new_notification', {
                        title: `Recordatorio: ${activityTitle}`,
                        content: `Aún no has realizado la entrega de "${activityTitle}".`
                    });
                }
            });
        }

        res.json({ success: true, message: `Recordatorios enviados a ${pendingStudentIds.length} alumnos` });
    } catch (error) {
        console.error('Error sending reminders:', error);
        res.status(500).json({ error: 'Error al enviar los recordatorios' });
    }
};

module.exports = {
    createSubmission,
    getCourseSubmissions,
    getActivitySubmissions,
    sendBulkReminders
};
