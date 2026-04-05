import { Request } from 'express';
import type { FillStroke } from '@sparques/types';
import { Fill } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';
import type { RequiredAuthResponse } from '../../types/locals.js';

export const addFillStroke = async (
  req: Request<{ canvas: string }, unknown, FillStroke, never>,
  res: RequiredAuthResponse,
) =>
  persistStroke(req.params.canvas, Fill, { type: 'Fill', ...req.body }, res);
