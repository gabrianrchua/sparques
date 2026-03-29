import { describe, expect, it } from 'vitest';

import {
  BrushStrokeBody,
  CanvasNameOnlyParams,
  CircleStrokeBody,
  FillStrokeBody,
  PolygonStrokeBody,
  RectangleStrokeBody,
  TextStrokeBody,
} from './canvas.js';

describe('schemas/canvas', () => {
  it('parses each supported stroke payload', () => {
    expect(CanvasNameOnlyParams.parse({ canvas: 'main' })).toEqual({
      canvas: 'main',
    });
    expect(
      BrushStrokeBody.parse({
        color: '#000',
        width: 2,
        coordinates: [{ x: 1, y: 2 }],
      }),
    ).toEqual({
      color: '#000',
      width: 2,
      coordinates: [{ x: 1, y: 2 }],
    });
    expect(
      CircleStrokeBody.parse({
        color: '#111',
        width: 3,
        center: { x: 1, y: 2 },
        radius: 4,
      }),
    ).toEqual({
      color: '#111',
      width: 3,
      center: { x: 1, y: 2 },
      radius: 4,
    });
    expect(
      RectangleStrokeBody.parse({
        color: '#222',
        width: 4,
        topLeftCoordinates: { x: 0, y: 0 },
        bottomRightCoordinates: { x: 5, y: 5 },
      }),
    ).toEqual({
      color: '#222',
      width: 4,
      topLeftCoordinates: { x: 0, y: 0 },
      bottomRightCoordinates: { x: 5, y: 5 },
    });
    expect(
      PolygonStrokeBody.parse({
        color: '#333',
        width: 5,
        numSides: 6,
        center: { x: 2, y: 2 },
        sideLength: 8,
      }),
    ).toEqual({
      color: '#333',
      width: 5,
      numSides: 6,
      center: { x: 2, y: 2 },
      sideLength: 8,
    });
    expect(
      TextStrokeBody.parse({
        color: '#444',
        fontSize: 16,
        topLeftCoordinates: { x: 3, y: 3 },
        text: 'hi',
      }),
    ).toEqual({
      color: '#444',
      fontSize: 16,
      topLeftCoordinates: { x: 3, y: 3 },
      text: 'hi',
    });
    expect(
      FillStrokeBody.parse({
        color: '#555',
        coordinates: { x: 4, y: 4 },
      }),
    ).toEqual({
      color: '#555',
      coordinates: { x: 4, y: 4 },
    });
  });

  it('rejects unexpected extra properties', () => {
    expect(() =>
      BrushStrokeBody.parse({
        color: '#000',
        width: 2,
        coordinates: [{ x: 1, y: 2, z: 3 }],
      }),
    ).toThrow();
  });
});
