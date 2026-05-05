const Alumno = require('../models/Alumno');
const Notification = require('../models/Notification');

const notifyCourseStudents = async (req, courseId, title, content, type = 'ANNOUNCEMENT', link = '') => {
    try {
        const { io, connectedUsers } = req;

        // Find all students enrolled in this course
        let students = await Alumno.find({ enrolledCourses: courseId });

        // Fallback to all students if none enrolled
        if (students.length === 0) {
            students = await Alumno.find();
        }

        if (students.length === 0) return;

        const senderId = req.body.senderId || req.body.professorId || '65cf1234567890abcdef0000';

        // Create notifications in DB
        const notificationsToCreate = students.map(student => ({
            recipient: student._id,
            recipientModel: 'Alumno',
            sender: senderId,
            senderModel: 'Professor',
            type,
            title,
            content,
            link
        }));

        const savedNotifications = await Notification.insertMany(notificationsToCreate);

        // Real-time notifications
        students.forEach((student, index) => {
            const socketId = connectedUsers?.get(String(student._id));
            if (socketId && io) {
                io.to(socketId).emit('new_notification', savedNotifications[index]);
            }
        });
    } catch (error) {
        console.error('Error in notifyCourseStudents:', error);
    }
};

module.exports = { notifyCourseStudents };
