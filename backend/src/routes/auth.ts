import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import { requireAuth } from '../middleware/require-auth';
import { JWT_SECRET } from '../config/env';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({
      message: "Missing one or more of required fields: 'username', 'password'",
    });
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: 'Register success' });
  } catch (error) {
    if (error.code === 11000) {
      // user already exists
      res.status(409).json({ message: 'User already exists' });
    } else {
      // some other error
      res.status(500).json({ message: 'Server error', error: error });
    }
  }
});

// @route   POST /api/auth
// @desc    Log in as existing user
router.post('/', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({
      message: "Missing one or more of required fields: 'username', 'password'",
    });
  try {
    const user = await User.findOne({ username });
    if (user) {
      user.isCorrectPassword(password, (err, same) => {
        if (err) {
          res.status(500).json({ message: 'Server error', error: err });
        } else if (!same) {
          res.status(401).json({ message: 'Incorrect email or password' });
        } else {
          // Issue token
          const payload = { username };
          const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '24h',
          });
          res.cookie('token', token, { httpOnly: true }).json({
            message: 'Sign in successful',
            username,
            expireDate: new Date(
              ((jwt.decode(token) as jwt.JwtPayload)?.exp as number) * 1000,
            ),
          });
        }
      });
    } else {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   GET /api/auth/validate
// @desc    Check if user's token is still valid
router.get('/checkToken', requireAuth, (req: Request, res: Response) => {
  res.json({ message: 'Valid token' });
});

export default router;
