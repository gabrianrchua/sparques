import { Request, Response } from 'express';
import type { PolygonStroke } from '@sparques/types';
import { Polygon } from '../../models/Stroke.js';
import { persistStroke } from './add-stroke.js';

export const addPolygonStroke = async (
  req: Request<{ canvas: string }, object, PolygonStroke>,
  res: Response,
) =>
  persistStroke(
    req.params.canvas,
    Polygon,
    { type: 'Polygon', ...req.body },
    res,
  );
