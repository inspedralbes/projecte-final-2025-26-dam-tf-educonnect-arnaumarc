const mongoose = require('mongoose');

const alumnoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clase: { type: String, required: true },
    tipo_horario: { type: String, required: true },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor' }
}, { timestamps: true });

module.exports = mongoose.model('Alumno', alumnoSchema);
