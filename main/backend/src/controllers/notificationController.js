const Notification = require('../models/Notification');
const Alumno = require('../models/Alumno');
const Course = require('../models/Course');

const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            notificationId, 
            { read: true }, 
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }
        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating notification', error: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;
        await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating notifications', error: error.message });
    }
};

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    respondCourseInvite: async (req, res) => {
        try {
            const { notificationId } = req.params;
            const { action, userId } = req.body || {};

            if (!userId || (action !== 'accept' && action !== 'reject')) {
                return res.status(400).json({ success: false, message: 'userId y action (accept/reject) son obligatorios' });
            }

            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({ success: false, message: 'Notification not found' });
            }

            if (String(notification.recipient) !== String(userId)) {
                return res.status(403).json({ success: false, message: 'No autorizado' });
            }

            if (notification.type !== 'COURSE_INVITE') {
                return res.status(400).json({ success: false, message: 'Notificación no es una invitación' });
            }

            const courseId = notification?.meta?.courseId;
            if (!courseId) {
                notification.read = true;
                await notification.save();
                return res.status(400).json({ success: false, message: 'Invitación inválida (courseId missing)' });
            }

            if (action === 'accept') {
                const course = await Course.findById(courseId).lean();
                if (!course) {
                    notification.read = true;
                    await notification.save();
                    return res.status(404).json({ success: false, message: 'Asignatura no encontrada' });
                }

                await Alumno.findByIdAndUpdate(
                    userId,
                    { $addToSet: { enrolledCourses: courseId } },
                    { new: true }
                );
            }

            // Mark invite as handled
            notification.read = true;
            await notification.save();

            return res.json({ success: true, action, notification });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error responding to invite', error: error.message });
        }
    }
};
