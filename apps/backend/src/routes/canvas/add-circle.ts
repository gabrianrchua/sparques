import { Request } from 'express';
import type { CircleStroke } from '@sparques/types';
import { Circle } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';
import type { RequiredAuthResponse } from '../../types/locals.js';

export const addCircleStroke = async (
  req: Request<{ canvas: string }, unknown, CircleStroke, never>,
  res: RequiredAuthResponse,
) =>
  persistStroke(req.params.canvas, Circle, { type: 'Circle', ...req.body }, res);
