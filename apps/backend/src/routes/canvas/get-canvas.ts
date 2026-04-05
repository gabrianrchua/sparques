import { Request } from 'express';
import fetchCanvas from '../../canvas/fetch-canvas.js';
import type { NoAuthResponse } from '../../types/locals.js';

export const getCanvas = async (req: Request, res: NoAuthResponse) => {
  const canvas = req.params.canvas;

  try {
    const fetchedCanvas = await fetchCanvas(canvas);
    res.json(fetchedCanvas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
