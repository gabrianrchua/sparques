import {
  loadImage,
  createCanvas,
  Image,
  CanvasRenderingContext2D,
} from 'canvas';
import {
  brush,
  circle,
  rectangle,
  polygon,
  text,
  fill,
} from '../../../sparques-canvas/draw';
import {
  AnyStroke,
  BrushStroke,
  CircleStroke,
  FillStroke,
  PolygonStroke,
  RectangleStroke,
  TextStroke,
} from '../../../sparques-canvas/types';

/**
 * Clear canvas, apply base image, and draw all strokes
 * @param ctx Canvas context 2d
 * @param strokes List of stroke objects to draw onto the canvas
 * @param baseImage base64 encoded `image/png`
 */
const drawStrokes = async (
  ctx: CanvasRenderingContext2D,
  strokes: (AnyStroke & { type: string })[],
  baseImage: string,
) => {
  if (!ctx || !strokes) throw new Error('Invalid arguments');

  const img: Image = await loadImage(`data:image/png;base64,${baseImage}`);

  ctx.drawImage(img, 0, 0, 512, 512);

  for (let i = 0; i < strokes.length; i++) {
    const stroke = strokes[i];

    try {
      switch (stroke.type) {
        case 'Brush':
          brush(ctx, stroke as BrushStroke);
          break;
        case 'Circle':
          circle(ctx, stroke as CircleStroke);
          break;
        case 'Rectangle':
          rectangle(ctx, stroke as RectangleStroke);
          break;
        case 'Polygon':
          polygon(ctx, stroke as PolygonStroke);
          break;
        case 'Text':
          text(ctx, stroke as TextStroke);
          break;
        case 'Fill':
          fill(ctx, stroke as FillStroke);
          break;
        default:
          console.error(
            `Invalid drawing stroke of type "${stroke.type}"`,
            stroke,
          );
      }
    } catch (err) {
      console.error(
        `Error drawing stroke of type "${stroke.type}"`,
        stroke,
        err,
      );
    }
  }
};

/**
 * Render out all strokes onto base image, returning new base image
 * @param strokes Array of stroke objects
 * @param baseImage Base64 base image/png
 * @returns Base64 new base image/png
 */
export const render = async (
  strokes: (AnyStroke & { type: string })[],
  baseImage: string,
): Promise<string> => {
  const canvas = createCanvas(512, 512);
  const ctx = canvas.getContext('2d');

  await drawStrokes(ctx, strokes, baseImage);

  return canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
};
