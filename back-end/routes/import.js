const express = require('express');
const loggingOrder = require('../controllers/LoggingOrder');
const orderDetailHistory = require('../controllers/OrderDetailHistory');
const orderHistory = require('../controllers/OrderHistory');
const producrs = require('../controllers/products'); 
const suppliers = require('../controllers/supplier');

const router = express.Router();

router.get('/loggingOrder/listOrder',loggingOrder.getLogging)

router.get('/orderDetail/listorder', orderDetailHistory.listOrderDetail);
router.post('/orderDetail/updateDetail',orderDetailHistory.updateDetail);

router.post('/orderHistory/save', orderHistory.saveOrderHistory);
router.get('/orderHistory/getOrder', orderHistory.getOrder);
router.put('/orderHistory/updateOrderhistory',orderHistory.updateOrderHistory);
router.get('/orderHistory/supplierName',orderHistory.getSupplierByOrderId);

router.get('/products/exhibitPro',producrs.getProductsBySupplier)
router.get('/products/exhibitProN',producrs.getProductsByProductName)

router.get('/supplier/search', suppliers.getSupplierSuggestion);

module.exports = router;