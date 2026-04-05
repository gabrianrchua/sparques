import { Request } from 'express';
import Canvas from '../../models/Canvas.js';
import type { NoAuthResponse } from '../../types/locals.js';

export const getCanvases = async (_: Request, res: NoAuthResponse) => {
  try {
    const titles = await Canvas.find().select('title');
    res.json(titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
