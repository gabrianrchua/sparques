import { Request, Response } from 'express';
import type { CircleStroke } from '@sparques/types';
import { Circle } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';

export const addCircleStroke = async (
  req: Request<{ canvas: string }, object, CircleStroke>,
  res: Response,
) =>
  persistStroke(req.params.canvas, Circle, { type: 'Circle', ...req.body }, res);
