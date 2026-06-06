const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const topicController = require('../controllers/topicController');
const validate = require('../middleware/validate');

router.get('/debug/topics', async (req, res) => {
    const Topic = require('../models/Topic');
    const topics = await Topic.find({});
    res.json(topics);
});
router.get('/courses/:courseId/topics', topicController.getTopicsByCourse);
router.post('/courses/:courseId/topics', [
    body('title').notEmpty().withMessage('El título es obligatorio'),
    validate
], topicController.createTopic);
router.put('/topics/:topicId', topicController.updateTopic);
router.delete('/topics/:topicId', topicController.deleteTopic);
router.post('/topics/:topicId/resources', [
    body('type').isIn(['material', 'task']).withMessage('Tipo de recurso no válido'),
    body('title').notEmpty().withMessage('El título es obligatorio'),
    validate
], topicController.addResource);
router.delete('/topics/:topicId/resources/:resourceId', topicController.deleteResource);
router.put('/topics/:topicId/resources/:resourceId', topicController.updateResource);
router.patch('/topics/:topicId/resources/:resourceId/toggle-visibility', topicController.toggleResourceVisibility);

module.exports = router;


