import { Request, Response } from 'express';
import { refreshAuthSession } from '../../auth/session.js';

export const refreshSession = async (req: Request, res: Response) => {
  try {
    const username = await refreshAuthSession(req, res);

    if (!username) {
      return res.status(401).json({ message: 'Refresh session expired' });
    }

    return res.json({ authenticated: true, username });
  } catch (error) {
    console.error('Refresh session error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
