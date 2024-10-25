const express = require('express');
const sell = require('../controllers/sell'); // Import controller

const router = express.Router();

router.post('/findcode', sell.findcode);
module.exports = router;
