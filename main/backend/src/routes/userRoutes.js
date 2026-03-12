const express = require('express');
const router = express.Router();
const { getAllStudents, getAllUsers, getUser, updateUserSettings } = require('../controllers/userController');

router.get('/all-students', getAllStudents);
router.get('/all-users', getAllUsers);
router.get('/user/:id', getUser);
router.patch('/user/:id/settings', updateUserSettings);

module.exports = router;
