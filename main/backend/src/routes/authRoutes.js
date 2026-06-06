const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { login, register } = require('../controllers/authController');
const validate = require('../middleware/validate');

router.post('/login', [
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validate
], login);

router.post('/register', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('apellidos').notEmpty().withMessage('Los apellidos son obligatorios'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('clase').notEmpty().withMessage('La clase es obligatoria'),
    body('tipo_horario').notEmpty().withMessage('El tipo de horario es obligatorio'),
    validate
], register);

module.exports = router;
