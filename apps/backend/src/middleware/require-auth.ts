import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { SparquesJwtPayload } from '../types/sparques-jwt-payload.js';

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
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as SparquesJwtPayload;
      res.locals.username = decoded.username;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired' });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      console.error('JWT verification error:', error);
      return res
        .status(500)
        .json({ message: 'Internal server error during token verification' });
    }
  }
};
