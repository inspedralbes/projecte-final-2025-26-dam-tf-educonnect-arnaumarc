const Notification = require('../models/Notification');
const Alumno = require('../models/Alumno');
const Course = require('../models/Course');

const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const allNotifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(50); // More items for grouping

        const grouped = [];
        const seenGroups = new Map(); // key: type + courseId

        for (const notif of allNotifications) {
            if (notif.read) {
                grouped.push(notif);
                continue;
            }

            const courseId = notif.meta?.courseId || 'no-course';
            const groupKey = `${notif.type}-${courseId}`;

            // Grouping only unread notifications of specific types
            const groupableTypes = ['MATERIAL', 'EXAM', 'ANNOUNCEMENT', 'MESSAGE', 'MEET_MESSAGE'];
            if (!groupableTypes.includes(notif.type)) {
                grouped.push(notif);
                continue;
            }

            if (seenGroups.has(groupKey)) {
                const groupIdx = seenGroups.get(groupKey);
                const group = grouped[groupIdx];
                
                // Update group metadata
                if (!group.count) {
                    group.count = 2;
                    group.originalContent = group.content;
                    // Add virtual field for frontend
                    const jsonGroup = group.toJSON ? group.toJSON() : { ...group };
                    jsonGroup.count = 2;
                    jsonGroup.isGrouped = true;
                    jsonGroup.ids = [group._id, notif._id];
                    grouped[groupIdx] = jsonGroup;
                } else {
                    grouped[groupIdx].count++;
                    grouped[groupIdx].ids.push(notif._id);
                }
                
                // Update text to reflect grouping
                const count = grouped[groupIdx].count;
                const typeLabel = notif.type === 'MATERIAL' ? 'materiales' : 
                                 notif.type === 'EXAM' ? 'exámenes' : 
                                 notif.type === 'MESSAGE' ? 'mensajes' : 'avisos';
                
                grouped[groupIdx].title = `${count} nuevos ${typeLabel}`;
                grouped[groupIdx].content = `Tienes ${count} ${typeLabel} pendientes.`;
            } else {
                seenGroups.set(groupKey, grouped.length);
                grouped.push(notif);
            }
        }

        res.json(grouped.slice(0, 20)); // Return final 20 items
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching notifications', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { ids } = req.body || {}; 
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Usuari no autenticat' });
        }

        if (ids && Array.isArray(ids)) {
            await Notification.updateMany(
                { _id: { $in: ids }, recipient: userId },
                { read: true }
            );
            return res.json({ success: true, message: 'Notificacions marcades com a llegides' });
        }

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, recipient: userId }, 
            { read: true }, 
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notificació no trobada o accés denegat' });
        }
        res.json({ success: true, notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la notificación', error: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const { userId } = req.params;
        const authenticatedUserId = req.user?.id;

        if (!authenticatedUserId || String(authenticatedUserId) !== String(userId)) {
            return res.status(403).json({ success: false, message: 'No autorizado para realizar esta acción' });
        }

        await Notification.updateMany(
            { recipient: userId, read: false },
            { read: true }
        );
        res.json({ success: true, message: 'Totes les notificacions marcades com a llegides' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar las notificaciones', error: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const { ids } = req.body || {}; 
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Usuari no autenticat' });
        }

        if (ids && Array.isArray(ids)) {
            await Notification.deleteMany({ _id: { $in: ids }, recipient: userId });
            return res.json({ success: true, message: 'Notificacions eliminades' });
        }

        const notification = await Notification.findOneAndDelete({ _id: notificationId, recipient: userId });
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notificació no trobada o accés denegat' });
        }
        res.json({ success: true, message: 'Notificació eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar la notificación', error: error.message });
    }
};

const deleteAllReadNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const authenticatedUserId = req.user?.id;

        if (!authenticatedUserId || String(authenticatedUserId) !== String(userId)) {
            return res.status(403).json({ success: false, message: 'No autorizado para realizar esta acción' });
        }

        await Notification.deleteMany({ recipient: userId, read: true });
        res.json({ success: true, message: 'Historial de notificacions llegides eliminat' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar las notificaciones', error: error.message });
    }
};

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllReadNotifications,
    respondCourseInvite: async (req, res) => {
        try {
            const { notificationId } = req.params;
            const { action, userId } = req.body || {};
            const authenticatedUserId = req.user?.id;

            if (!userId || (action !== 'accept' && action !== 'reject')) {
                return res.status(400).json({ success: false, message: 'ID de usuario y acción (accept/reject) son obligatorios' });
            }

            if (!authenticatedUserId || String(authenticatedUserId) !== String(userId)) {
                return res.status(403).json({ success: false, message: 'No autorizado para realizar esta acción' });
            }

            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({ success: false, message: 'Notificació no trobada' });
            }

            if (String(notification.recipient) !== String(userId)) {
                return res.status(403).json({ success: false, message: 'Esta notificación no te pertenece' });
            }

            if (notification.type !== 'COURSE_INVITE') {
                return res.status(400).json({ success: false, message: 'La notificación no es una invitación a curso' });
            }

            const courseId = notification?.meta?.courseId;
            if (!courseId) {
                notification.read = true;
                await notification.save();
                return res.status(400).json({ success: false, message: 'Invitación inválida (falta el ID del curso)' });
            }

            if (action === 'accept') {
                const course = await Course.findById(courseId).lean();
                if (!course) {
                    notification.read = true;
                    await notification.save();
                    return res.status(404).json({ success: false, message: 'La asignatura ya no existe' });
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

            return res.json({ 
                success: true, 
                message: action === 'accept' ? '¡Te has inscrito correctamente!' : 'Invitación rechazada',
                action, 
                notification 
            });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Error al responder a la invitación', error: error.message });
        }
    }
};
