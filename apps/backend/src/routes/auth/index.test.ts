import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = {
  get: vi.fn(),
  post: vi.fn(),
};
const Router = vi.fn(() => router);

const registerUser = vi.fn();
const logIn = vi.fn();
const checkToken = vi.fn();
const requireAuth = vi.fn();

const validateRequest = vi.fn((schema, target) => ({ schema, target }));

const RegisterUserBody = { name: 'register' };
const LogInBody = { name: 'login' };

vi.mock('express', () => ({
  default: {
    Router,
  },
}));

vi.mock('./register-user.js', () => ({
  registerUser,
}));

vi.mock('./log-in.js', () => ({
  logIn,
}));

vi.mock('./check-token.js', () => ({
  checkToken,
}));

vi.mock('../../middleware/validate.js', () => ({
  validateRequest,
}));

vi.mock('../../middleware/require-auth.js', () => ({
  requireAuth,
}));

vi.mock('../../schemas/auth.js', () => ({
  RegisterUserBody,
  LogInBody,
}));

describe('routes/auth/index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers the auth routes with the expected middleware order', async () => {
    await import('./index.js');

    expect(Router).toHaveBeenCalledOnce();
    expect(router.post).toHaveBeenNthCalledWith(
      1,
      '/register',
      { schema: RegisterUserBody, target: 'body' },
      registerUser,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      2,
      '/',
      { schema: LogInBody, target: 'body' },
      logIn,
    );
    expect(router.get).toHaveBeenCalledWith(
      '/checkToken',
      requireAuth,
      checkToken,
    );
  });
});
