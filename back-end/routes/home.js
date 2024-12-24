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
module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Home
 *     description: API quản lý thống kê và báo cáo doanh thu
 */

/**
 * @swagger
 * /home/total_revenue:
 *   post:
 *     tags:
 *       - Home
 *     summary: Tổng doanh thu
 *     description: Lấy thông tin tổng doanh thu của toàn bộ hệ thống.
 *     responses:
 *       200:
 *         description: Truy xuất tổng doanh thu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalRevenue:
 *                   type: number
 *                   description: Tổng doanh thu
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /home/today_income:
 *   post:
 *     tags:
 *       - Home
 *     summary: Thu nhập hôm nay
 *     description: Lấy thông tin thu nhập của hệ thống trong ngày hôm nay.
 *     responses:
 *       200:
 *         description: Truy xuất thu nhập hôm nay thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayIncome:
 *                   type: number
 *                   description: Thu nhập hôm nay
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /home/new_customer:
 *   post:
 *     tags:
 *       - Home
 *     summary: Khách hàng mới
 *     description: Lấy thông tin số lượng khách hàng mới trong hệ thống.
 *     responses:
 *       200:
 *         description: Truy xuất thông tin khách hàng mới thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newCustomers:
 *                   type: number
 *                   description: Số lượng khách hàng mới
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /home/generateCustomerReport:
 *   post:
 *     tags:
 *       - Home
 *     summary: Tạo báo cáo khách hàng
 *     description: Tạo báo cáo chi tiết về khách hàng trong hệ thống.
 *     responses:
 *       200:
 *         description: Tạo báo cáo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reportUrl:
 *                   type: string
 *                   description: URL của báo cáo khách hàng
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /home/generatedailySale:
 *   post:
 *     tags:
 *       - Home
 *     summary: Tạo báo cáo doanh thu hàng ngày
 *     description: Tạo báo cáo chi tiết về doanh thu hàng ngày.
 *     responses:
 *       200:
 *         description: Tạo báo cáo doanh thu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reportUrl:
 *                   type: string
 *                   description: URL của báo cáo doanh thu
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /home/generatedailyCustomer:
 *   post:
 *     tags:
 *       - Home
 *     summary: Tạo báo cáo khách hàng hàng ngày
 *     description: Tạo báo cáo chi tiết về khách hàng hàng ngày.
 *     responses:
 *       200:
 *         description: Tạo báo cáo khách hàng hàng ngày thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reportUrl:
 *                   type: string
 *                   description: URL của báo cáo khách hàng hàng ngày
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /home/generate_top_product:
 *   post:
 *     tags:
 *       - Home
 *     summary: Tạo báo cáo sản phẩm hàng đầu
 *     description: Tạo báo cáo chi tiết về các sản phẩm bán chạy nhất.
 *     responses:
 *       200:
 *         description: Tạo báo cáo sản phẩm hàng đầu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reportUrl:
 *                   type: string
 *                   description: URL của báo cáo sản phẩm hàng đầu
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
