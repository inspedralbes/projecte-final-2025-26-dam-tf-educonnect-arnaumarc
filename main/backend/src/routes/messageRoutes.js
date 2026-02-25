const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesByUser } = require('../controllers/messageController');

router.post('/messages', sendMessage);
router.get('/users/:userId/messages', getMessagesByUser);

module.exports = router;
