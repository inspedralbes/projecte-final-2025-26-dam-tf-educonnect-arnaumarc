const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');

router.get('/courses/:courseId/topics', topicController.getTopicsByCourse);
router.post('/courses/:courseId/topics', topicController.createTopic);
router.put('/topics/:topicId', topicController.updateTopic);
router.delete('/topics/:topicId', topicController.deleteTopic);
router.post('/topics/:topicId/resources', topicController.addResource);
router.delete('/topics/:topicId/resources/:resourceId', topicController.deleteResource);
router.patch('/topics/:topicId/resources/:resourceId/toggle-visibility', topicController.toggleResourceVisibility);

module.exports = router;


