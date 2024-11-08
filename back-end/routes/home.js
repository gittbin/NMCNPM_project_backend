const express = require('express');
const home = require('../controllers/home.js'); // Import controller

const router = express.Router();

router.post('/total_revenue', home.total_revenue);
router.post('/today_income', home.today_income);
router.post('/new_customer', home.new_customer);
module.exports = router;
