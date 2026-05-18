const Message = require('../models/Message');
const Notification = require('../models/Notification');

const sendMessage = async (req, res) => {
    const { sender, senderModel, receiver, receiverModel, course, title, content } = req.body;
    try {
        let message = await Message.create({ 
            sender, 
            senderModel, 
            receiver, 
            receiverModel: receiverModel || 'Alumno', // Default to Alumno if not provided
            course, 
            title, 
            content, 
            isPrivate: true 
        });
        
        // Populate sender info for immediate UI update
        message = await Message.findById(message._id).populate('sender', 'nombre apellidos profileImage');

        // Crear notificación persistente
        const notification = await Notification.create({
            recipient: receiver,
            recipientModel: receiverModel || 'Alumno', // Dinámico según el rol enviado
            sender,
            senderModel: senderModel || (req.user?.type === 'professor' ? 'Professor' : 'Alumno'),
            type: 'MESSAGE',
            title: 'Nuevo Mensaje: ' + title,
            content: content,
            link: '/perfil' // O la ruta del chat
        });

        // Emit real-time notification and message to the receiver room
        if (req.io) {
            req.io.to(String(receiver)).emit('new_notification', notification);
            req.io.to(String(receiver)).emit('new_message', message);
            
            // Also emit to the sender room (to sync other devices/tabs)
            req.io.to(String(sender)).emit('new_message', message);
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
