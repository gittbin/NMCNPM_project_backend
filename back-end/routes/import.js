const express = require('express');
const loggingOrder = require('../controllers/LoggingOrder');
const orderDetailHistory = require('../controllers/OrderDetailHistory');
const orderHistory = require('../controllers/OrderHistory');
const producrs = require('../controllers/products'); 
const suppliers = require('../controllers/supplier');
const Author=require("../controllers/middlewareUserController.js")
const router = express.Router();

router.get('/loggingOrder/listOrder',loggingOrder.getLogging)

router.get('/orderDetail/listorder', orderDetailHistory.listOrderDetail);
router.post('/orderDetail/updateDetail',Author.authorize("edit_order"),orderDetailHistory.updateDetail);

router.post('/orderHistory/save',Author.authorize("create_order"), orderHistory.saveOrderHistory);
router.get('/orderHistory/getOrder', orderHistory.getOrder);
router.put('/orderHistory/updateOrderhistory',Author.authorize("edit_order"),orderHistory.updateOrderHistory);
router.get('/orderHistory/supplierName',orderHistory.getSupplierByOrderId);
router.get('/orderHistory/lastProductTop100',orderHistory.getProductTop100);

router.get('/products/exhibitPro',producrs.getProductsBySupplier)
router.get('/products/exhibitProN',producrs.getProductsByProductName)

router.get('/supplier/search', suppliers.getSupplierSuggestion);

module.exports = router;