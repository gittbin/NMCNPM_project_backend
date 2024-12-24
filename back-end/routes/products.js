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
router.post('/delete_supplier',producrs.delete_supplier)
module.exports = router;


/**
 * @swagger
 * tags:
 *   - name: Products
 *     description: API quản lý sản phẩm và nhà cung cấp
 */

/**
 * @swagger
 * /products/show:
 *   post:
 *     tags:
 *       - Products
 *     summary: Hiển thị danh sách sản phẩm
 *     description: Lấy danh sách các sản phẩm trong hệ thống.
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /products/show/{id}:
 *   get:
 *     tags:
 *       - Products
 *     summary: Hiển thị chi tiết sản phẩm
 *     description: Lấy thông tin chi tiết của sản phẩm theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần hiển thị
 *     responses:
 *       200:
 *         description: Lấy thông tin sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */

/**
 * @swagger
 * /products/edit:
 *   post:
 *     tags:
 *       - Products
 *     summary: Chỉnh sửa thông tin sản phẩm
 *     description: Cập nhật thông tin của sản phẩm.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy sản phẩm
 */

/**
 * @swagger
 * /products/deletes:
 *   post:
 *     tags:
 *       - Products
 *     summary: Xóa sản phẩm
 *     description: Xóa một hoặc nhiều sản phẩm.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - ids
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /products/create:
 *   post:
 *     tags:
 *       - Products
 *     summary: Tạo mới sản phẩm
 *     description: Tạo một sản phẩm mới.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /products/history:
 *   post:
 *     tags:
 *       - Products
 *     summary: Lịch sử thay đổi sản phẩm
 *     description: Lấy lịch sử thay đổi của một sản phẩm.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Lịch sử thay đổi sản phẩm
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /products/get_supplier:
 *   post:
 *     tags:
 *       - Products
 *     summary: Lấy thông tin nhà cung cấp
 *     description: Lấy thông tin các nhà cung cấp trong hệ thống.
 *     responses:
 *       200:
 *         description: Lấy thông tin nhà cung cấp thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /products/create_supplier:
 *   post:
 *     tags:
 *       - Products
 *     summary: Tạo mới nhà cung cấp
 *     description: Tạo một nhà cung cấp mới.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - name
 *               - contact
 *     responses:
 *       201:
 *         description: Tạo nhà cung cấp thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /products/get_history_supplier:
 *   post:
 *     tags:
 *       - Products
 *     summary: Lịch sử thay đổi nhà cung cấp
 *     description: Lấy lịch sử thay đổi của một nhà cung cấp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               supplierId:
 *                 type: string
 *             required:
 *               - supplierId
 *     responses:
 *       200:
 *         description: Lịch sử thay đổi nhà cung cấp
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /products/edit_supplier:
 *   post:
 *     tags:
 *       - Products
 *     summary: Chỉnh sửa thông tin nhà cung cấp
 *     description: Cập nhật thông tin của nhà cung cấp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               contact:
 *                 type: string
 *               address:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Cập nhật nhà cung cấp thành công
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 */

/**
 * @swagger
 * /products/delete_supplier:
 *   post:
 *     tags:
 *       - Products
 *     summary: Xóa nhà cung cấp
 *     description: Xóa một nhà cung cấp.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Xóa nhà cung cấp thành công
 *       404:
 *         description: Không tìm thấy nhà cung cấp
 */
