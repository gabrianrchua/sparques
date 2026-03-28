import { Request, Response } from 'express';
import type { RectangleStroke } from '@sparques/types';
import { Rectangle } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';

export const addRectangleStroke = async (
  req: Request<{ canvas: string }, object, RectangleStroke>,
  res: Response,
) =>
  persistStroke(
    req.params.canvas,
    Rectangle,
    { type: 'Rectangle', ...req.body },
    res,
  );
