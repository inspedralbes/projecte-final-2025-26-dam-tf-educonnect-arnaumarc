const Event = require('../models/Event');
const Notification = require('../models/Notification');
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
        const { type, title, date, courseId, topicId, modality, status, requiresSubmission, submissionType } = req.body;
        const newEvent = new Event({ 
            type, 
            title, 
            date, 
            courseId, 
            topicId, 
            modality: modality || 'digital', 
            status: status || 'scheduled',
            requiresSubmission,
            submissionType
        });
        await newEvent.save();

        if (courseId) {
            const deepLink = `/asignaturas?courseId=${courseId}&eventId=${newEvent._id}`;

            notifyCourseStudents(
                req, 
                courseId, 
                'Nou Esdeveniment/Examen: ' + title, 
                'S\'ha afegit una nova fita a l\'agenda: ' + title,
                type === 'exam' ? 'EXAM' : 'ANNOUNCEMENT',
                deepLink,
                newEvent._id
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

const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedEvent = await Event.findByIdAndDelete(id);
        
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Eliminar notificaciones asociadas al evento
        await Notification.deleteMany({ sourceId: id });

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
