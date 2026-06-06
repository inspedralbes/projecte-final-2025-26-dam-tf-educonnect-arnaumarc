const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Hash password before saving
professorSchema.pre('save', async function(next) {
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
professorSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Professor', professorSchema);
