import { mongo } from 'mongoose';
import jwt from 'jsonwebtoken';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRequest, createResponse } from '../../test-utils/http.js';
import { createModelMock } from '../../test-utils/model.js';

const findUser = vi.fn();
const saveUser = vi.fn();
const User = createModelMock(
  () => ({
    save: saveUser,
  }),
  { findOne: findUser },
);

vi.mock('../../models/User.js', () => ({
  default: User,
}));

describe('routes/auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checkToken returns a success payload', async () => {
    const { checkToken } = await import('./check-token.js');
    const req = createRequest();
    const res = createResponse();

    checkToken(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: 'Valid token' });
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
    });
    const res = createResponse();
    findUser.mockResolvedValueOnce({
      isCorrectPassword: (
        _password: string,
        callback: (error: Error | null, same?: boolean) => void,
      ) => callback(null, true),
    });
    vi.spyOn(jwt, 'sign').mockReturnValueOnce('signed-token' as never);
    vi.spyOn(jwt, 'decode').mockReturnValueOnce({ exp: 200 } as never);

    await logIn(req, res);

    expect(res.cookie).toHaveBeenCalledWith(
      'token',
      'signed-token',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Sign in successful',
      username: 'alice',
      expireDate: new Date(200000),
    });
  });
});
