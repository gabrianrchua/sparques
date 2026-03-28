import { Response } from 'express';
import type {
  BrushStroke,
  CircleStroke,
  FillStroke,
  PolygonStroke,
  RectangleStroke,
  TextStroke,
} from '@sparques/types';
import { render } from '../../canvas/canvas.js';
import Canvas from '../../models/Canvas.js';
import fetchCanvas from '../../canvas/fetch-canvas.js';

const MAX_STROKES = 5; // how many strokes before flushing to base image

type StrokeModelConstructor = new (parameters: unknown) => unknown;

export const persistStroke = async (
  canvas: string,
  StrokeModel: StrokeModelConstructor,
  parameters:
    | ({ type: 'Brush' } & BrushStroke)
    | ({ type: 'Circle' } & CircleStroke)
    | ({ type: 'Rectangle' } & RectangleStroke)
    | ({ type: 'Polygon' } & PolygonStroke)
    | ({ type: 'Text' } & TextStroke)
    | ({ type: 'Fill' } & FillStroke),
  res: Response,
) => {
  if (!canvas) return res.status(400).json({ message: 'Invalid canvas name' });

  try {
    let fetchedCanvas;
    try {
      fetchedCanvas = await fetchCanvas(canvas);
    } catch (error) {
      return res.status(404).json({ message: (error as Error).message });
    }

    const newStroke = new StrokeModel(parameters);
    //const savedStroke = await newStroke.save();
    await Canvas.findByIdAndUpdate(fetchedCanvas._id, {
      $push: { strokes: newStroke },
    });
    res.status(201).json(newStroke); // send response now and then flush strokes to base image next if necessary

    if (fetchedCanvas.strokes.length + 1 > MAX_STROKES) {
      try {
        fetchedCanvas = await Canvas.findOne({ title: canvas }); // re-fetch canvas after new stroke
        if (!fetchedCanvas) {
          throw new Error(
            'Fetched canvas was undefined while trying to re-render!',
          );
        }
        const newBaseImage = await render(
          fetchedCanvas.strokes.toObject(),
          fetchedCanvas.baseImage,
        );
        await Canvas.findByIdAndUpdate(fetchedCanvas._id, {
          baseImage: newBaseImage,
          strokes: [],
        });
      } catch (error) {
        console.error(`Error while rendering out canvas "${canvas}"`, error);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
