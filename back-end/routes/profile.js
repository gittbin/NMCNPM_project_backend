const express = require('express');
const profile = require('../controllers/profile.js'); // Import controller

const router = express.Router();

router.post('/get_profile', profile.get_profile);
router.post('/change_profile', profile.change_profile);
router.post('/update_avatar', profile.update_avatar);
module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Profile
 *     description: API quản lý thông tin cá nhân và ảnh đại diện
 */

/**
 * @swagger
 * /profile/get_profile:
 *   post:
 *     tags:
 *       - Profile
 *     summary: Lấy thông tin hồ sơ người dùng
 *     description: Lấy thông tin hồ sơ của người dùng hiện tại.
 *     responses:
 *       200:
 *         description: Lấy thông tin hồ sơ thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /profile/change_profile:
 *   post:
 *     tags:
 *       - Profile
 *     summary: Chỉnh sửa thông tin hồ sơ
 *     description: Cập nhật thông tin hồ sơ của người dùng.
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
 *     responses:
 *       200:
 *         description: Cập nhật hồ sơ thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /profile/update_avatar:
 *   post:
 *     tags:
 *       - Profile
 *     summary: Cập nhật ảnh đại diện
 *     description: Cập nhật ảnh đại diện của người dùng.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               avatarUrl:
 *                 type: string
 *             required:
 *               - avatarUrl
 *     responses:
 *       200:
 *         description: Cập nhật ảnh đại diện thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */
