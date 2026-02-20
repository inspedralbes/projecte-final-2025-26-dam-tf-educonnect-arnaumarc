const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    professor: { type: String, required: true },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
