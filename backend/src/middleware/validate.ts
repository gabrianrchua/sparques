import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// middleware to validate schema using zod
export const validateRequest =
  (schema: z.ZodObject, target: 'body' | 'query' | 'params') =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: `Input validation error in ${target}`,
          error: error.issues,
        });
      }
      next(error); // pass any other errors to the next error handler
    }
  };
