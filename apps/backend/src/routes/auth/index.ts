import express from 'express';
import { registerUser } from './register-user.js';
import { validateRequest } from '../../middleware/validate.js';
import { LogInBody, RegisterUserBody } from '../../schemas/auth.js';
import { logIn } from './log-in.js';
import { checkToken } from './check-token.js';
import { refreshSession } from './refresh.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post(
  '/register',
  validateRequest(RegisterUserBody, 'body'),
  registerUser,
);

// @route   POST /api/auth
// @desc    Log in as existing user
router.post('/', validateRequest(LogInBody, 'body'), logIn);

// @route   POST /api/auth/refresh
// @desc    Refresh an expired access token using a persisted session
router.post('/refresh', refreshSession);

// @route   GET /api/auth/checkToken
// @desc    Check if the user has an active authenticated session
router.get('/checkToken', checkToken);

export default router;
