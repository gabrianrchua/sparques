import { Request, Response } from 'express';
import User from '../../models/User.js';
import { issueAuthCookies } from '../../auth/session.js';

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
          issueAuthCookies(res, username, req.get('user-agent'))
            .then(() => {
              res.json({
                message: 'Sign in successful',
                username,
                authenticated: true,
              });
            })
            .catch((sessionError) => {
              res.status(500).json({
                message: 'Server error',
                error: sessionError,
              });
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
