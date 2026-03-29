import { afterEach, describe, expect, it, vi } from 'vitest';

const loadEnvModule = async () => import('./env.js');

describe('config/env', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses default values when env vars are absent', async () => {
    vi.unstubAllEnvs();

    const {
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_TTL_MINUTES,
      REFRESH_SESSION_TTL_DAYS,
      COOKIE_SECURE,
      MONGO_URI,
      PORT,
    } = await loadEnvModule();

    expect(ACCESS_TOKEN_SECRET).toBe('mysecretdontuse');
    expect(ACCESS_TOKEN_TTL_MINUTES).toBe(15);
    expect(REFRESH_SESSION_TTL_DAYS).toBe(90);
    expect(COOKIE_SECURE).toBe(false);
    expect(MONGO_URI).toBe(
      'mongodb://mongoadmin:secret@localhost:27017/sparquesdb?authSource=admin',
    );
    expect(PORT).toBe(8080);
  });

  it('prefers explicit environment variables', async () => {
    vi.stubEnv('ACCESS_TOKEN_SECRET', 'test-secret');
    vi.stubEnv('ACCESS_TOKEN_TTL_MINUTES', '5');
    vi.stubEnv('REFRESH_SESSION_TTL_DAYS', '30');
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('MONGO_URI', 'mongodb://example/db');
    vi.stubEnv('PORT', '9999');

    const {
      ACCESS_TOKEN_SECRET,
      ACCESS_TOKEN_TTL_MINUTES,
      REFRESH_SESSION_TTL_DAYS,
      COOKIE_SECURE,
      MONGO_URI,
      PORT,
    } = await loadEnvModule();

    expect(ACCESS_TOKEN_SECRET).toBe('test-secret');
    expect(ACCESS_TOKEN_TTL_MINUTES).toBe(5);
    expect(REFRESH_SESSION_TTL_DAYS).toBe(30);
    expect(COOKIE_SECURE).toBe(true);
    expect(MONGO_URI).toBe('mongodb://example/db');
    expect(PORT).toBe('9999');
  });
});
