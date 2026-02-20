const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    dni: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: null },
    theme: { type: String, default: 'light' },
    especialidad: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Professor', professorSchema);
