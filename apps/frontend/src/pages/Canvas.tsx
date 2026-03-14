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
  StrokeType,
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
import { CanvasRenderingContext2D, Image as CanvasImage } from 'canvas';
import ToolPanel from '../components/canvas/ToolPanel';

const drawStrokes = async (
  ctx: CanvasRenderingContext2D,
  strokes: AnyStroke[],
  baseImage: string
): Promise<void> => {
  if (!ctx || !strokes) throw new Error('Invalid arguments');

  const img = new Image();
  img.src = `data:image/png;base64,${baseImage}`;
  img.onload = () => {
    // HACK: to get types to "match"
    ctx.drawImage(img as unknown as CanvasImage, 0, 0, 512, 512);

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
  const [selectedStroke, setSelectedStroke] = useState<StrokeType | null>(null);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // x,y position within the element
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // TODO: remove logs and do something with this
    console.log(`Clicked at: (${x}, ${y})`);
  };

  const handleCanvasHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // x,y position with the element
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // TODO: remove logs and do something with this
    console.log(`Hovered at: (${x}, ${y})`);
  };

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
      <ToolPanel
        selectedStroke={selectedStroke}
        setSelectedStroke={setSelectedStroke}
      />
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        style={{ backgroundColor: 'white' }}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasHover}
      />
    </>
  ) : (
    <Skeleton variant='rounded' height={800} />
  );
};

export default Canvas;
