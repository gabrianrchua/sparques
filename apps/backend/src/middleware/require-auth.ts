import { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';
import { readAccessToken, verifyAccessToken } from '../auth/session.js';
import type { RequiredAuthResponse } from '../types/locals.js';

export const requireAuth = (
  req: Request,
  res: RequiredAuthResponse,
  next: NextFunction,
) => {
  const token = readAccessToken(req);
  if (!token) {
    res
      .status(401)
      .json({ message: 'Unauthorized: Log in first, no token provided' });
  } else {
    try {
      const decoded = verifyAccessToken(token);
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
