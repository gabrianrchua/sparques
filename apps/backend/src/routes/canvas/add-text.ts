import { Request, Response } from 'express';
import type { TextStroke } from '@sparques/types';
import { Text } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';

export const addTextStroke = async (
  req: Request<{ canvas: string }, object, TextStroke>,
  res: Response,
) =>
  persistStroke(req.params.canvas, Text, { type: 'Text', ...req.body }, res);
