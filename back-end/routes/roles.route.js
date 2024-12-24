const express = require('express');
const roles = require('../controllers/rolesController'); // Import controller

const router = express.Router();

router.post('/create',roles.createRole);
router.get('/show',roles.showRole);
router.delete('/delete/:id',roles.deleteRole);
router.post('/edit',roles.editRole);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Roles Management
 *     description: API quản lý vai trò (roles)
 */

/**
 * @swagger
 * /roles/create:
 *   post:
 *     tags:
 *       - Roles Management
 *     summary: Tạo mới vai trò
 *     description: Endpoint này cho phép tạo mới một vai trò.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên của vai trò
 *               description:
 *                 type: string
 *                 description: Mô tả vai trò
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: Tạo vai trò thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 */

/**
 * @swagger
 * /roles/show:
 *   get:
 *     tags:
 *       - Roles Management
 *     summary: Hiển thị danh sách vai trò
 *     description: Lấy thông tin danh sách các vai trò hiện tại.
 *     responses:
 *       200:
 *         description: Lấy danh sách vai trò thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ID của vai trò
 *                   name:
 *                     type: string
 *                     description: Tên của vai trò
 *                   description:
 *                     type: string
 *                     description: Mô tả vai trò
 *       404:
 *         description: Không tìm thấy dữ liệu
 */

/**
 * @swagger
 * /roles/delete/{id}:
 *   delete:
 *     tags:
 *       - Roles Management
 *     summary: Xóa vai trò
 *     description: Xóa một vai trò dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò cần xóa
 *     responses:
 *       200:
 *         description: Xóa vai trò thành công
 *       404:
 *         description: Không tìm thấy vai trò
 */

/**
 * @swagger
 * /roles/edit:
 *   post:
 *     tags:
 *       - Roles Management
 *     summary: Chỉnh sửa vai trò
 *     description: Cập nhật thông tin của một vai trò.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID của vai trò cần chỉnh sửa
 *               name:
 *                 type: string
 *                 description: Tên mới của vai trò
 *               description:
 *                 type: string
 *                 description: Mô tả mới của vai trò
 *             required:
 *               - id
 *     responses:
 *       200:
 *         description: Cập nhật vai trò thành công
 *       404:
 *         description: Không tìm thấy vai trò
 */
