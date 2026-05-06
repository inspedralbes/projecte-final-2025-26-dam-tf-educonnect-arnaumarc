const express = require('express');
const router = express.Router();
const { 
    getSchedule, 
    getCourseRemainingHours, 
    createScheduleSession, 
    deleteScheduleSession 
} = require('../controllers/scheduleController');

router.get('/schedule', getSchedule);
router.get('/courses/:courseId/remaining-hours', getCourseRemainingHours);
router.post('/schedule', createScheduleSession);
router.delete('/schedule/:id', deleteScheduleSession);

module.exports = router;
