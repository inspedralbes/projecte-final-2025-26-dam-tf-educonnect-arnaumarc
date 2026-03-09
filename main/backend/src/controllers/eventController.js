const Event = require('../models/Event');
const { notifyCourseStudents } = require('./notificationHelper');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('courseId');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
};

const createEvent = async (req, res) => {
    try {
        const { type, title, date, courseId } = req.body;
        const newEvent = new Event({ type, title, date, courseId });
        await newEvent.save();

        if (courseId) {
            notifyCourseStudents(req, courseId, 'Nou Esdeveniment/Examen: ' + title, 'S\'ha afegit una nova fita a l\'agenda: ' + title);
        }

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

module.exports = { getEvents, createEvent };
