const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'recipientModel', 
        required: true 
    },
    recipientModel: { 
        type: String, 
        enum: ['Alumno', 'Professor'], 
        default: 'Alumno' 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        refPath: 'senderModel' 
    },
    senderModel: { 
        type: String, 
        enum: ['Professor', 'Alumno'], 
        default: 'Professor' 
    },
    type: { 
        type: String, 
        enum: ['EXAM', 'MATERIAL', 'MESSAGE', 'ANNOUNCEMENT', 'SYSTEM'],
        default: 'SYSTEM'
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
