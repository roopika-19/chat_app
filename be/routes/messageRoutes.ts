import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { allMessages, sendMessage } from '../controllers/messageController';
const router = express.Router();
router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,allMessages);


export default router;
