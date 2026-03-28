import { Request, Response } from 'express';
import type { BrushStroke } from '@sparques/types';
import { Brush } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';

export const addBrushStroke = async (
  req: Request<{ canvas: string }, object, BrushStroke>,
  res: Response,
) =>
  persistStroke(req.params.canvas, Brush, { type: 'Brush', ...req.body }, res);
