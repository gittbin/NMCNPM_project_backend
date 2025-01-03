const express = require('express');
const bank = require('../controllers/bank.js'); // Import controller

const router = express.Router();

router.post('/get_bank', bank.get_bank);
router.post('/add_bank', bank.add_bank);
router.post('/delete_bank', bank.delete_bank);
module.exports = router;
