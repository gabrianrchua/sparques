import { Request } from 'express';
import type { TextStroke } from '@sparques/types';
import { Text } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';
import type { RequiredAuthResponse } from '../../types/locals.js';

export const addTextStroke = async (
  req: Request<{ canvas: string }, unknown, TextStroke, never>,
  res: RequiredAuthResponse,
) =>
  persistStroke(req.params.canvas, Text, { type: 'Text', ...req.body }, res);
