import { Request, Response } from 'express';
import Community from '../../models/Community.js';
import type { GetCommunitiesQuery } from '../../schemas/communities.js';

export const getCommunities = async (
  req: Request<never, unknown, never, GetCommunitiesQuery>,
  res: Response,
) => {
  const title = req.query.title; // alternative to GET /api/community/:id
  if (title) {
    // get community info
    const community = await Community.findOne({ title });
    if (!community)
      return res.status(404).json({ message: 'Community not found' });
    res.json(community);
  } else {
    // get full list of communities
    try {
      const communities = await Community.find().select('-bannerImage');
      res.json(communities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error });
    }
  }
};
