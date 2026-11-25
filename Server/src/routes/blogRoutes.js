import express from 'express';
import {
  getPublicPosts,
  getPostBySlug,
  getCategories,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost,
  createCategory,
} from '../controllers/blogController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPublicPosts);
router.get('/categories', getCategories);
router.get('/admin/all', authenticateToken, requireRole('admin'), getAllPostsAdmin);
router.get('/:slug', getPostBySlug);

router.post('/', authenticateToken, requireRole('admin'), createPost);
router.put('/:id', authenticateToken, requireRole('admin'), updatePost);
router.delete('/:id', authenticateToken, requireRole('admin'), deletePost);
router.post('/categories', authenticateToken, requireRole('admin'), createCategory);

export default router;
