import express from 'express';
import {
  getMyProjects,
  getMyProjectDetails,
  getAllProjectsAdmin,
  getProjectByIdAdmin,
  createClientProject,
  updateClientProject,
  addClientUpdate,
  addInternalNote,
  addDeliverable,
} from '../controllers/clientProjectController.js';
import {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
} from '../controllers/milestoneController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Client Portal endpoints
router.get('/my', authenticateToken, getMyProjects);
router.get('/my/:id', authenticateToken, getMyProjectDetails);

// Admin Management endpoints
router.get('/admin/all', authenticateToken, requireRole('admin'), getAllProjectsAdmin);
router.get('/admin/:id', authenticateToken, requireRole('admin'), getProjectByIdAdmin);
router.post('/', authenticateToken, requireRole('admin'), createClientProject);
router.put('/:id', authenticateToken, requireRole('admin'), updateClientProject);
router.post('/:id/updates', authenticateToken, requireRole('admin'), addClientUpdate);
router.post('/:id/notes', authenticateToken, requireRole('admin'), addInternalNote);
router.post('/:id/deliverables', authenticateToken, requireRole('admin'), addDeliverable);

// Project Milestones endpoints
router.get('/:projectId/milestones', authenticateToken, getMilestones);
router.post('/:projectId/milestones', authenticateToken, requireRole('admin'), createMilestone);
router.put('/:projectId/milestones/:id', authenticateToken, requireRole('admin'), updateMilestone);
router.delete('/:projectId/milestones/:id', authenticateToken, requireRole('admin'), deleteMilestone);

export default router;
