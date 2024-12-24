const express = require('express');
const chat = require('../controllers/chat.js'); // Import controller

const router = express.Router();

router.post('/getMessages', chat.getMessages);
module.exports = router;

/**
 * @swagger
 * tags:
 *   - name: Chat
 *     description: API quản lý tin nhắn chat
 */

/**
 * @swagger
 * /chat/getMessages:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Lấy danh sách tin nhắn
 *     description: Endpoint này dùng để lấy danh sách tin nhắn trong một cuộc trò chuyện cụ thể.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversationId:
 *                 type: string
 *                 description: ID của cuộc trò chuyện
 *               limit:
 *                 type: integer
 *                 description: Số lượng tin nhắn tối đa cần lấy (tùy chọn)
 *                 example: 50
 *               offset:
 *                 type: integer
 *                 description: Vị trí bắt đầu lấy tin nhắn (tùy chọn)
 *                 example: 0
 *             required:
 *               - conversationId
 *     responses:
 *       200:
 *         description: Lấy danh sách tin nhắn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: ID của tin nhắn
 *                       sender:
 *                         type: string
 *                         description: Người gửi tin nhắn
 *                       content:
 *                         type: string
 *                         description: Nội dung tin nhắn
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: Thời gian gửi tin nhắn
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       404:
 *         description: Không tìm thấy cuộc trò chuyện
 */
