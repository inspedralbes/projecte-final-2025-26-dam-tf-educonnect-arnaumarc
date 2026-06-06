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

        // Crear notificación persistente (solo si no es para uno mismo)
        let notification = null;
        if (String(sender) !== String(receiver)) {
            notification = await Notification.create({
                recipient: receiver,
                recipientModel: receiverModel || 'Alumno', 
                sender,
                senderModel: senderModel || (req.user?.type === 'professor' ? 'Professor' : 'Alumno'),
                type: title === 'Missatge de xat' ? 'MEET_MESSAGE' : 'MESSAGE',
                title: title === 'Missatge de xat' ? 'Xat' : 'Nou missatge: ' + title,
                content: content,
                link: '/perfil',
                sourceId: message._id // Vincular notificación al mensaje
            });
        }

        // Emit real-time notification and message
        if (req.io) {
            // Emit notification only to receiver if it's not the sender
            if (notification) {
                req.io.to(String(receiver)).emit('new_notification', notification);
            }
            
            // Emit message to receiver
            req.io.to(String(receiver)).emit('new_message', message);
            
            // Also emit to the sender room (to sync other devices/tabs)
            // Only if sender is not the receiver, to avoid duplicate emissions
            if (String(sender) !== String(receiver)) {
                req.io.to(String(sender)).emit('new_message', message);
            }
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
        const { messageId } = req.params;
        const deletedMessage = await Message.findByIdAndDelete(messageId);
        if (!deletedMessage) {
            return res.status(404).json({ success: false, message: 'Missatge no trobat' });
        }

        // Eliminar notificación vinculada
        await Notification.deleteMany({ sourceId: messageId });

        res.json({ success: true, message: 'Missatge eliminat' });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ success: false, message: 'Error eliminando mensaje' });
    }
};

module.exports = { sendMessage, getMessagesByUser, deleteMessage };
