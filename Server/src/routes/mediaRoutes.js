import express from 'express';
import { uploadMedia, getMediaAssets, deleteMediaAsset } from '../controllers/mediaController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(authenticateToken, requireRole('admin'));

router.post('/upload', upload.single('file'), uploadMedia);
router.get('/', getMediaAssets);
router.delete('/:id', deleteMediaAsset);

export default router;
