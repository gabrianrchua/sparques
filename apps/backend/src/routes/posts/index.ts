import express from 'express';
import { optionalAuth } from '../../middleware/optional-auth.js';
import { getPosts } from './get-posts.js';
import { validateRequest } from '../../middleware/validate.js';
import {
  CreateCommentBody,
  CreatePostBody,
  CreateVoteBody,
  GetPostsQuery,
  UpdatePostBody,
} from '../../schemas/posts.js';
import { createPost } from './create-post.js';
import { requireAuth } from '../../middleware/require-auth.js';
import { createComment } from './create-comment.js';
import { createVote } from './create-vote.js';
import { getPost } from './get-post.js';
import { updatePost } from './update-post.js';
import { deletePost } from './delete-post.js';
import { IdOnlyParams } from '../../schemas/mongo.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get feed posts with optional filter by community
router.get(
  '/',
  optionalAuth,
  validateRequest(GetPostsQuery, 'query'),
  getPosts,
);

// @route   POST /api/posts
// @desc    Create a new post
router.post(
  '/',
  requireAuth,
  validateRequest(CreatePostBody, 'body'),
  createPost,
);

// @route   POST /api/posts/:id/comment
// @desc    Create a new comment under a post
router.post(
  '/:id/comment',
  requireAuth,
  validateRequest(CreateCommentBody, 'body'),
  validateRequest(IdOnlyParams, 'params'),
  createComment,
);

// @route   POST /api/posts/:id/vote
// @desc    Upvote or downvote a post
router.post(
  '/:id/vote',
  requireAuth,
  validateRequest(CreateVoteBody, 'body'),
  validateRequest(IdOnlyParams, 'params'),
  createVote,
);

// @route   GET /api/posts/:id
// @desc    Get a single post by ID with all details
router.get(
  '/:id',
  optionalAuth,
  validateRequest(IdOnlyParams, 'params'),
  getPost,
);

// @route   PUT /api/posts/:id
// @desc    Update a post by ID
router.put(
  '/:id',
  requireAuth,
  validateRequest(UpdatePostBody, 'body'),
  validateRequest(IdOnlyParams, 'params'),
  updatePost,
);

// @route   DELETE /api/posts/:id
// @desc    Delete a post by ID
router.delete(
  '/:id',
  requireAuth,
  validateRequest(IdOnlyParams, 'params'),
  deletePost,
);

export default router;
