import express from 'express';
import {
  getPublicTeam,
  getAllTeamAdmin,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/teamController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPublicTeam);
router.get('/admin/all', authenticateToken, requireRole('admin'), getAllTeamAdmin);
router.post('/', authenticateToken, requireRole('admin'), createTeamMember);
router.put('/:id', authenticateToken, requireRole('admin'), updateTeamMember);
router.delete('/:id', authenticateToken, requireRole('admin'), deleteTeamMember);

export default router;
