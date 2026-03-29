import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';

import { createNext, createRequest, createResponse } from '../test-utils/http.js';
import { requireAuth } from './require-auth.js';

describe('requireAuth', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 when no token is provided', () => {
    const req = createRequest();
    const res = createResponse();
    const next = createNext();

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Unauthorized: Log in first, no token provided',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('stores the username and calls next for a valid token', () => {
    const req = createRequest({ cookies: { access_token: 'valid-token' } });
    const res = createResponse();
    const next = createNext();
    vi.spyOn(jwt, 'verify').mockReturnValueOnce({ username: 'alice' } as never);

    requireAuth(req, res, next);

    expect(res.locals.username).toBe('alice');
    expect(next).toHaveBeenCalledOnce();
  });

  it('returns 401 when the token is expired', () => {
    const req = createRequest({ cookies: { access_token: 'expired' } });
    const res = createResponse();
    const next = createNext();
    vi.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new jwt.TokenExpiredError('expired', new Date());
    });

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is invalid', () => {
    const req = createRequest({ cookies: { access_token: 'invalid' } });
    const res = createResponse();
    const next = createNext();
    vi.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new jwt.JsonWebTokenError('invalid');
    });

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 500 on unexpected verification errors', () => {
    const req = createRequest({ cookies: { access_token: 'boom' } });
    const res = createResponse();
    const next = createNext();
    vi.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('boom');
    });

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal server error during token verification',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
