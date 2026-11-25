import express from 'express';
import {
  getPublicTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPublicTestimonials);
router.get('/admin/all', authenticateToken, requireRole('admin'), getAllTestimonialsAdmin);
router.post('/', authenticateToken, requireRole('admin'), createTestimonial);
router.put('/:id', authenticateToken, requireRole('admin'), updateTestimonial);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteTestimonial);

export default router;
