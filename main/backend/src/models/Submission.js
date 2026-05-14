const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumno', required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Referencia a Resource o Event
    activityType: { type: String, enum: ['resource', 'event'], required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    submissionType: { type: String, enum: ['file', 'comment', 'done'], required: true },
    content: { type: String }, // URL del archivo o texto del comentario
    originalFilename: { type: String }, // Nombre original del archivo subido
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['A TIEMPO', 'TARDE'], required: true }
}, { timestamps: true });

// Índice para búsquedas rápidas de seguimiento
submissionSchema.index({ studentId: 1, activityId: 1 }, { unique: true });
submissionSchema.index({ courseId: 1, activityId: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
