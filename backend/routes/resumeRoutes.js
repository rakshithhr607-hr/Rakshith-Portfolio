import express from 'express';
import {
  getActiveResume,
  uploadResume,
  downloadResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getActiveResume);
router.get('/download', downloadResume);
router.post('/upload', protect, upload.single('resume'), uploadResume);
router.delete('/:id', protect, deleteResume);

export default router;
