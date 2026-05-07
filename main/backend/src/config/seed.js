const Professor = require('../models/Professor');
const Alumno = require('../models/Alumno');
const Course = require('../models/Course');
const Event = require('../models/Event');
const Schedule = require('../models/Schedule');

async function seedData() {
    try {
        // Limpieza inicial para asegurar integridad con el nuevo modelo
        console.log('Seed: Cleaning collections...');
        await Professor.deleteMany({});
        await Course.deleteMany({});
        await Schedule.deleteMany({});
        await Alumno.deleteMany({});
        await Event.deleteMany({});

        // 1. Ensure Professor exists
        let professor = await Professor.create({
            dni: '12345678A',
            nombre: 'Xavier',
            apellidos: 'García',
            email: 'xavi@inspedralbes.cat',
            password: 'xavi@inspedralbes.cat',
            especialidad: 'Programación'
        });
        console.log('Seed: Professor Xavier created');

        // 2. Ensure Courses exist
        console.log('Seed: Creating courses with updated hours (IPO II 6h, Accés 6h)...');
        const coursesData = [
            { title: 'IPO II', description: 'Interacció Persona-Ordinador II.', professor: professor._id, image: 'https://picsum.photos/300/200?random=1', totalWeeklyHours: 6 },
            { title: 'Projecte', description: 'Projecte de Desenvolupament d\'Aplicacions Multiplataforma.', professor: professor._id, image: 'https://picsum.photos/300/200?random=2', totalWeeklyHours: 4 },
            { title: 'PSP', description: 'Programació de Serveis i Processos.', professor: professor._id, image: 'https://picsum.photos/300/200?random=3', totalWeeklyHours: 4 },
            { title: 'Accés a Dades', description: 'Gestió i accés a bases de dades.', professor: professor._id, image: 'https://picsum.photos/300/200?random=4', totalWeeklyHours: 6 },
            { title: 'Mòbils', description: 'Programació multimèdia i dispositius mòbils.', professor: professor._id, image: 'https://picsum.photos/300/200?random=5', totalWeeklyHours: 6 },
            { title: 'SGE', description: 'Sistemes de gestió empresarial.', professor: professor._id, image: 'https://picsum.photos/300/200?random=6', totalWeeklyHours: 4 }
        ];

        const courses = await Course.create(coursesData);
        console.log('Seed: Courses created and linked to Xavier');

        const courseIds = courses.map(c => c._id);

        // 3. Ensure Alumnos exist and are updated
        const alumnosData = [
            { nombre: 'Arnau', apellidos: 'Perera Ganuza', email: 'a24arnpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24arnpergan' },
            { nombre: 'Marc', apellidos: 'Cara Montes', email: 'a24marcarmon@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24marcarmon' },
            { nombre: 'Nil', apellidos: 'Perera Ganuza', email: 'a24nilpergan@inspedralbes.cat', profileImage: 'https://i.pravatar.cc/150?u=a24nilpergan' }
        ];

        for (const data of alumnosData) {
            let alumno = await Alumno.findOne({ email: data.email });
            if (!alumno) {
                await Alumno.create({
                    ...data,
                    password: data.email,
                    clase: '2DAM',
                    tipo_horario: 'Mañana',
                    tutor: professor._id,
                    enrolledCourses: courseIds
                });
                console.log(`Seed: Alumno created: ${data.nombre}`);
            } else {
                // Update existing alumnos to ensure they have the profile image from seed if it changed
                alumno.profileImage = data.profileImage;
                if (!alumno.password || !alumno.enrolledCourses || alumno.enrolledCourses.length !== courseIds.length) {
                    alumno.password = alumno.password || alumno.email;
                    alumno.enrolledCourses = courseIds;
                }
                await alumno.save();
                console.log(`Seed: Alumno updated (sync image/courses): ${data.nombre}`);
            }
        }

        // 4. Ensure Events exist
        const eventCount = await Event.countDocuments();
        if (eventCount === 0) {
            await Event.create([
                { type: 'activity', title: 'Entrega Projecte Final', date: new Date(2026, 1, 18), courseId: courseIds[1] },
                { type: 'activity', title: 'Exercicis Unitat 3', date: new Date(2026, 1, 20), courseId: courseIds[2] },
                { type: 'exam', title: 'Examen IPO II', date: new Date(2026, 1, 25), courseId: courseIds[0] },
                { type: 'event', title: 'Xerrada Ciberseguretat', date: new Date(2026, 1, 12) }
            ]);
            console.log('Seed: Events created');
        }

        // 5. Ensure Schedule exists - CLEAN SLATE
        const scheduleCount = await Schedule.countDocuments();
        if (scheduleCount === 0) {
            await Schedule.create([
                // Lunes
                { courseId: courseIds[0], day: 1, startTime: "08:00", endTime: "10:00", classroom: "Aula Única" }, // IPO II
                { courseId: courseIds[2], day: 1, startTime: "10:00", endTime: "11:00", classroom: "Aula Única" }, // PSP
                { courseId: courseIds[4], day: 1, startTime: "12:00", endTime: "14:00", classroom: "Aula Única" }, // Mòbils
                { courseId: courseIds[1], day: 1, startTime: "17:00", endTime: "19:00", classroom: "Aula Única" }, // Projecte

                // Martes
                { courseId: courseIds[3], day: 2, startTime: "08:00", endTime: "10:00", classroom: "Aula Única" }, // Accés a Dades
                { courseId: courseIds[5], day: 2, startTime: "10:00", endTime: "11:00", classroom: "Aula Única" }, // SGE
                { courseId: courseIds[4], day: 2, startTime: "12:00", endTime: "14:00", classroom: "Aula Única" }, // Mòbils

                // Miércoles
                { courseId: courseIds[0], day: 3, startTime: "08:00", endTime: "10:00", classroom: "Aula Única" }, // IPO II
                { courseId: courseIds[2], day: 3, startTime: "10:00", endTime: "11:00", classroom: "Aula Única" }, // PSP
                { courseId: courseIds[4], day: 3, startTime: "12:00", endTime: "14:00", classroom: "Aula Única" }, // Mòbils

                // Jueves
                { courseId: courseIds[3], day: 4, startTime: "08:00", endTime: "10:00", classroom: "Aula Única" }, // Accés a Dades
                { courseId: courseIds[5], day: 4, startTime: "10:00", endTime: "11:00", classroom: "Aula Única" }, // SGE
                { courseId: courseIds[1], day: 4, startTime: "12:00", endTime: "14:00", classroom: "Aula Única" }, // Projecte

                // Viernes
                { courseId: courseIds[3], day: 5, startTime: "08:00", endTime: "10:00", classroom: "Aula Única" }, // Accés a Dades
                { courseId: courseIds[5], day: 5, startTime: "10:00", endTime: "11:00", classroom: "Aula Única" }, // SGE
                { courseId: courseIds[0], day: 5, startTime: "12:00", endTime: "14:00", classroom: "Aula Única" }  // IPO II
            ]);
            console.log('Seed: Default schedule updated with 1h/2h sessions and new rules');
        }


        // Migration logic for any other missing passwords
        const professorsToUpdate = await Professor.find({ password: { $exists: false } });
        for (const p of professorsToUpdate) {
            p.password = p.email;
            await p.save();
            console.log(`Updated password for professor: ${p.email}`);
        }

        const alumnosToUpdate = await Alumno.find({ password: { $exists: false } });
        for (const a of alumnosToUpdate) {
            a.password = a.email;
            await a.save();
            console.log(`Updated password for alumno: ${a.email}`);
        }

    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

module.exports = seedData;
