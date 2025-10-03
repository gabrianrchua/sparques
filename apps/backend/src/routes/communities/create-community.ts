import { Request, Response } from 'express';
import Community from '../../models/Community.js';
import { mongo } from 'mongoose';

export const createCommunity = async (req: Request, res: Response) => {
  const { title, bannerImage, iconImage } = req.body;

  try {
    const newCommunity = new Community({ title, bannerImage, iconImage });
    const savedCommunity = await newCommunity.save();
    res.status(201).json(savedCommunity);
  } catch (error) {
    // intentionally using `==` instead of `===` because error.code may be a string
    if (error instanceof mongo.MongoError && error.code == 11000) {
      res.status(409).json({ message: 'Community already exists' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error });
    }
  }
};
