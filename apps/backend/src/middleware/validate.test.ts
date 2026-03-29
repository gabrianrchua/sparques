import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';
import type { NextFunction, Request, Response } from 'express';

import { validateRequest } from './validate.js';

describe('validateRequest', () => {
  it('parses the target payload and calls next on success', () => {
    const schema = z.object({
      username: z.string().trim().min(1),
    });
    const middleware = validateRequest(schema, 'body');
    const next = vi.fn<NextFunction>();
    const res = {
      status: vi.fn(),
      json: vi.fn(),
    } as unknown as Response;
    const req = {
      body: {
        username: '  alice  ',
      },
    } as Request;

    middleware(req, res, next);

    expect(req.body).toEqual({ username: 'alice' });
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('returns a 400 response when validation fails', () => {
    const schema = z.object({
      username: z.string().min(3),
    });
    const middleware = validateRequest(schema, 'body');
    const json = vi.fn();
    const status = vi.fn(() => ({ json }));
    const next = vi.fn<NextFunction>();
    const req = {
      body: {
        username: 'ab',
      },
    } as Request;
    const res = {
      status,
    } as unknown as Response;

    middleware(req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: 'Input validation error in body',
      error: expect.any(Array),
    });
    expect(next).not.toHaveBeenCalled();
  });
});
