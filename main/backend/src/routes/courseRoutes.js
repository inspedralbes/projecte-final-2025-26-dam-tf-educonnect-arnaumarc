const express = require('express');
const router = express.Router();
const { getCourses, getStudentsByCourse, notifyAllStudents } = require('../controllers/courseController');

router.get('/courses', getCourses);
router.get('/courses/:courseId/students', getStudentsByCourse);
router.post('/courses/:courseId/notify-all', notifyAllStudents);

module.exports = router;
