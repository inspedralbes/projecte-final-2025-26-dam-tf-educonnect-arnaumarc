const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const alumnoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellidos: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clase: { type: String, required: true },
    tipo_horario: { type: String, required: true },
    password: { type: String, required: true },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    profileImage: { type: String, default: null },
    theme: { type: String, default: 'light' },
    tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor' }
}, { timestamps: true });

// Hash password before saving
alumnoSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
alumnoSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Alumno', alumnoSchema);
