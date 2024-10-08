const express = require('express');
const producrs = require('../controllers/products'); // Import controller

const router = express.Router();

router.post('/show', producrs.show);
router.get('/show/:id', producrs.show_detail);
router.post('/edit', producrs.edit);
router.post('/deletes', producrs.deletes);
router.post('/create',producrs.create);
router.post('/history',producrs.get_history);
module.exports = router;
