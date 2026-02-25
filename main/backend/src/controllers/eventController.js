const Event = require('../models/Event');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('courseId');
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching events' });
    }
};

module.exports = { getEvents };
