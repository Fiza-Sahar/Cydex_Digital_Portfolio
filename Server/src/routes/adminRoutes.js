import express from 'express';
import {
  getDashboardStats,
  getClients,
  getClientDetails,
  updateClientStatus,
  getActivityLogs,
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken, requireRole('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/clients', getClients);
router.get('/clients/:id', getClientDetails);
router.put('/clients/:id/status', updateClientStatus);
router.get('/activity-logs', getActivityLogs);

export default router;
