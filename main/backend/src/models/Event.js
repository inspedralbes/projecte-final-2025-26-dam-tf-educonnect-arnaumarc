const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['activity', 'exam', 'event', 'holiday', 'strike']
    },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
