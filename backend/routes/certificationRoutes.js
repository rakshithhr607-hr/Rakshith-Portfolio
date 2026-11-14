import express from 'express';
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadCertificateImage,
} from '../controllers/certificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getCertifications);
router.post('/', protect, createCertification);
router.put('/:id', protect, updateCertification);
router.delete('/:id', protect, deleteCertification);
router.post('/upload-image', protect, upload.single('image'), uploadCertificateImage);

export default router;
