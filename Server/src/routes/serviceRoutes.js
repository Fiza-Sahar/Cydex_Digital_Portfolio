import express from 'express';
import {
  getPublicServices,
  getServiceBySlug,
  getAllServicesAdmin,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPublicServices);
router.get('/admin/all', authenticateToken, requireRole('admin'), getAllServicesAdmin);
router.get('/:slug', getServiceBySlug);

router.post('/', authenticateToken, requireRole('admin'), createService);
router.put('/:id', authenticateToken, requireRole('admin'), updateService);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteService);

export default router;
