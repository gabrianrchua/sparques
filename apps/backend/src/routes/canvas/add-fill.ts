import { Request, Response } from 'express';
import type { FillStroke } from '@sparques/types';
import { Fill } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';

export const addFillStroke = async (
  req: Request<{ canvas: string }, object, FillStroke>,
  res: Response,
) =>
  persistStroke(req.params.canvas, Fill, { type: 'Fill', ...req.body }, res);
