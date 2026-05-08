const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent } = require('../controllers/eventController');

router.get('/events', getEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);

module.exports = router;
