import { z } from 'zod';
import type {
  BrushStroke,
  CircleStroke,
  Coordinate,
  FillStroke,
  PolygonStroke,
  RectangleStroke,
  TextStroke,
} from '@sparques/types';

export const CanvasNameOnlyParams = z.object({
  canvas: z.string(), // canvas name, not _id
});

const CoordinateSchema = z
  .object({
    x: z.number(),
    y: z.number(),
  })
  .strict() satisfies z.ZodType<Coordinate>;

export const BrushStrokeBody = z
  .object({
    color: z.string(),
    width: z.number(),
    coordinates: z.array(CoordinateSchema),
  })
  .strict() satisfies z.ZodType<BrushStroke>;

export const CircleStrokeBody = z
  .object({
    color: z.string(),
    width: z.number(),
    center: CoordinateSchema,
    radius: z.number(),
  })
  .strict() satisfies z.ZodType<CircleStroke>;

export const RectangleStrokeBody = z
  .object({
    color: z.string(),
    width: z.number(),
    topLeftCoordinates: CoordinateSchema,
    bottomRightCoordinates: CoordinateSchema,
  })
  .strict() satisfies z.ZodType<RectangleStroke>;

export const PolygonStrokeBody = z
  .object({
    color: z.string(),
    width: z.number(),
    numSides: z.number(),
    center: CoordinateSchema,
    sideLength: z.number(),
  })
  .strict() satisfies z.ZodType<PolygonStroke>;

export const TextStrokeBody = z
  .object({
    color: z.string(),
    fontSize: z.number(),
    topLeftCoordinates: CoordinateSchema,
    text: z.string(),
  })
  .strict() satisfies z.ZodType<TextStroke>;

export const FillStrokeBody = z
  .object({
    color: z.string(),
    coordinates: CoordinateSchema,
  })
  .strict() satisfies z.ZodType<FillStroke>;
