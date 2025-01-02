const express = require('express');
const home = require('../controllers/home.js'); // Import controller

const router = express.Router();

router.post('/total_revenue', home.total_revenue);
router.post('/today_income', home.today_income);
router.post('/new_customer', home.new_customer);
router.post('/generateCustomerReport', home.generateCustomerReport);
router.post('/generatedailySale', home.generatedailySale);
router.post('/generatedailyCustomer', home.generatedailyCustomer);
router.post('/generate_top_product', home.generate_top_product);
router.post('/total_pending',home.total_pending)
router.post('/recent_activity',home.recent_activity)
module.exports = router;
