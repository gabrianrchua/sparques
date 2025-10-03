import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import { SparquesJwtPayload } from '../types/sparques-jwt-payload.js';

export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    next();
  } else {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as SparquesJwtPayload;
      res.locals.username = decoded.username;
      next();
    } catch {
      next();
    }
  }
};
