// routes/postRoutes.js

import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePostById,
  deletePostById,
  updateApprovalStatus,
} from '../controllers/post.js';

const router = express.Router();

// Create a new post
router.post('/', createPost);

// Get all posts
router.get('/', getAllPosts);

// Get a post by ID
router.get('/:id', getPostById);

// Update a post by ID
router.put('/:id', updatePostById);

// Delete a post by ID
router.delete('/:id', deletePostById);

// Update approval status of a post
router.patch('/:id/approve', updateApprovalStatus);

export default router;
