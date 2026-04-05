import { Request } from 'express';
import Community from '../../models/Community.js';
import type { IdOnlyParams } from '../../schemas/mongo.js';
import type { NoAuthResponse } from '../../types/locals.js';

export const getCommunity = async (
  req: Request<IdOnlyParams, unknown, never, never>,
  res: NoAuthResponse,
) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: 'Community not found' });
    res.json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
