import express from 'express';
import { getCanvases } from './get-canvases.js';
import { validateRequest } from '../../middleware/validate.js';
import {
  BrushStrokeBody,
  CanvasNameOnlyParams,
  CircleStrokeBody,
  FillStrokeBody,
  PolygonStrokeBody,
  RectangleStrokeBody,
  TextStrokeBody,
} from '../../schemas/canvas.js';
import { getCanvas } from './get-canvas.js';
import { addBrushStroke } from './add-brush.js';
import { addCircleStroke } from './add-circle.js';
import { addFillStroke } from './add-fill.js';
import { addPolygonStroke } from './add-polygon.js';
import { addRectangleStroke } from './add-rectangle.js';
import { addTextStroke } from './add-text.js';
import { requireAuth } from '../../middleware/require-auth.js';

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

// @route   POST /api/canvas/:canvas/brush
// @desc    Add a brush stroke to a canvas
router.post(
  '/:canvas/brush',
  requireAuth,
  validateRequest(CanvasNameOnlyParams, 'params'),
  validateRequest(BrushStrokeBody, 'body'),
  addBrushStroke,
);

// @route   POST /api/canvas/:canvas/circle
// @desc    Add a circle stroke to a canvas
router.post(
  '/:canvas/circle',
  requireAuth,
  validateRequest(CanvasNameOnlyParams, 'params'),
  validateRequest(CircleStrokeBody, 'body'),
  addCircleStroke,
);

// @route   POST /api/canvas/:canvas/rectangle
// @desc    Add a rectangle stroke to a canvas
router.post(
  '/:canvas/rectangle',
  requireAuth,
  validateRequest(CanvasNameOnlyParams, 'params'),
  validateRequest(RectangleStrokeBody, 'body'),
  addRectangleStroke,
);

// @route   POST /api/canvas/:canvas/polygon
// @desc    Add a polygon stroke to a canvas
router.post(
  '/:canvas/polygon',
  requireAuth,
  validateRequest(CanvasNameOnlyParams, 'params'),
  validateRequest(PolygonStrokeBody, 'body'),
  addPolygonStroke,
);

// @route   POST /api/canvas/:canvas/text
// @desc    Add a text stroke to a canvas
router.post(
  '/:canvas/text',
  requireAuth,
  validateRequest(CanvasNameOnlyParams, 'params'),
  validateRequest(TextStrokeBody, 'body'),
  addTextStroke,
);

// @route   POST /api/canvas/:canvas/fill
// @desc    Add a fill stroke to a canvas
router.post(
  '/:canvas/fill',
  requireAuth,
  validateRequest(CanvasNameOnlyParams, 'params'),
  validateRequest(FillStrokeBody, 'body'),
  addFillStroke,
);

export default router;
