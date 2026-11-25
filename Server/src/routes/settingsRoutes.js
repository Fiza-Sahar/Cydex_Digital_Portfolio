import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', authenticateToken, requireRole('admin'), updateSettings);

export default router;
