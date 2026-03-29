import { beforeEach, describe, expect, it, vi } from 'vitest';

const app = {
  get: vi.fn(),
  listen: vi.fn(),
  use: vi.fn(),
};

const express = vi.fn(() => app);
const json = vi.fn(() => 'json-middleware');
const morgan = vi.fn(() => 'morgan-middleware');
const cookieParser = vi.fn(() => 'cookie-middleware');
const cors = vi.fn(() => 'cors-middleware');
const connectDB = vi.fn(() => Promise.resolve());
const seedDBData = vi.fn();

vi.mock('express', () => ({
  default: express,
}));

vi.mock('body-parser', () => ({
  default: {
    json,
  },
}));

vi.mock('morgan', () => ({
  default: morgan,
}));

vi.mock('cookie-parser', () => ({
  default: cookieParser,
}));

vi.mock('cors', () => ({
  default: cors,
}));

vi.mock('./config/db.js', () => ({
  connectDB,
  seedDBData,
}));

vi.mock('./config/env.js', () => ({
  PORT: 8080,
}));

vi.mock('./routes/posts/index.js', () => ({
  default: 'posts-router',
}));

vi.mock('./routes/auth/index.js', () => ({
  default: 'auth-router',
}));

vi.mock('./routes/communities/index.js', () => ({
  default: 'communities-router',
}));

vi.mock('./routes/canvas/index.js', () => ({
  default: 'canvas-router',
}));

describe('server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('bootstraps middleware, routes, and database startup', async () => {
    await import('./server.js');
    await Promise.resolve();

    expect(express).toHaveBeenCalledOnce();
    expect(app.listen).toHaveBeenCalledWith(8080, expect.any(Function));
    expect(json).toHaveBeenCalledWith({ limit: '2mb' });
    expect(morgan).toHaveBeenCalledWith('combined');
    expect(cookieParser).toHaveBeenCalledOnce();
    expect(cors).toHaveBeenCalledWith({
      origin: 'http://localhost:3000',
      credentials: true,
    });
    expect(app.get).toHaveBeenCalledWith('/', expect.any(Function));
    expect(app.use).toHaveBeenCalledWith('/api/posts', 'posts-router');
    expect(app.use).toHaveBeenCalledWith('/api/auth', 'auth-router');
    expect(app.use).toHaveBeenCalledWith(
      '/api/community',
      'communities-router',
    );
    expect(app.use).toHaveBeenCalledWith('/api/canvas', 'canvas-router');
    expect(connectDB).toHaveBeenCalledOnce();
    expect(seedDBData).toHaveBeenCalledOnce();
  });
});
