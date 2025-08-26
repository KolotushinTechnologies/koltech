import { Router } from 'express';
import Joi from 'joi';
import {
  getPosts,
  getFeed,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getPostComments,
  addComment,
  searchPosts
} from '../controllers/postsController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';

const router = Router();

// Validation schemas
const createPostSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).required().messages({
    'string.min': 'Post content cannot be empty',
    'string.max': 'Post content cannot exceed 2000 characters'
  }),
  images: Joi.array().items(Joi.string().uri()).optional(),
  type: Joi.string().valid('post', 'project_update', 'achievement', 'announcement').optional(),
  tags: Joi.array().items(Joi.string().trim().max(30)).optional(),
  visibility: Joi.string().valid('public', 'followers', 'private').optional(),
  metadata: Joi.object({
    projectId: Joi.string().optional(),
    location: Joi.string().max(100).optional(),
    linkedUrl: Joi.string().uri().optional(),
    mentions: Joi.array().items(Joi.string()).optional()
  }).optional()
});

const updatePostSchema = Joi.object({
  content: Joi.string().trim().min(1).max(2000).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  tags: Joi.array().items(Joi.string().trim().max(30)).optional(),
  visibility: Joi.string().valid('public', 'followers', 'private').optional(),
  metadata: Joi.object({
    projectId: Joi.string().optional(),
    location: Joi.string().max(100).optional(),
    linkedUrl: Joi.string().uri().optional(),
    mentions: Joi.array().items(Joi.string()).optional()
  }).optional()
});

const addCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(500).required().messages({
    'string.min': 'Comment content cannot be empty',
    'string.max': 'Comment content cannot exceed 500 characters'
  }),
  parentComment: Joi.string().optional()
});

// Public routes
router.get('/', optionalAuth, getPosts);
router.get('/search', optionalAuth, searchPosts);
router.get('/:id', optionalAuth, getPost);
router.get('/:id/comments', getPostComments);

// Protected routes
router.get('/feed/personal', protect, getFeed);
router.post('/', protect, validateRequest(createPostSchema), createPost);
router.put('/:id', protect, validateRequest(updatePostSchema), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, validateRequest(addCommentSchema), addComment);

export default router;