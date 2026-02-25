const Schedule = require('../models/Schedule');

const getSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.find();
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching schedule' });
    }
};

module.exports = { getSchedule };
