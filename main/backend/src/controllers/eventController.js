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
        const { type, title, date, courseId, topicId, modality, status } = req.body;
        const newEvent = new Event({ 
            type, 
            title, 
            date, 
            courseId, 
            topicId, 
            modality: modality || 'digital', 
            status: status || 'scheduled' 
        });
        await newEvent.save();

        if (courseId) {
            notifyCourseStudents(
                req, 
                courseId, 
                'Nou Esdeveniment/Examen: ' + title, 
                'S\'ha afegit una nova fita a l\'agenda: ' + title,
                type === 'exam' ? 'EXAM' : 'ANNOUNCEMENT'
            );
        }

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(id, updates, { new: true });
        
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
};

module.exports = { getEvents, createEvent, updateEvent };
