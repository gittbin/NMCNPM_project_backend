const express = require('express');
const chat = require('../controllers/chat.js'); // Import controller

const router = express.Router();

router.post('/getMessages', chat.getMessages);
module.exports = router;
