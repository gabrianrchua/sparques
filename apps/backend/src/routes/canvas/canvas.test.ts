import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRequest, createResponse } from '../../test-utils/http.js';

const findCanvas = vi.fn();
const findCanvasByIdAndUpdate = vi.fn();
const Canvas = {
  find: vi.fn(),
  findOne: findCanvas,
  findByIdAndUpdate: findCanvasByIdAndUpdate,
};

const fetchCanvas = vi.fn();
const render = vi.fn();
const persistStroke = vi.fn();

const BrushStrokeModel = vi.fn((parameters: unknown) => ({ parameters }));
const CircleStrokeModel = vi.fn((parameters: unknown) => ({ parameters }));
const RectangleStrokeModel = vi.fn((parameters: unknown) => ({ parameters }));
const PolygonStrokeModel = vi.fn((parameters: unknown) => ({ parameters }));
const TextStrokeModel = vi.fn((parameters: unknown) => ({ parameters }));
const FillStrokeModel = vi.fn((parameters: unknown) => ({ parameters }));

vi.mock('../../models/Canvas.js', () => ({
  default: Canvas,
}));

vi.mock('../../canvas/fetch-canvas.js', () => ({
  default: fetchCanvas,
}));

vi.mock('../../canvas/canvas.js', () => ({
  render,
}));

vi.mock('../../models/Stroke.js', () => ({
  Brush: BrushStrokeModel,
  Circle: CircleStrokeModel,
  Rectangle: RectangleStrokeModel,
  Polygon: PolygonStrokeModel,
  Text: TextStrokeModel,
  Fill: FillStrokeModel,
}));

vi.mock('./add-stroke.js', async () => {
  const actual = await vi.importActual<typeof import('./add-stroke.js')>(
    './add-stroke.js',
  );

  return {
    ...actual,
    persistStroke,
  };
});

