import { Request } from 'express';
import type { PolygonStroke } from '@sparques/types';
import { Polygon } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';
import type { RequiredAuthResponse } from '../../types/locals.js';

export const addPolygonStroke = async (
  req: Request<{ canvas: string }, unknown, PolygonStroke, never>,
  res: RequiredAuthResponse,
) =>
  persistStroke(
    req.params.canvas,
    Polygon,
    { type: 'Polygon', ...req.body },
    res,
  );
