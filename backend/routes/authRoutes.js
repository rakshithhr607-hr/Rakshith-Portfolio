import express from 'express';
import { loginAdmin, getMe, updatePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, getMe);
router.put('/update-password', protect, updatePassword);

export default router;
