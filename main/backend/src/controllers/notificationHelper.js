const Alumno = require('../models/Alumno');
const Message = require('../models/Message');

const notifyCourseStudents = async (req, courseId, title, content) => {
    try {
        const { io, connectedUsers } = req;

        // Find all students enrolled in this course
        let students = await Alumno.find({ enrolledCourses: courseId });

        // Fallback to all students if none enrolled (as seen in courseController)
        if (students.length === 0) {
            students = await Alumno.find();
        }

        if (students.length === 0) return;

        // Create messages in DB
        const messagesToCreate = students.map(student => ({
            sender: req.body.senderId || req.body.professorId || '65cf1234567890abcdef0000', // Default if not provided
            senderModel: 'Professor',
            receiver: student._id,
            course: courseId,
            title,
            content
        }));

        await Message.insertMany(messagesToCreate);

        // Real-time notifications
        for (const student of students) {
            const socketId = connectedUsers?.get(String(student._id));
            if (socketId && io) {
                io.to(socketId).emit('new_notification', {
                    title: title,
                    content: content,
                    courseId: courseId
                });
            }
        }
    } catch (error) {
        console.error('Error in notifyCourseStudents:', error);
    }
};

module.exports = { notifyCourseStudents };
