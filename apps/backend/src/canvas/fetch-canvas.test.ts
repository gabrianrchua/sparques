import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createModelMock } from '../test-utils/model.js';

const findCommunity = vi.fn();
const findCanvas = vi.fn();
const saveCanvas = vi.fn();
const Canvas = createModelMock(
  () => ({
    save: saveCanvas,
  }),
  { findOne: findCanvas },
);

vi.mock('../models/Community.js', () => ({
  default: {
    findOne: findCommunity,
  },
}));

vi.mock('../models/Canvas.js', () => ({
  default: Canvas,
}));

describe('fetchCanvas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when the community does not exist', async () => {
    const { default: fetchCanvas } = await import('./fetch-canvas.js');
    findCommunity.mockResolvedValueOnce(null);

    await expect(fetchCanvas('missing')).rejects.toThrow(
      'Community does not exist',
    );
  });

  it('returns an existing canvas when found', async () => {
    const { default: fetchCanvas } = await import('./fetch-canvas.js');
    const existingCanvas = { _id: 'canvas-1', title: 'main' };
    findCommunity.mockResolvedValueOnce({ _id: 'community-1' });
    findCanvas.mockResolvedValueOnce(existingCanvas);

    await expect(fetchCanvas('main')).resolves.toBe(existingCanvas);
    expect(Canvas).not.toHaveBeenCalled();
  });

  it('creates and saves a canvas when none exists yet', async () => {
    const { default: fetchCanvas } = await import('./fetch-canvas.js');
    const savedCanvas = { _id: 'canvas-2', title: 'main' };
    findCommunity.mockResolvedValueOnce({ _id: 'community-1' });
    findCanvas.mockResolvedValueOnce(null);
    saveCanvas.mockResolvedValueOnce(savedCanvas);

    await expect(fetchCanvas('main')).resolves.toBe(savedCanvas);
    expect(Canvas).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'main',
        strokes: [],
      }),
    );
    expect(saveCanvas).toHaveBeenCalledOnce();
  });
});
