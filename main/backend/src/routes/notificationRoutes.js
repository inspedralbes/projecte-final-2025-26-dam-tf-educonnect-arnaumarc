const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.get('/:userId', auth, notificationController.getUserNotifications);
router.patch('/:notificationId/read', auth, notificationController.markAsRead);
router.patch('/user/:userId/read-all', auth, notificationController.markAllAsRead);
router.post('/:notificationId/respond', auth, notificationController.respondCourseInvite);
router.delete('/:notificationId', auth, notificationController.deleteNotification);
router.delete('/user/:userId/read', auth, notificationController.deleteAllReadNotifications);

module.exports = router;
