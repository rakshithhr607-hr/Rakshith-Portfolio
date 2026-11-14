import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getProfile);
router.put('/', protect, updateProfile);
router.post('/upload-image', protect, upload.single('image'), uploadProfileImage);

export default router;
