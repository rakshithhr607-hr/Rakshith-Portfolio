import express from 'express';
import {
  createMessage,
  getMessages,
  getMessageById,
  toggleReadStatus,
  deleteMessage,
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', protect, getMessages);
router.get('/:id', protect, getMessageById);
router.patch('/:id/read', protect, toggleReadStatus);
router.delete('/:id', protect, deleteMessage);

export default router;
