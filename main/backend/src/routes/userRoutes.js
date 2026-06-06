const express = require('express');
const router = express.Router();
const { getAllStudents, getAllUsers, getUser, updateUserSettings } = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/all-students', getAllStudents);
router.get('/all-users', getAllUsers);
router.get('/user/:id', auth, getUser);
router.patch('/user/:id/settings', updateUserSettings);

module.exports = router;
