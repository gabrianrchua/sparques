import { Request, Response } from 'express';
import Canvas from '../../models/Canvas';

export const getCanvas = async (req: Request, res: Response) => {
  const canvas = req.params.canvas;

  try {
    const fetchedCanvas = await Canvas.findOne({ title: canvas });
    if (!fetchedCanvas)
      return res.status(404).json({ message: 'Canvas not found' });
    res.json(fetchedCanvas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
