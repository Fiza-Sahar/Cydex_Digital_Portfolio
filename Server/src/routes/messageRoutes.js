import express from 'express';
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
  getUnreadCount,
} from '../controllers/messageController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/conversations', getConversations);
router.post('/conversations', startConversation);
router.get('/conversations/:id', getMessages);
router.post('/conversations/:id', sendMessage);
router.get('/unread-count', getUnreadCount);

export default router;
