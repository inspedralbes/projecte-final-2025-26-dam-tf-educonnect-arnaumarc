const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    day: { type: Number, required: true, min: 1, max: 5 },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    classroom: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Schedule', scheduleSchema);
