import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// middlewares to validate schema using zod
export const validateBody =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({
            message: 'Input validation error in body',
            error: error.issues,
          });
      }
      next(error); // Pass other errors to the next error handler
    }
  };

export const validateParams =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({
            message: 'Input validation error in params',
            error: error.issues,
          });
      }
      next(error); // Pass other errors to the next error handler
    }
  };

export const validateQuery =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({
            message: 'Input validation error in query',
            error: error.issues,
          });
      }
      next(error); // Pass other errors to the next error handler
    }
  };
