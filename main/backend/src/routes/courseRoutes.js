const express = require('express');
const router = express.Router();
const { getCourses, getStudentsByCourse, notifyAllStudents, getCourseSchedule } = require('../controllers/courseController');

router.get('/courses', getCourses);
router.get('/courses/:courseId/students', getStudentsByCourse);
router.get('/courses/:courseId/schedule', getCourseSchedule);
router.post('/courses/:courseId/notify-all', notifyAllStudents);

module.exports = router;
