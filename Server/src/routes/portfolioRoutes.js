import express from 'express';
import {
  getPublicProjects,
  getProjectBySlug,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/portfolioController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPublicProjects);
router.get('/admin/all', authenticateToken, requireRole('admin'), getAllProjectsAdmin);
router.get('/:slug', getProjectBySlug);

router.post('/', authenticateToken, requireRole('admin'), createProject);
router.put('/:id', authenticateToken, requireRole('admin'), updateProject);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteProject);

export default router;
