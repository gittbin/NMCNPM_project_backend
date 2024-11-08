const express = require('express');
const producrs = require('../controllers/products'); // Import controller

const router = express.Router();

router.post('/show', producrs.show);
router.get('/show/:id', producrs.show_detail);
router.post('/edit', producrs.edit);
router.post('/deletes', producrs.deletes);
router.post('/create',producrs.create);
router.post('/history',producrs.get_history);
router.post('/get_supplier',producrs.get_supplier)
router.post('/create_supplier',producrs.create_supplier)
router.post('/get_history_supplier',producrs.get_history_supplier)
router.post('/edit_supplier',producrs.edit_supplier)
module.exports = router;
