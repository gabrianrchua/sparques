import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { readAccessToken, refreshAuthSession, verifyAccessToken } from '../../auth/session.js';

export const checkToken = async (req: Request, res: Response) => {
  const accessToken = readAccessToken(req);

  if (accessToken) {
    try {
      const decoded = verifyAccessToken(accessToken);
      return res.json({ authenticated: true, username: decoded.username });
    } catch (error) {
      if (!(error instanceof jwt.JsonWebTokenError)) {
        console.error('Access token verification error:', error);
        return res.status(500).json({ message: 'Server error' });
      }
    }
  }

  try {
    const username = await refreshAuthSession(req, res);

    if (!username) {
      return res.status(401).json({ authenticated: false });
    }

    return res.json({ authenticated: true, username });
  } catch (error) {
    console.error('Refresh session verification error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
