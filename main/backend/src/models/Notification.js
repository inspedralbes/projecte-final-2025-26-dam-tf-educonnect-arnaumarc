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
        enum: ['Professor', 'Alumno', 'System', 'Admin'], 
        default: 'Professor' 
    },
    type: { 
        type: String, 
        enum: ['EXAM', 'MATERIAL', 'MESSAGE', 'ANNOUNCEMENT', 'COURSE_INVITE', 'SYSTEM', 'MEET_CALL', 'MEET_MESSAGE', 'PROFESSOR_ADVISORY', 'GRADE'],
        default: 'SYSTEM'
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String },
    // Optional metadata for actionable notifications (e.g. course invites)
    meta: {
        courseId: { type: String },
        professorId: { type: String }
    },
    read: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ['LOW', 'HIGH'],
        default: 'LOW'
    },
    sourceId: { 
        type: mongoose.Schema.Types.ObjectId 
    }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
