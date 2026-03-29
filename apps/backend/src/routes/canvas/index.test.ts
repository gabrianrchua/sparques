import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = {
  get: vi.fn(),
  post: vi.fn(),
};
const Router = vi.fn(() => router);

const getCanvases = vi.fn();
const getCanvas = vi.fn();
const addBrushStroke = vi.fn();
const addCircleStroke = vi.fn();
const addRectangleStroke = vi.fn();
const addPolygonStroke = vi.fn();
const addTextStroke = vi.fn();
const addFillStroke = vi.fn();
const requireAuth = vi.fn();
const validateRequest = vi.fn((schema, target) => ({ schema, target }));

const CanvasNameOnlyParams = { name: 'CanvasNameOnlyParams' };
const BrushStrokeBody = { name: 'BrushStrokeBody' };
const CircleStrokeBody = { name: 'CircleStrokeBody' };
const RectangleStrokeBody = { name: 'RectangleStrokeBody' };
const PolygonStrokeBody = { name: 'PolygonStrokeBody' };
const TextStrokeBody = { name: 'TextStrokeBody' };
const FillStrokeBody = { name: 'FillStrokeBody' };

vi.mock('express', () => ({
  default: {
    Router,
  },
}));

vi.mock('./get-canvases.js', () => ({
  getCanvases,
}));

vi.mock('./get-canvas.js', () => ({
  getCanvas,
}));

vi.mock('./add-brush.js', () => ({
  addBrushStroke,
}));

vi.mock('./add-circle.js', () => ({
  addCircleStroke,
}));

vi.mock('./add-rectangle.js', () => ({
  addRectangleStroke,
}));

vi.mock('./add-polygon.js', () => ({
  addPolygonStroke,
}));

vi.mock('./add-text.js', () => ({
  addTextStroke,
}));

vi.mock('./add-fill.js', () => ({
  addFillStroke,
}));

vi.mock('../../middleware/require-auth.js', () => ({
  requireAuth,
}));

vi.mock('../../middleware/validate.js', () => ({
  validateRequest,
}));

vi.mock('../../schemas/canvas.js', () => ({
  CanvasNameOnlyParams,
  BrushStrokeBody,
  CircleStrokeBody,
  RectangleStrokeBody,
  PolygonStrokeBody,
  TextStrokeBody,
  FillStrokeBody,
}));

describe('routes/canvas/index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers the canvas routes', async () => {
    await import('./index.js');

    expect(router.get).toHaveBeenNthCalledWith(1, '/', getCanvases);
    expect(router.get).toHaveBeenNthCalledWith(
      2,
      '/:canvas',
      { schema: CanvasNameOnlyParams, target: 'params' },
      getCanvas,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      1,
      '/:canvas/brush',
      requireAuth,
      { schema: CanvasNameOnlyParams, target: 'params' },
      { schema: BrushStrokeBody, target: 'body' },
      addBrushStroke,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      2,
      '/:canvas/circle',
      requireAuth,
      { schema: CanvasNameOnlyParams, target: 'params' },
      { schema: CircleStrokeBody, target: 'body' },
      addCircleStroke,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      3,
      '/:canvas/rectangle',
      requireAuth,
      { schema: CanvasNameOnlyParams, target: 'params' },
      { schema: RectangleStrokeBody, target: 'body' },
      addRectangleStroke,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      4,
      '/:canvas/polygon',
      requireAuth,
      { schema: CanvasNameOnlyParams, target: 'params' },
      { schema: PolygonStrokeBody, target: 'body' },
      addPolygonStroke,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      5,
      '/:canvas/text',
      requireAuth,
      { schema: CanvasNameOnlyParams, target: 'params' },
      { schema: TextStrokeBody, target: 'body' },
      addTextStroke,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      6,
      '/:canvas/fill',
      requireAuth,
      { schema: CanvasNameOnlyParams, target: 'params' },
      { schema: FillStrokeBody, target: 'body' },
      addFillStroke,
    );
  });
});
