import { randomBytes, createHash } from 'crypto';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TTL_MINUTES,
  COOKIE_SECURE,
  REFRESH_SESSION_TTL_DAYS,
} from '../config/env.js';
import RefreshSession from '../models/RefreshSession.js';
import type { SparquesJwtPayload } from '../types/sparques-jwt-payload.js';

const ACCESS_COOKIE_NAME = 'access_token';
const REFRESH_COOKIE_NAME = 'refresh_token';

const getAccessTokenExpiryDate = () =>
  new Date(Date.now() + ACCESS_TOKEN_TTL_MINUTES * 60 * 1000);

const getRefreshSessionExpiryDate = () =>
  new Date(Date.now() + REFRESH_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

const getBaseCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: COOKIE_SECURE,
});

export const createAccessToken = (username: string) =>
  jwt.sign({ username }, ACCESS_TOKEN_SECRET, {
    expiresIn: `${ACCESS_TOKEN_TTL_MINUTES}m`,
  });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_TOKEN_SECRET) as SparquesJwtPayload;

export const readAccessToken = (req: Request) => req.cookies[ACCESS_COOKIE_NAME];

export const readRefreshToken = (req: Request) =>
  req.cookies[REFRESH_COOKIE_NAME];

export const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie(ACCESS_COOKIE_NAME, token, {
    ...getBaseCookieOptions(),
    maxAge: ACCESS_TOKEN_TTL_MINUTES * 60 * 1000,
    path: '/',
  });
};

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    ...getBaseCookieOptions(),
    maxAge: REFRESH_SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });
};

const generateRefreshToken = () => randomBytes(48).toString('base64url');

export const hashRefreshToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

export const createRefreshSession = async (
  username: string,
  userAgent?: string,
) => {
  const refreshToken = generateRefreshToken();
  const now = new Date();
  const refreshSession = new RefreshSession({
    username,
    tokenHash: hashRefreshToken(refreshToken),
    expiresAt: getRefreshSessionExpiryDate(),
    lastUsedAt: now,
    userAgent: userAgent || null,
  });

  await refreshSession.save();

  return refreshToken;
};

export const issueAuthCookies = async (
  res: Response,
  username: string,
  userAgent?: string,
) => {
  const accessToken = createAccessToken(username);
  const refreshToken = await createRefreshSession(username, userAgent);

  setAccessTokenCookie(res, accessToken);
  setRefreshTokenCookie(res, refreshToken);
};

export const refreshAuthSession = async (req: Request, res: Response) => {
  const refreshToken = readRefreshToken(req);
  if (!refreshToken) {
    return null;
  }

  const tokenHash = hashRefreshToken(refreshToken);
  const refreshSession = await RefreshSession.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!refreshSession) {
    return null;
  }

  const rotatedRefreshToken = generateRefreshToken();
  const username = refreshSession.username as string;
  refreshSession.tokenHash = hashRefreshToken(rotatedRefreshToken);
  refreshSession.lastUsedAt = new Date();
  refreshSession.expiresAt = getRefreshSessionExpiryDate();
  const userAgent = req.get('user-agent');
  if (userAgent) {
    refreshSession.userAgent = userAgent;
  }
  await refreshSession.save();

  setAccessTokenCookie(res, createAccessToken(username));
  setRefreshTokenCookie(res, rotatedRefreshToken);

  return username;
};

export const authCookieNames = {
  access: ACCESS_COOKIE_NAME,
  refresh: REFRESH_COOKIE_NAME,
};

export const authExpiries = {
  access: getAccessTokenExpiryDate,
  refresh: getRefreshSessionExpiryDate,
};
