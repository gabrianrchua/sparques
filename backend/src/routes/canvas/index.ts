import express from 'express';
import { getCanvases } from './get-canvases';
import { validateRequest } from '../../middleware/validate';
import { CanvasNameOnlyParams } from '../../schemas/canvas';
import { getCanvas } from './get-canvas';
import { addStroke } from './add-stroke';
import { requireAuth } from '../../middleware/require-auth';

const router = express.Router();

// @route   GET /api/canvas/
// @desc    Get list of the names of all canvases
router.get('/', getCanvases);

// @route   GET /api/canvas/:canvas
// @desc    Get all strokes and base image for canvas
router.get(
  '/:canvas',
  validateRequest(CanvasNameOnlyParams, 'params'),
  getCanvas,
);

// @route   POST /api/canvas/:canvas
// @desc    Add a stroke to a canvas
router.post(
  '/:canvas',
  requireAuth,
  validateRequest(CanvasNameOnlyParams, 'params'),
  // body is validated by the handler addStroke instead of by zod due to
  // complex branching parameters
  addStroke,
);

export default router;
