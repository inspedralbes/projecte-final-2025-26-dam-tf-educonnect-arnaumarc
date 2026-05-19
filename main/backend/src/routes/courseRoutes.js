const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    getCourses,
    getStudentsByCourse,
    getAvailableStudentsByCourse,
    inviteStudentToCourse,
    notifyAllStudents,
    getCourseSchedule,
    unenrollStudent,
    getCourseCoverPresets,
    updateCourseCoverPreset,
    updateCourseCoverUpload
} = require('../controllers/courseController');

const uploadDir = path.join(__dirname, '../../uploads/course-covers');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const safeExt = path.extname(file.originalname || '').toLowerCase();
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `cover-${unique}${safeExt || '.png'}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
        return cb(new Error('Solo se permiten archivos de imagen'));
    }
    cb(null, true);
};

const uploadCover = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.get('/courses', getCourses);
router.get('/courses/:courseId/students', getStudentsByCourse);
router.get('/courses/:courseId/available-students', getAvailableStudentsByCourse);
router.get('/courses/:courseId/schedule', getCourseSchedule);
router.post('/courses/:courseId/notify-all', notifyAllStudents);
router.post('/courses/:courseId/invite-student', inviteStudentToCourse);
router.post('/courses/:courseId/unenroll', unenrollStudent);

router.get('/course-covers/presets', getCourseCoverPresets);
router.put('/courses/:courseId/cover/preset', updateCourseCoverPreset);
router.put('/courses/:courseId/cover/upload', uploadCover.single('cover'), updateCourseCoverUpload);

module.exports = router;
