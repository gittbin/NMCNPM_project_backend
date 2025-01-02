const express = require('express');
const sell = require('../controllers/sell'); // Import controller
const Author=require("../controllers/middlewareUserController.js")
const router = express.Router();

router.post('/findcode', sell.findcode);
router.post('/create_customer',Author.authorize("create_customer"), sell.create_customer);
router.post('/history', sell.history);
router.post('/get_customer', sell.get_customer);
router.post('/get_history', sell.get_history);
router.post('/get_history', sell.get_history);
router.post('/get_history_customer', sell.get_history_customer);
router.post('/edit_customer',Author.authorize("edit-customer"), sell.edit_customer);
router.post('/delete_customer', sell.delete_customer);
module.exports = router;
