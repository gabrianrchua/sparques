import { Request, Response } from 'express';
import fetchCanvas from '../../canvas/fetch-canvas.js';

export const getCanvas = async (req: Request, res: Response) => {
  const canvas = req.params.canvas;

  try {
    const fetchedCanvas = await fetchCanvas(canvas);
    res.json(fetchedCanvas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
