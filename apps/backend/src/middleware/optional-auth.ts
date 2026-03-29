import { NextFunction, Request, Response } from 'express';
import { readAccessToken, verifyAccessToken } from '../auth/session.js';

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = readAccessToken(req);
  if (!token) {
    next();
  } else {
    try {
      const decoded = verifyAccessToken(token);
      res.locals.username = decoded.username;
      next();
    } catch {
      next();
    }
  }
};
