const express = require('express');
const producrs = require('../controllers/products'); // Import controller
const Author=require("../controllers/middlewareUserController.js")
const router = express.Router();

router.post('/show', producrs.show);
router.get('/show/:id', producrs.show_detail);
router.post('/edit',Author.authorize("edit_product"), producrs.edit);
router.post('/deletes',Author.authorize("delete_product"), producrs.deletes);
router.post('/create',Author.authorize("add_product"),producrs.create);
router.post('/history',producrs.get_history);
router.post('/get_supplier',producrs.get_supplier)
router.post('/create_supplier',Author.authorize("create-suplier"),producrs.create_supplier)
router.post('/get_history_supplier',producrs.get_history_supplier)
router.post('/edit_supplier',Author.authorize("edit-suplier"),producrs.edit_supplier)
router.post('/delete_supplier',Author.authorize("delete_suplier"),producrs.delete_supplier)
module.exports = router;
