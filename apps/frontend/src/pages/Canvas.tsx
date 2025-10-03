import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import NetworkService from '../services/Network';
import {
  AnyStroke,
  BrushStroke,
  CanvasDetails,
  CircleStroke,
  FillStroke,
  PolygonStroke,
  RectangleStroke,
  TextStroke,
} from '@sparques/types';
import { Skeleton } from '@mui/material';
import {
  brush,
  circle,
  rectangle,
  polygon,
  text,
  fill,
} from '@sparques/sparques-canvas';
import { CanvasRenderingContext2D, Image } from 'canvas';

const drawStrokes = async (
  ctx: CanvasRenderingContext2D,
  strokes: AnyStroke[],
  baseImage: string
) => {
  if (!ctx || !strokes) throw new Error('Invalid arguments');

  const img = new Image();
  img.src = `data:image/png;base64,${baseImage}`;
  img.onload = () => {
    ctx.drawImage(img as Image, 0, 0, 512, 512);

    // draw the rest of the strokes
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
              stroke
            );
        }
      } catch (err) {
        console.error(
          `Error drawing stroke of type "${stroke.type}"`,
          stroke,
          err
        );
      }
    }
  };
};

const Canvas = () => {
  const location = useLocation();
  const { community } = useParams();
  const [canvasDetails, setCanvasDetails] = useState<CanvasDetails | undefined>(
    undefined
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : undefined;

    if (!canvasDetails || !ctx) return;

    // HACK: to get types to "match"
    drawStrokes(
      ctx as unknown as CanvasRenderingContext2D,
      canvasDetails.strokes,
      canvasDetails.baseImage
    );
  }, [canvasDetails]);

  useEffect(() => {
    // only if this page became active
    if (!community) return;

    if (location.pathname === '/c/' + community + '/canvas') {
      NetworkService.getCanvas(community).then((canvasDetails) =>
        setCanvasDetails(canvasDetails)
      );
    }
  }, [location.pathname]);

  return canvasDetails ? (
    <>
      <h3>{`c/${community} Canvas`}</h3>
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        style={{ backgroundColor: 'white' }}
      />
    </>
  ) : (
    <Skeleton variant='rounded' height={800} />
  );
};

export default Canvas;
