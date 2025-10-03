import { Request, Response } from 'express';
import Community from '../../models/Community.js';

export const getCommunity = async (req: Request, res: Response) => {
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
