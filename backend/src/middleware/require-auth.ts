import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    res
      .status(401)
      .json({ message: 'Unauthorized: Log in first, no token provided' });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res
          .status(401)
          .json({ message: 'Unauthorized: Log in again, invalid token' });
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};
