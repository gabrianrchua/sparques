import { beforeEach, describe, expect, it, vi } from 'vitest';

const drawImage = vi.fn();
const getContext = vi.fn(() => ({ drawImage }));
const toDataURL = vi.fn(() => 'data:image/png;base64,rendered-image');
const createCanvas = vi.fn(() => ({
  getContext,
  toDataURL,
}));
const loadImage = vi.fn(async () => ({ src: 'image' }));

const brush = vi.fn();
const circle = vi.fn();
const rectangle = vi.fn();
const polygon = vi.fn();
const text = vi.fn();
const fill = vi.fn();

vi.mock('canvas', () => ({
  createCanvas,
  loadImage,
}));

vi.mock('@sparques/sparques-canvas', () => ({
  brush,
  circle,
  rectangle,
  polygon,
  text,
  fill,
}));

describe('canvas/render', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads the base image and renders supported strokes', async () => {
    const { render } = await import('./canvas.js');
    const strokes = [
      { type: 'Brush', color: '#000', width: 2, coordinates: [] },
      { type: 'Circle', color: '#111', width: 3, center: { x: 1, y: 2 }, radius: 4 },
      {
        type: 'Rectangle',
        color: '#222',
        width: 4,
        topLeftCoordinates: { x: 0, y: 0 },
        bottomRightCoordinates: { x: 5, y: 5 },
      },
      {
        type: 'Polygon',
        color: '#333',
        width: 5,
        numSides: 6,
        center: { x: 2, y: 2 },
        sideLength: 8,
      },
      {
        type: 'Text',
        color: '#444',
        fontSize: 16,
        topLeftCoordinates: { x: 3, y: 3 },
        text: 'hi',
      },
      { type: 'Fill', color: '#555', coordinates: { x: 4, y: 4 } },
    ];

    const result = await render(strokes, 'base-image');

    expect(loadImage).toHaveBeenCalledWith('data:image/png;base64,base-image');
    expect(drawImage).toHaveBeenCalledOnce();
    expect(brush).toHaveBeenCalledOnce();
    expect(circle).toHaveBeenCalledOnce();
    expect(rectangle).toHaveBeenCalledOnce();
    expect(polygon).toHaveBeenCalledOnce();
    expect(text).toHaveBeenCalledOnce();
    expect(fill).toHaveBeenCalledOnce();
    expect(result).toBe('rendered-image');
  });

  it('throws on invalid arguments before attempting to render', async () => {
    const { render } = await import('./canvas.js');
    getContext.mockReturnValueOnce(undefined);

    await expect(render([], 'base-image')).rejects.toThrow('Invalid arguments');
  });
});
