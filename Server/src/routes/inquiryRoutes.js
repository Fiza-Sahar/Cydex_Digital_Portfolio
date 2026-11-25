import express from 'express';
import {
  createInquiry,
  getClientInquiries,
  getAllInquiriesAdmin,
  getInquiryById,
  updateInquiryStatus,
  addInquiryNote,
  convertInquiryToProject,
  resendInquiryEmail,
} from '../controllers/inquiryController.js';
import { authenticateToken, requireRole, optionalAuth } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public / client submission
router.post('/', contactLimiter, optionalAuth, createInquiry);

// Client inquiries
router.get('/my', authenticateToken, getClientInquiries);

// Admin CRM endpoints
router.get('/', authenticateToken, requireRole('admin'), getAllInquiriesAdmin);
router.get('/:id', authenticateToken, requireRole('admin'), getInquiryById);
router.put('/:id/status', authenticateToken, requireRole('admin'), updateInquiryStatus);
router.post('/:id/notes', authenticateToken, requireRole('admin'), addInquiryNote);
router.post('/:id/convert', authenticateToken, requireRole('admin'), convertInquiryToProject);
router.post('/:id/resend-email', authenticateToken, requireRole('admin'), resendInquiryEmail);

export default router;
