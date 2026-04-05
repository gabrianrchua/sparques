import { NextFunction, Request } from 'express';
import { readAccessToken, verifyAccessToken } from '../auth/session.js';
import type { OptionalAuthResponse } from '../types/locals.js';

export const optionalAuth = (
  req: Request,
  res: OptionalAuthResponse,
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
