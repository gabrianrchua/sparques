import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    next();
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        next();
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
};
