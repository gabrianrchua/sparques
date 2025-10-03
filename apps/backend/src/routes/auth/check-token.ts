import { Request, Response } from 'express';

export const checkToken = (req: Request, res: Response) => {
  res.json({ message: 'Valid token' });
};
