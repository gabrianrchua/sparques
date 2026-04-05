import { Request } from 'express';
import type { BrushStroke } from '@sparques/types';
import { Brush } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';
import type { RequiredAuthResponse } from '../../types/locals.js';

export const addBrushStroke = async (
  req: Request<{ canvas: string }, unknown, BrushStroke, never>,
  res: RequiredAuthResponse,
) =>
  persistStroke(req.params.canvas, Brush, { type: 'Brush', ...req.body }, res);
