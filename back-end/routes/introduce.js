const express = require('express');
const login = require('../controllers/login'); // Import controller

const router = express.Router();

router.post('/login_raw', login.login_raw);
router.post('/login_google', login.login_google);
router.post('/sign_up', login.sign_up);
router.post('/forgot_password', login.forgot_password);
router.post('/change_password', login.change_password);
router.post('/change_password2', login.change_password2);
module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: API quản lý xác thực và tài khoản người dùng
 */

/**
 * @swagger
 * /login_raw:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Đăng nhập bằng thông tin tài khoản
 *     description: Cho phép người dùng đăng nhập bằng username và password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên tài khoản
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai thông tin đăng nhập
 */

/**
 * @swagger
 * /login_google:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Đăng nhập bằng Google
 *     description: Cho phép người dùng đăng nhập bằng tài khoản Google.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Mã token Google
 *             required:
 *               - token
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Xác thực thất bại
 */

/**
 * @swagger
 * /sign_up:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Đăng ký tài khoản
 *     description: Cho phép người dùng tạo tài khoản mới.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên tài khoản
 *               email:
 *                 type: string
 *                 description: Email người dùng
 *               password:
 *                 type: string
 *                 description: Mật khẩu
 *             required:
 *               - username
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Đăng ký tài khoản thành công
 *       400:
 *         description: Thông tin không hợp lệ
 */

/**
 * @swagger
 * /forgot_password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Quên mật khẩu
 *     description: Gửi yêu cầu để lấy lại mật khẩu.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email đã đăng ký tài khoản
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Yêu cầu lấy lại mật khẩu thành công
 *       404:
 *         description: Không tìm thấy tài khoản với email cung cấp
 */

/**
 * @swagger
 * /change_password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Thay đổi mật khẩu
 *     description: Cho phép người dùng thay đổi mật khẩu cũ sang mật khẩu mới.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Mật khẩu cũ
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *             required:
 *               - oldPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Thay đổi mật khẩu thành công
 *       401:
 *         description: Mật khẩu cũ không chính xác
 */

/**
 * @swagger
 * /change_password2:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Đặt lại mật khẩu mới
 *     description: Cho phép người dùng đặt lại mật khẩu mới thông qua mã xác minh.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetCode:
 *                 type: string
 *                 description: Mã xác minh để đặt lại mật khẩu
 *               newPassword:
 *                 type: string
 *                 description: Mật khẩu mới
 *             required:
 *               - resetCode
 *               - newPassword
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *       400:
 *         description: Mã xác minh không hợp lệ
 */
