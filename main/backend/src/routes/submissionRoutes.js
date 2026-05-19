const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const upload = require('../config/multerConfig');

router.post('/', upload.single('file'), submissionController.createSubmission);
router.get('/course/:courseId', submissionController.getCourseSubmissions);
router.get('/activity/:activityId', submissionController.getActivitySubmissions);
router.post('/reminders', submissionController.sendBulkReminders);
router.put('/:id/grade', submissionController.gradeSubmission);

module.exports = router;
