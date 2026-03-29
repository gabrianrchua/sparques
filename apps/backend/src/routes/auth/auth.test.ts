import type { Request } from 'express';
import { mongo } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRequest, createResponse } from '../../test-utils/http.js';
import { createModelMock } from '../../test-utils/model.js';

const findUser = vi.fn();
const saveUser = vi.fn();
const issueAuthCookies = vi.fn();
const readAccessToken = vi.fn();
const verifyAccessToken = vi.fn();
const refreshAuthSession = vi.fn();
const User = createModelMock(
  () => ({
    save: saveUser,
  }),
  { findOne: findUser },
);

vi.mock('../../models/User.js', () => ({
  default: User,
}));

vi.mock('../../auth/session.js', () => ({
  issueAuthCookies,
  readAccessToken,
  verifyAccessToken,
  refreshAuthSession,
}));

describe('routes/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checkToken returns the active username when the access token is valid', async () => {
    const { checkToken } = await import('./check-token.js');
    const req = createRequest();
    const res = createResponse();
    readAccessToken.mockReturnValueOnce('access-token');
    verifyAccessToken.mockReturnValueOnce({ username: 'alice' });

    await checkToken(req, res);

    expect(res.json).toHaveBeenCalledWith({
      authenticated: true,
      username: 'alice',
    });
  });

  it('checkToken refreshes the session when the access token is missing', async () => {
    const { checkToken } = await import('./check-token.js');
    const req = createRequest();
    const res = createResponse();
    readAccessToken.mockReturnValueOnce(undefined);
    refreshAuthSession.mockResolvedValueOnce('alice');

    await checkToken(req, res);

    expect(refreshAuthSession).toHaveBeenCalledWith(req, res);
    expect(res.json).toHaveBeenCalledWith({
      authenticated: true,
      username: 'alice',
    });
  });

  it('checkToken returns 401 when neither access nor refresh auth succeeds', async () => {
    const { checkToken } = await import('./check-token.js');
    const req = createRequest();
    const res = createResponse();
    readAccessToken.mockReturnValueOnce(undefined);
    refreshAuthSession.mockResolvedValueOnce(null);

    await checkToken(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ authenticated: false });
  });

  it('registerUser persists a new user', async () => {
    const { registerUser } = await import('./register-user.js');
    const req = createRequest({
      body: { username: 'alice', password: 'secret' },
    });
    const res = createResponse();
    saveUser.mockResolvedValueOnce(undefined);

    await registerUser(req, res);

    expect(User).toHaveBeenCalledWith({
      username: 'alice',
      password: 'secret',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Register success' });
  });

  it('registerUser returns 409 for duplicate usernames', async () => {
    const { registerUser } = await import('./register-user.js');
    const req = createRequest({
      body: { username: 'alice', password: 'secret' },
    });
    const res = createResponse();
    const error = new mongo.MongoError('duplicate');
    error.code = 11000;
    saveUser.mockRejectedValueOnce(error);

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('logIn returns 400 when credentials are missing', async () => {
    const { logIn } = await import('./log-in.js');
    const req = createRequest({ body: { username: 'alice' } });
    const res = createResponse();

    await logIn(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Missing one or more of required fields: 'username', 'password'",
    });
  });

  it('logIn returns 401 when the user does not exist', async () => {
    const { logIn } = await import('./log-in.js');
    const req = createRequest({
      body: { username: 'alice', password: 'secret' },
    });
    const res = createResponse();
    findUser.mockResolvedValueOnce(null);

    await logIn(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Incorrect email or password',
    });
  });

  it('logIn issues a cookie and response payload on success', async () => {
    const { logIn } = await import('./log-in.js');
    const req = createRequest({
      body: { username: 'alice', password: 'secret' },
      get: vi.fn((name: string) =>
        name === 'set-cookie' ? undefined : 'vitest-agent',
      ) as Request['get'],
    });
    const res = createResponse();
    findUser.mockResolvedValueOnce({
      isCorrectPassword: (
        _password: string,
        callback: (error: Error | null, same?: boolean) => void,
      ) => callback(null, true),
    });
    issueAuthCookies.mockResolvedValueOnce(undefined);

    await logIn(req, res);

    expect(issueAuthCookies).toHaveBeenCalledWith(
      res,
      'alice',
      'vitest-agent',
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sign in successful',
      username: 'alice',
      authenticated: true,
    });
  });

  it('refreshSession returns the refreshed authenticated user', async () => {
    const { refreshSession } = await import('./refresh.js');
    const req = createRequest();
    const res = createResponse();
    refreshAuthSession.mockResolvedValueOnce('alice');

    await refreshSession(req, res);

    expect(res.json).toHaveBeenCalledWith({
      authenticated: true,
      username: 'alice',
    });
  });

  it('refreshSession returns 401 when the refresh session is invalid', async () => {
    const { refreshSession } = await import('./refresh.js');
    const req = createRequest();
    const res = createResponse();
    refreshAuthSession.mockResolvedValueOnce(null);

    await refreshSession(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Refresh session expired',
    });
  });
});
