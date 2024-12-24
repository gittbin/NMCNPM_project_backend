const express = require('express');
const sell = require('../controllers/sell'); // Import controller

const router = express.Router();

router.post('/findcode', sell.findcode);
router.post('/create_customer', sell.create_customer);
router.post('/history', sell.history);
router.post('/get_customer', sell.get_customer);
router.post('/get_history', sell.get_history);
router.post('/get_history', sell.get_history);
router.post('/get_history_customer', sell.get_history_customer);
router.post('/edit_customer', sell.edit_customer);
router.post('/delete_customer', sell.delete_customer);
module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Sell
 *     description: API quản lý bán hàng và khách hàng
 */

/**
 * @swagger
 * /sell/findcode:
 *   post:
 *     tags:
 *       - Sell
 *     summary: Tìm kiếm theo mã
 *     description: Tìm kiếm thông tin bán hàng dựa trên mã.
 *     responses:
 *       200:
 *         description: Tìm kiếm thành công
 *       400:
 *         description: Mã không hợp lệ
 */

/**
 * @swagger
 * /sell/create_customer:
 *   post:
 *     tags:
 *       - Sell
 *     summary: Tạo khách hàng mới
 *     description: Tạo một khách hàng mới cho hệ thống bán hàng.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - phone
 *     responses:
 *       201:
 *         description: Tạo khách hàng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /sell/history:
 *   post:
 *     tags:
 *       - Sell
 *     summary: Lịch sử bán hàng
 *     description: Lấy lịch sử các giao dịch bán hàng.
 *     responses:
 *       200:
 *         description: Lấy lịch sử thành công
 *       400:
 *         description: Lỗi khi lấy lịch sử
 */

/**
 * @swagger
 * /sell/get_customer:
 *   post:
 *     tags:
 *       - Sell
 *     summary: Lấy thông tin khách hàng
 *     description: Lấy thông tin của một khách hàng.
 *     responses:
 *       200:
 *         description: Lấy thông tin khách hàng thành công
 *       400:
 *         description: Không tìm thấy khách hàng
 */

/**
 * @swagger
 * /sell/get_history:
 *   post:
 *     tags:
 *       - Sell
 *     summary: Lịch sử giao dịch
 *     description: Lấy lịch sử giao dịch bán hàng.
 *     responses:
 *       200:
 *         description: Lấy lịch sử giao dịch thành công
 *       400:
 *         description: Lỗi khi lấy lịch sử giao dịch
 */

/**
 * @swagger
 * /sell/get_history_customer:
 *   post:
 *     tags:
 *       - Sell
 *     summary: Lịch sử giao dịch của khách hàng
 *     description: Lấy lịch sử giao dịch của một khách hàng cụ thể.
 *     responses:
 *       200:
 *         description: Lấy lịch sử giao dịch khách hàng thành công
 *       400:
 *         description: Không tìm thấy lịch sử giao dịch của khách hàng
 */

/**
 * @swagger
 * /sell/edit_customer:
 *   post:
 *     tags:
 *       - Sell
 *     summary: Chỉnh sửa thông tin khách hàng
 *     description: Cập nhật thông tin khách hàng.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - phone
 *     responses:
 *       200:
 *         description: Cập nhật thông tin khách hàng thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */

/**
 * @swagger
 * /sell/delete_customer:
 *   post:
 *     tags:
 *       - Sell
 *     summary: Xóa khách hàng
 *     description: Xóa thông tin một khách hàng khỏi hệ thống.
 *     responses:
 *       200:
 *         description: Xóa khách hàng thành công
 *       400:
 *         description: Không tìm thấy khách hàng
 */

