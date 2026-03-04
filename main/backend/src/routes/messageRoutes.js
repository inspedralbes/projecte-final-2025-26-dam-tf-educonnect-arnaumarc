const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesByUser, deleteMessage } = require('../controllers/messageController');

router.post('/messages', sendMessage);
router.get('/users/:userId/messages', getMessagesByUser);
router.delete('/messages/:messageId', deleteMessage);

module.exports = router;
