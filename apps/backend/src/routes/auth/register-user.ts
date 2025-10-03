import { Request, Response } from 'express';
import User from '../../models/User.js';
import { mongo } from 'mongoose';

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Register success' });
  } catch (error) {
    // intentionally left as `==` and not `===` because error.code may be a string
    if (error instanceof mongo.MongoError && error.code == 11000) {
      // user already exists
      res.status(409).json({ message: 'User already exists' });
    } else {
      // some other error
      res.status(500).json({ message: 'Server error', error: error });
    }
  }
};