describe('routes/canvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getCanvases returns title-only results', async () => {
    const { getCanvases } = await import('./get-canvases.js');
    const req = createRequest();
    const res = createResponse();
    const select = vi.fn().mockResolvedValueOnce([{ title: 'main' }]);
    vi.mocked(Canvas.find).mockReturnValueOnce({ select } as never);

    await getCanvases(req, res);

    expect(select).toHaveBeenCalledWith('title');
    expect(res.json).toHaveBeenCalledWith([{ title: 'main' }]);
  });

  it('getCanvas returns the fetched canvas', async () => {
    const { getCanvas } = await import('./get-canvas.js');
    const req = createRequest({ params: { canvas: 'main' } });
    const res = createResponse();
    fetchCanvas.mockResolvedValueOnce({ _id: 'canvas-1' });

    await getCanvas(req, res);

    expect(fetchCanvas).toHaveBeenCalledWith('main');
    expect(res.json).toHaveBeenCalledWith({ _id: 'canvas-1' });
  });

  it('persistStroke rejects a missing canvas name', async () => {
    const { persistStroke: actualPersistStroke } =
      await vi.importActual<typeof import('./add-stroke.js')>('./add-stroke.js');
    const res = createResponse();

    await actualPersistStroke(
      '',
      BrushStrokeModel,
      { type: 'Brush', color: '#000', width: 1, coordinates: [] },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('persistStroke saves the stroke and flushes after the threshold', async () => {
    const { persistStroke: actualPersistStroke } =
      await vi.importActual<typeof import('./add-stroke.js')>('./add-stroke.js');
    const res = createResponse();
    fetchCanvas.mockResolvedValueOnce({
      _id: 'canvas-1',
      strokes: { length: 5 },
      baseImage: 'base-image',
    });
    findCanvasByIdAndUpdate.mockResolvedValue(undefined);
    findCanvas.mockResolvedValueOnce({
      _id: 'canvas-1',
      strokes: { toObject: () => [{ type: 'Brush' }] },
      baseImage: 'base-image',
    });
    render.mockResolvedValueOnce('rendered-image');

    await actualPersistStroke(
      'main',
      BrushStrokeModel,
      { type: 'Brush', color: '#000', width: 1, coordinates: [] },
      res,
    );

    expect(findCanvasByIdAndUpdate).toHaveBeenNthCalledWith(1, 'canvas-1', {
      $push: {
        strokes: {
          parameters: {
            type: 'Brush',
            color: '#000',
            width: 1,
            coordinates: [],
          },
        },
      },
    });
    expect(render).toHaveBeenCalledWith([{ type: 'Brush' }], 'base-image');
    expect(findCanvasByIdAndUpdate).toHaveBeenNthCalledWith(2, 'canvas-1', {
      baseImage: 'rendered-image',
      strokes: [],
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('persistStroke returns 404 when fetching the canvas fails', async () => {
    const { persistStroke: actualPersistStroke } =
      await vi.importActual<typeof import('./add-stroke.js')>('./add-stroke.js');
    const res = createResponse();
    fetchCanvas.mockRejectedValueOnce(new Error('Community does not exist'));

    await actualPersistStroke(
      'missing',
      BrushStrokeModel,
      { type: 'Brush', color: '#000', width: 1, coordinates: [] },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Community does not exist',
    });
  });

  it('persistStroke saves the stroke without flushing when under the threshold', async () => {
    const { persistStroke: actualPersistStroke } =
      await vi.importActual<typeof import('./add-stroke.js')>('./add-stroke.js');
    const res = createResponse();
    fetchCanvas.mockResolvedValueOnce({
      _id: 'canvas-1',
      strokes: { length: 0 },
      baseImage: 'base-image',
    });

    await actualPersistStroke(
      'main',
      BrushStrokeModel,
      { type: 'Brush', color: '#000', width: 1, coordinates: [] },
      res,
    );

    expect(findCanvasByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(render).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('persistStroke swallows rerender errors after sending the response', async () => {
    const { persistStroke: actualPersistStroke } =
      await vi.importActual<typeof import('./add-stroke.js')>('./add-stroke.js');
    const res = createResponse();
    fetchCanvas.mockResolvedValueOnce({
      _id: 'canvas-1',
      strokes: { length: 5 },
      baseImage: 'base-image',
    });
    findCanvasByIdAndUpdate.mockResolvedValue(undefined);
    findCanvas.mockResolvedValueOnce(null);

    await actualPersistStroke(
      'main',
      BrushStrokeModel,
      { type: 'Brush', color: '#000', width: 1, coordinates: [] },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(render).not.toHaveBeenCalled();
    expect(findCanvasByIdAndUpdate).toHaveBeenCalledTimes(1);
  });

  it('persistStroke returns 500 when the initial save fails', async () => {
    const { persistStroke: actualPersistStroke } =
      await vi.importActual<typeof import('./add-stroke.js')>('./add-stroke.js');
    const res = createResponse();
    const error = new Error('update failed');
    fetchCanvas.mockResolvedValueOnce({
      _id: 'canvas-1',
      strokes: { length: 0 },
      baseImage: 'base-image',
    });
    findCanvasByIdAndUpdate.mockRejectedValueOnce(error);

    await actualPersistStroke(
      'main',
      BrushStrokeModel,
      { type: 'Brush', color: '#000', width: 1, coordinates: [] },
      res,
    );

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
      error,
    });
  });

  it('stroke route wrappers delegate to persistStroke with the expected type', async () => {
    const req = createRequest({
      params: { canvas: 'main' },
      body: { color: '#000', width: 1, coordinates: [] },
    });
    const res = createResponse();

    const { addBrushStroke } = await import('./add-brush.js');
    const { addCircleStroke } = await import('./add-circle.js');
    const { addRectangleStroke } = await import('./add-rectangle.js');
    const { addPolygonStroke } = await import('./add-polygon.js');
    const { addTextStroke } = await import('./add-text.js');
    const { addFillStroke } = await import('./add-fill.js');

    await addBrushStroke(req as never, res);
    await addCircleStroke(
      createRequest({
        params: { canvas: 'main' },
        body: { color: '#111', width: 2, center: { x: 1, y: 2 }, radius: 4 },
      }) as never,
      res,
    );
    await addRectangleStroke(
      createRequest({
        params: { canvas: 'main' },
        body: {
          color: '#222',
          width: 2,
          topLeftCoordinates: { x: 0, y: 0 },
          bottomRightCoordinates: { x: 3, y: 3 },
        },
      }) as never,
      res,
    );
    await addPolygonStroke(
      createRequest({
        params: { canvas: 'main' },
        body: {
          color: '#333',
          width: 2,
          numSides: 5,
          center: { x: 2, y: 2 },
          sideLength: 6,
        },
      }) as never,
      res,
    );
    await addTextStroke(
      createRequest({
        params: { canvas: 'main' },
        body: {
          color: '#444',
          fontSize: 12,
          topLeftCoordinates: { x: 1, y: 1 },
          text: 'hi',
        },
      }) as never,
      res,
    );
    await addFillStroke(
      createRequest({
        params: { canvas: 'main' },
        body: { color: '#555', coordinates: { x: 1, y: 1 } },
      }) as never,
      res,
    );

    expect(persistStroke).toHaveBeenNthCalledWith(
      1,
      'main',
      BrushStrokeModel,
      { type: 'Brush', color: '#000', width: 1, coordinates: [] },
      res,
    );
    expect(persistStroke).toHaveBeenCalledTimes(6);
  });
});
