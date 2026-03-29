import { beforeEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';

import { createNext, createRequest, createResponse } from '../test-utils/http.js';
import { optionalAuth } from './optional-auth.js';

describe('optionalAuth', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('continues without decoding when no token is present', () => {
    const req = createRequest();
    const res = createResponse();
    const next = createNext();
    const verifySpy = vi.spyOn(jwt, 'verify');

    optionalAuth(req, res, next);

    expect(verifySpy).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledOnce();
  });

  it('stores the username when token verification succeeds', () => {
    const req = createRequest({ cookies: { access_token: 'valid-token' } });
    const res = createResponse();
    const next = createNext();
    vi.spyOn(jwt, 'verify').mockReturnValueOnce({ username: 'alice' } as never);

    optionalAuth(req, res, next);

    expect(res.locals.username).toBe('alice');
    expect(next).toHaveBeenCalledOnce();
  });

  it('falls through when token verification throws', () => {
    const req = createRequest({ cookies: { access_token: 'bad-token' } });
    const res = createResponse();
    const next = createNext();
    vi.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('bad token');
    });

    optionalAuth(req, res, next);

    expect(res.locals.username).toBeUndefined();
    expect(next).toHaveBeenCalledOnce();
  });
});
