import { Request, Response } from 'express';
import User from '../../models/User';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/env';

export const logIn = async (req: Request, res: Response) => {
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
};
