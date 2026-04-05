import { Request } from 'express';
import User from '../../models/User.js';
import { mongo } from 'mongoose';
import type { RegisterUserBody } from '../../schemas/auth.js';
import type { NoAuthResponse } from '../../types/locals.js';

export const registerUser = async (
  req: Request<never, unknown, RegisterUserBody, never>,
  res: NoAuthResponse,
) => {
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
