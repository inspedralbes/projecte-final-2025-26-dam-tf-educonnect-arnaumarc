const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    const { sender, senderModel, receiver, course, title, content } = req.body;
    try {
        const message = await Message.create({ sender, senderModel, receiver, course, title, content, isPrivate: true });

        // Emit real-time notification to the receiver if connected
        const receiverSocketId = req.connectedUsers?.get(String(receiver));
        if (receiverSocketId && req.io) {
            req.io.to(receiverSocketId).emit('new_notification', {
                title: 'Nuevo Mensaje: ' + title,
                content: content,
                courseId: course,
                isPrivate: true
            });
        }

        res.json({ success: true, message });
    } catch (error) {
        console.error('Error enviando mensaje:', error);
        res.status(500).json({ success: false, message: 'Error enviando mensaje', error: error.message });
    }
};

const getMessagesByUser = async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { receiver: req.params.userId },
                { sender: req.params.userId }
            ]
        })
            .populate('sender')
            .populate('course')
            .sort({ date: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
};

const deleteMessage = async (req, res) => {
    try {
        const deletedMessage = await Message.findByIdAndDelete(req.params.messageId);
        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
        }
        res.json({ success: true, message: 'Mensaje eliminado' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ success: false, message: 'Error eliminando mensaje' });
    }
};

module.exports = { sendMessage, getMessagesByUser, deleteMessage };
