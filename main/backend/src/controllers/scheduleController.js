const Schedule = require('../models/Schedule');
const Course = require('../models/Course');

const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find();
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching schedule' });
    }
};

const getCourseRemainingHours = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found' });

        const sessions = await Schedule.find({ courseId });
        const usedHours = sessions.reduce((acc, s) => {
            const [sH, sM] = s.startTime.split(':').map(Number);
            const [eH, eM] = s.endTime.split(':').map(Number);
            return acc + (eH - sH) + (eM - sM) / 60;
        }, 0);

        res.json({ total: course.totalWeeklyHours, used: usedHours, remaining: course.totalWeeklyHours - usedHours });
    } catch (error) {
        res.status(500).json({ error: 'Error calculating remaining hours' });
    }
};

const createScheduleSession = async (req, res) => {
    try {
        const { courseId, day, startTime, endTime, classroom } = req.body;

        // 1. Time range check (08:00-14:00 or 15:00-21:00)
        const [sH, sM] = startTime.split(':').map(Number);
        const [eH, eM] = endTime.split(':').map(Number);
        const startTotal = sH * 60 + sM;
        const endTotal = eH * 60 + eM;

        const isMorning = startTotal >= 8 * 60 && endTotal <= 14 * 60;
        const isAfternoon = startTotal >= 15 * 60 && endTotal <= 21 * 60;

        if (!isMorning && !isAfternoon) {
            return res.status(400).json({ error: 'La sesión debe estar dentro del turno de mañana (08-14h) o tarde (15-21h).' });
        }

        // 2. Break check (Patio 11:00-11:30)
        const patioStart = 11 * 60;
        const patioEnd = 11 * 60 + 30;
        if ((startTotal < patioEnd && endTotal > patioStart)) {
            return res.status(400).json({ error: 'No se pueden programar clases durante el patio (11:00-11:30).' });
        }

        // 3. Overlap check (Single classroom)
        const existingSessions = await Schedule.find({ day });
        for (const s of existingSessions) {
            const [esH, esM] = s.startTime.split(':').map(Number);
            const [eeH, eeM] = s.endTime.split(':').map(Number);
            const esTotal = esH * 60 + esM;
            const eeTotal = eeH * 60 + eeM;

            if (startTotal < eeTotal && endTotal > esTotal) {
                return res.status(400).json({ error: 'El aula ya está ocupada en ese horario.' });
            }
        }

        // 4. Hour purse check
        const course = await Course.findById(courseId);
        const sessions = await Schedule.find({ courseId });
        const usedHours = sessions.reduce((acc, s) => {
            const [sH, sM] = s.startTime.split(':').map(Number);
            const [eH, eM] = s.endTime.split(':').map(Number);
            return acc + (eH - sH) + (eM - sM) / 60;
        }, 0);

        const duration = (endTotal - startTotal) / 60;
        if (usedHours + duration > course.totalWeeklyHours) {
            return res.status(400).json({ error: `Has agotado las horas semanales de esta asignatura (${course.totalWeeklyHours}h).` });
        }

        const newSession = await Schedule.create({ courseId, day, startTime, endTime, classroom });
        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ error: 'Error creating schedule session' });
    }
};

const deleteScheduleSession = async (req, res) => {
    try {
        const { id } = req.params;
        await Schedule.findByIdAndDelete(id);
        res.json({ message: 'Session deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting session' });
    }
};

module.exports = { getSchedule, getCourseRemainingHours, createScheduleSession, deleteScheduleSession };
