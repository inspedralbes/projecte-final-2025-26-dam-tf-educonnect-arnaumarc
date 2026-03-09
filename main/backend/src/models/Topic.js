const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    type: { type: String, enum: ['file', 'link', 'task', 'note'], default: 'note' },
    title: { type: String, required: true },
    url: { type: String }, // For files or links
    content: { type: String }, // For notes or task details
    visible: { type: Boolean, default: true }
});

const topicSchema = new mongoose.Schema({
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    title: { type: String, required: true },
    description: { type: String },
    resources: [resourceSchema],
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
