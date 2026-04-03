import express from 'express';
import { optionalAuth } from '../../middleware/optional-auth.js';
import { requireAuth } from '../../middleware/require-auth.js';
import { validateRequest } from '../../middleware/validate.js';
import { IdOnlyParams } from '../../schemas/mongo.js';
import {
  CommentListQuery,
  CreateReplyBody,
  CreateVoteBody,
} from '../../schemas/comments.js';
import { getReplies } from './get-replies.js';
import { createReply } from './create-reply.js';
import { createCommentVote } from './create-comment-vote.js';

const router = express.Router();

router.get(
  '/:id/replies',
  optionalAuth,
  validateRequest(CommentListQuery, 'query'),
  validateRequest(IdOnlyParams, 'params'),
  getReplies,
);

router.post(
  '/:id/replies',
  requireAuth,
  validateRequest(CreateReplyBody, 'body'),
  validateRequest(IdOnlyParams, 'params'),
  createReply,
);

router.post(
  '/:id/vote',
  requireAuth,
  validateRequest(CreateVoteBody, 'body'),
  validateRequest(IdOnlyParams, 'params'),
  createCommentVote,
);

export default router;
