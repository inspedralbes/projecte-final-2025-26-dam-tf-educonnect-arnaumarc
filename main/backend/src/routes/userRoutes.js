const express = require('express');
const router = express.Router();
const { getAllStudents, getUser, updateUserSettings } = require('../controllers/userController');

router.get('/all-students', getAllStudents);
router.get('/user/:id', getUser);
router.patch('/user/:id/settings', updateUserSettings);

module.exports = router;
