const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    type: { type: String, enum: ['material', 'task', 'file', 'link', 'note'], default: 'material' },
    title: { type: String },
    url: { type: String }, // For files
    link: { type: String }, // For external links
    content: { type: String }, // Description/details
    dueDate: { type: Date }, // Optional deadline for tasks
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
