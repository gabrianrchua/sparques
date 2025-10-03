import { Request, Response } from 'express';
import Community from '../../models/Community.js';

export const updateCommunity = async (req: Request, res: Response) => {
  // title cannot be modified later
  const { bannerImage, iconImage } = req.body;

  try {
    const community = await Community.findById(req.params.id);
    if (!community)
      return res.status(404).json({ message: 'Community not found' });

    const editedCommunity = await Community.findByIdAndUpdate(
      req.params.id,
      { bannerImage, iconImage },
      { new: true, runValidators: true },
    );
    res.json(editedCommunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};
