const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/:userId', notificationController.getUserNotifications);
router.patch('/:notificationId/read', notificationController.markAsRead);
router.patch('/user/:userId/read-all', notificationController.markAllAsRead);
router.post('/:notificationId/respond', notificationController.respondCourseInvite);
router.delete('/:notificationId', notificationController.deleteNotification);
router.delete('/user/:userId/read', notificationController.deleteAllReadNotifications);

module.exports = router;
