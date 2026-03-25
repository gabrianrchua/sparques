import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import NetworkService from '../services/Network';
import {
  AnyStroke,
  BrushStroke,
  CanvasDetails,
  CircleStroke,
  Coordinate,
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

  // stroke configuration state for tool options panel
  const [color, setColor] = useState<string>('#000000');
  const [width, setWidth] = useState<number>(5);

  // stroke drawing state for click-to-draw
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [lastPoint, setLastPoint] = useState<Coordinate | null>(null);
  const [brushPoints, setBrushPoints] = useState<Coordinate[]>([]);

  const getCanvasCoordinates = (
    event: React.MouseEvent<HTMLCanvasElement>
  ): Coordinate => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  // handle mouse down - start drawing a stroke (Brush) or set first point for shapes
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedStroke || !community) return;

    const coords = getCanvasCoordinates(event);
    setIsDrawing(true);
    setLastPoint(coords);
    console.log(
      'Mouse down at:',
      coords.x,
      coords.y,
      'for stroke:',
      selectedStroke
    );
  };

  // handle mouse move - update last point for brush strokes and accumulate coordinates
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !selectedStroke || !community) return;

    const coords = getCanvasCoordinates(event);

    // accumulate coordinates for brush stroke
    setBrushPoints((prev) => [...prev, coords]);

    // update last point to track the stroke path
    setLastPoint({
      x: Math.max(0, Math.min(512, coords.x)),
      y: Math.max(0, Math.min(512, coords.y)),
    });
  };

  // handle mouse up - complete the stroke and submit to backend
  const handleMouseUp = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !selectedStroke || !community) return;
    setIsDrawing(false);

    // Clear last point to start fresh next time
    setLastPoint(null);

    // Prepare stroke data based on selected type
    let result: Omit<AnyStroke, 'type'> | null = null;

    switch (selectedStroke) {
      case 'Brush':
        if (brushPoints.length > 0) {
          const brushData: BrushStroke = {
            width,
            color,
            coordinates: brushPoints,
          };
          result = brushData;
        } else {
          // single click for brush = just one point
          const coords = getCanvasCoordinates(event);
          const brushData: BrushStroke = {
            width,
            color,
            coordinates: [coords],
          };
          result = brushData;
        }
        break;
      case 'Circle':
        if (lastPoint) {
          const coords = getCanvasCoordinates(event);
          const circleData: CircleStroke = {
            width,
            color,
            center: { x: lastPoint.x, y: lastPoint.y },
            radius: Math.sqrt(
              Math.pow(coords.x - lastPoint.x, 2) +
                Math.pow(coords.y - lastPoint.y, 2)
            ),
          };
          result = circleData;
        } else {
          const coords = getCanvasCoordinates(event);
          const circleData: CircleStroke = {
            width,
            color,
            center: { x: coords.x, y: coords.y },
            radius: 50, // default radius for single click
          };
          result = circleData;
        }
        break;
      case 'Rectangle':
        if (lastPoint) {
          const endCoords = getCanvasCoordinates(event);
          const rectData: RectangleStroke = {
            width,
            color,
            topLeftCoordinates: {
              x: Math.min(lastPoint.x, endCoords.x),
              y: Math.min(lastPoint.y, endCoords.y),
            },
            bottomRightCoordinates: {
              x: Math.max(lastPoint.x, endCoords.x),
              y: Math.max(lastPoint.y, endCoords.y),
            },
          };
          result = rectData;
        } else {
          const coords = getCanvasCoordinates(event);
          const rectData: RectangleStroke = {
            width,
            color,
            topLeftCoordinates: coords,
            bottomRightCoordinates: coords,
          };
          result = rectData;
        }
        break;
      case 'Polygon': {
        const polygonData: PolygonStroke = {
          width,
          color,
          center: lastPoint
            ? { x: lastPoint.x, y: lastPoint.y }
            : {
                x: getCanvasCoordinates(event).x,
                y: getCanvasCoordinates(event).y,
              },
          sideLength: 50,
          numSides: 4,
        };
        result = polygonData;
        break;
      }
      case 'Text': {
        const textData: TextStroke = {
          color,
          fontSize: 24,
          topLeftCoordinates: {
            x: getCanvasCoordinates(event).x,
            y: getCanvasCoordinates(event).y,
          },
          text: '',
        };
        result = textData;
        break;
      }
      case 'Fill': {
        const fillData: FillStroke = {
          color,
          coordinates: getCanvasCoordinates(event),
        };
        result = fillData;
        break;
      }
    }

    // reset drawing state
    setBrushPoints([]);
    setLastPoint(null);

    // submit to backend if we have valid data
    if (result) {
      await submitStroke({ type: selectedStroke, ...result });
    }
  };

  const submitStroke = async (
    strokeData: Partial<AnyStroke>
  ): Promise<AnyStroke | null> => {
    if (!community) return null;

    try {
      const result = await NetworkService.postStroke(community, strokeData);
      console.log('Stroke submitted successfully:', selectedStroke, result);

      // refresh canvas
      fetchCanvas();

      return result;
    } catch (error) {
      console.error('Error submitting stroke:', error);
      throw error;
    }
  };

  const handleCanvasClick = async (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    // handle click-to-complete for shapes with two-click behavior (Rectangle and Circle)
    if (!isDrawing && selectedStroke) {
      const coords = getCanvasCoordinates(event);

      let result: Omit<AnyStroke, 'type'> | null = null;

      if (selectedStroke === 'Rectangle') {
        // 2-click rectangle: first click sets top-left, second click sets bottom-right
        const rectData: RectangleStroke = {
          width,
          color,
          topLeftCoordinates: coords,
          bottomRightCoordinates: coords,
        };
        result = rectData;
      } else if (selectedStroke === 'Circle') {
        // circle: single click defines center and radius based on last point or default radius
        const circleData: CircleStroke = {
          width,
          color,
          center: { x: coords.x, y: coords.y },
          radius: lastPoint
            ? Math.sqrt(
                Math.pow(coords.x - lastPoint.x, 2) +
                  Math.pow(coords.y - lastPoint.y, 2)
              )
            : 50,
        };
        result = circleData;
      } else {
        return;
      }

      // submit immediately for shapes with click-to-complete
      await submitStroke({ type: selectedStroke, ...result });
    }
  };

  // const handleCanvasHover = (event: React.MouseEvent<HTMLCanvasElement>) => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const rect = canvas.getBoundingClientRect();
  //   // x,y position with the element
  //   const x = event.clientX - rect.left;
  //   const y = event.clientY - rect.top;

  //   // TODO: remove logs and do something with this
  //   console.log(`Hovered at: (${x}, ${y})`);
  // };

  const fetchCanvas = () => {
    if (!community) return;
    NetworkService.getCanvas(community).then((canvasDetails) =>
      setCanvasDetails(canvasDetails)
    );
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
      fetchCanvas();
    }
  }, [location.pathname]);

  return canvasDetails ? (
    <>
      <h3>{`c/${community} Canvas`}</h3>
      <ToolPanel
        selectedStroke={selectedStroke}
        setSelectedStroke={setSelectedStroke}
        color={color}
        setColor={setColor}
        width={width}
        setWidth={setWidth}
      />
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        style={{ backgroundColor: 'white' }}
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  ) : (
    <Skeleton variant='rounded' height={800} />
  );
};

export default Canvas;
