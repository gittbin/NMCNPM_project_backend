const express = require('express');
const calendar = require('../controllers/calendarController'); // Import controller

const router = express.Router();

router.post('/create',calendar.createEvent);
router.put('/update/:id',calendar.updateEvent);
router.get('/show',calendar.getEvents);
router.delete('/delete/:id',calendar.deleteEvents);

module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Calendar
 *     description: API quản lý lịch làm việc
 */

/**
 * @swagger
 * /calendar/create:
 *   post:
 *     tags:
 *       - Calendar
 *     summary: Tạo một sự kiện mới
 *     description: Endpoint để tạo một sự kiện trong lịch.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề của sự kiện
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày và giờ của sự kiện
 *               description:
 *                 type: string
 *                 description: Mô tả sự kiện
 *     responses:
 *       201:
 *         description: Sự kiện được tạo thành công
 */

/**
 * @swagger
 * /calendar/update/{id}:
 *   put:
 *     tags:
 *       - Calendar
 *     summary: Cập nhật thông tin sự kiện
 *     description: Endpoint để cập nhật thông tin sự kiện dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sự kiện cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Tiêu đề mới của sự kiện
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Ngày và giờ mới của sự kiện
 *               description:
 *                 type: string
 *                 description: Mô tả mới của sự kiện
 *     responses:
 *       200:
 *         description: Cập nhật sự kiện thành công
 */

/**
 * @swagger
 * /calendar/show:
 *   get:
 *     tags:
 *       - Calendar
 *     summary: Hiển thị danh sách sự kiện
 *     description: Lấy danh sách tất cả các sự kiện đã được tạo.
 *     responses:
 *       200:
 *         description: Lấy danh sách sự kiện thành công
 */

/**
 * @swagger
 * /calendar/delete/{id}:
 *   delete:
 *     tags:
 *       - Calendar
 *     summary: Xóa một sự kiện
 *     description: Endpoint để xóa một sự kiện dựa trên ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sự kiện cần xóa
 *     responses:
 *       200:
 *         description: Xóa sự kiện thành công
 */
