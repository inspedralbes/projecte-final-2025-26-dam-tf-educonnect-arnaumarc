const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor', required: true },
    image: { type: String },
    totalWeeklyHours: { type: Number, default: 4, min: 4, max: 6 }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
