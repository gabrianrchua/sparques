import express from 'express';
import { getCommunities } from './get-communities';
import { validateRequest } from '../../middleware/validate';
import {
  CreateCommunityBody,
  GetCommunitiesQuery,
  UpdateCommunityBody,
} from '../../schemas/communities';
import { IdOnlyParams } from '../../schemas/mongo';
import { getCommunity } from './get-community';
import { createCommunity } from './create-community';
import { updateCommunity } from './update-community';

const router = express.Router();

// @route   GET /api/community
// @desc    Get list of communities
router.get('/', validateRequest(GetCommunitiesQuery, 'query'), getCommunities);

// @route   GET /api/community/:id
// @desc    Get full community info by ID or name (title)
router.get('/:id', validateRequest(IdOnlyParams, 'params'), getCommunity);

// @route   POST /api/community
// @desc    Create a new community
router.post('/', validateRequest(CreateCommunityBody, 'body'), createCommunity);

// @route   PUT /api/community/:id
// @desc    Update a community by ID
router.put(
  '/:id',
  validateRequest(IdOnlyParams, 'params'),
  validateRequest(UpdateCommunityBody, 'body'),
  updateCommunity,
);

export default router;
