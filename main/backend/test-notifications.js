const mongoose = require('mongoose');
require('dotenv').config();
const Notification = require('./src/models/Notification');
const Alumno = require('./src/models/Alumno');

const mongoUri = process.env.MONGO_URI || 'mongodb://root:password@localhost:27017/educonnect?authSource=admin';

async function runTest() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to DB for test');

        // 1. Buscar un alumno
        const alumno = await Alumno.findOne({ nombre: 'Arnau' });
        if (!alumno) {
            console.error('No se encontró el alumno Arnau');
            process.exit(1);
        }
        console.log(`Testing with student: ${alumno.nombre} (${alumno._id})`);

        // 2. Crear una notificación de prueba (Simulando lo que harían los controladores)
        const testNotification = await Notification.create({
            recipient: alumno._id,
            recipientModel: 'Alumno',
            type: 'EXAM',
            title: 'PRUEBA: Examen de Mates',
            content: 'Este es un examen de prueba para verificar el sistema.',
            link: '/asignaturas'
        });
        console.log('Notification created in DB:', testNotification._id);

        // 3. Verificar recuperación vía lógica de la API
        const pending = await Notification.find({ recipient: alumno._id, read: false });
        console.log(`Success! Found ${pending.length} pending notifications for ${alumno.nombre}`);
        pending.forEach(n => {
            console.log(` - [${n.type}] ${n.title}: ${n.content}`);
        });

        await mongoose.disconnect();
        console.log('Test completed successfully');
    } catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}

runTest();
