const express = require('express');
const sell = require('../controllers/sell'); // Import controller

const router = express.Router();

router.post('/findcode', sell.findcode);
router.post('/create_customer', sell.create_customer);
router.post('/history', sell.history);
router.post('/get_customer', sell.get_customer);
router.post('/get_history', sell.get_history);
module.exports = router;
