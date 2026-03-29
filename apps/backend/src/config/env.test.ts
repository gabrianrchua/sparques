import { afterEach, describe, expect, it, vi } from 'vitest';

const loadEnvModule = async () => import('./env.js');

describe('config/env', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('uses default values when env vars are absent', async () => {
    vi.unstubAllEnvs();

    const { JWT_SECRET, MONGO_URI, PORT } = await loadEnvModule();

    expect(JWT_SECRET).toBe('mysecretdontuse');
    expect(MONGO_URI).toBe(
      'mongodb://mongoadmin:secret@localhost:27017/sparquesdb?authSource=admin',
    );
    expect(PORT).toBe(8080);
  });

  it('prefers explicit environment variables', async () => {
    vi.stubEnv('JWT_SECRET', 'test-secret');
    vi.stubEnv('MONGO_URI', 'mongodb://example/db');
    vi.stubEnv('PORT', '9999');

    const { JWT_SECRET, MONGO_URI, PORT } = await loadEnvModule();

    expect(JWT_SECRET).toBe('test-secret');
    expect(MONGO_URI).toBe('mongodb://example/db');
    expect(PORT).toBe('9999');
  });
});
