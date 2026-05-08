const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['activity', 'exam', 'event', 'holiday', 'strike']
    },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
    modality: { 
        type: String, 
        enum: ['paper', 'digital'], 
        default: 'digital' 
    },
    status: { 
        type: String, 
        enum: ['scheduled', 'done', 'graded'], 
        default: 'scheduled' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
