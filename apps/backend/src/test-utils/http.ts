import type { NextFunction, Request, Response } from 'express';
import { vi } from 'vitest';

export const createRequest = <T extends Partial<Request>>(overrides?: T) =>
  ({
    body: {},
    params: {},
    query: {},
    cookies: {},
    get: vi.fn(),
    ...overrides,
  }) as Request;

export const createResponse = () => {
  const res = {
    locals: {},
    status: vi.fn(),
    json: vi.fn(),
    cookie: vi.fn(),
  } as unknown as Response;

  vi.mocked(res.status).mockReturnValue(res);
  vi.mocked(res.json).mockReturnValue(res);
  vi.mocked(res.cookie).mockReturnValue(res);

  return res;
};

export const createNext = () => vi.fn() as unknown as NextFunction;
