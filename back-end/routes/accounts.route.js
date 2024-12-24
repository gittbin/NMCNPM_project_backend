const express = require('express');
const account = require('../controllers/userController'); // Import controller
const authorize = require('../controllers/middlewareUserController')

const router = express.Router();

router.post('/create',authorize.authorize("create_user"),account.createUser);
router.post('/send_again',authorize.authorize("create_user"),account.sendAgain);
router.get('/show',account.showUser);
router.delete('/delete/:id', account.deleteUser);
router.put('/edit/:id', account.editUser);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: User Management
 *     description: API quản lý người dùng
 */


/**
 * @swagger
 * /accounts/create:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Tạo mới người dùng
 *     description: Endpoint này cho phép người dùng có quyền tạo mới một người dùng.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: Tạo người dùng thành công
 *       403:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /accounts/send_again:
 *   post:
 *     tags:
 *       - User Management
 *     summary: Gửi lại email xác minh
 *     description: Cho phép người dùng có quyền gửi lại email xác minh cho một người dùng.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Gửi email thành công
 *       403:
 *         description: Không có quyền truy cập
 */

/**
 * @swagger
 * /accounts/show:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Hiển thị thông tin người dùng
 *     description: Lấy thông tin về người dùng hiện tại.
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 */

/**
 * @swagger
 * /accounts/delete/{id}:
 *   delete:
 *     tags:
 *       - User Management
 *     summary: Xóa người dùng
 *     description: Xóa một người dùng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần xóa
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */

/**
 * @swagger
 * /accounts/edit/{id}:
 *   put:
 *     tags:
 *       - User Management
 *     summary: Chỉnh sửa thông tin người dùng
 *     description: Cập nhật thông tin người dùng theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng cần chỉnh sửa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thông tin người dùng thành công
 *       404:
 *         description: Không tìm thấy người dùng
 */
