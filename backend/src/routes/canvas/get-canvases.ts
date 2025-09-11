import { Request, Response } from 'express';
import Canvas from '../../models/Canvas';

export const getCanvases = async (_: Request, res: Response) => {
  try {
    const titles = await Canvas.find().select('title');
    res.json(titles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
