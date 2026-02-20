const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' },
    senderModel: { type: String, enum: ['Professor', 'Alumno'] },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    title: String,
    content: String,
    date: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);
