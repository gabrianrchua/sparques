import express from 'express';
import { registerUser } from './register-user.js';
import { validateRequest } from '../../middleware/validate.js';
import { LogInBody, RegisterUserBody } from '../../schemas/auth.js';
import { logIn } from './log-in.js';
import { checkToken } from './check-token.js';
import { requireAuth } from '../../middleware/require-auth.js';

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

// @route   GET /api/auth/validate
// @desc    Check if user's token is still valid
router.get('/checkToken', requireAuth, checkToken);

export default router;
