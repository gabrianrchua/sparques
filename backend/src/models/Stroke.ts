import mongoose from 'mongoose';

// base schema for all strokes
const strokeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Brush', 'Circle', 'Rectangle', 'Polygon', 'Text', 'Line', 'Fill'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { discriminatorKey: 'type' },
);

// coordinate schema (helper)
const coordinateSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
});

/**
 * discriminator schemas
 * - brush: color, width, list of coordinates
 * - circle: color, width, center, radius,
 * - rectangle: color, width, top left coords, bottom right coords
 * - polygon: color, width, number of sides, center, side length
 * - text: color, font size, top left coordinates, text
 * - fill: color, coordinates
 */

const brushSchema = new mongoose.Schema({
  color: { type: String, required: true },
  width: { type: Number, required: true },
  coordinates: { type: [coordinateSchema], required: true },
});

const circleSchema = new mongoose.Schema({
  color: { type: String, required: true },
  width: { type: Number, required: true },
  center: { type: coordinateSchema, required: true },
  radius: { type: Number, required: true },
});

const rectangleSchema = new mongoose.Schema({
  color: { type: String, required: true },
  width: { type: Number, required: true },
  topLeftCoordinates: { type: coordinateSchema, required: true },
  bottomRightCoordinates: { type: coordinateSchema, required: true },
});

const polygonSchema = new mongoose.Schema({
  color: { type: String, required: true },
  width: { type: Number, required: true },
  numSides: { type: Number, required: true },
  center: { type: coordinateSchema, required: true },
  sideLength: { type: Number, required: true },
});

const textSchema = new mongoose.Schema({
  color: { type: String, required: true },
  fontSize: { type: Number, required: true },
  topLeftCoordindates: { type: coordinateSchema, required: true },
  text: { type: String, required: true },
});

const fillSchema = new mongoose.Schema({
  color: { type: String, required: true },
  coordinates: { type: coordinateSchema, required: true },
});

const Stroke = mongoose.model('Stroke', strokeSchema);
const Brush = Stroke.discriminator('Brush', brushSchema);
const Circle = Stroke.discriminator('Circle', circleSchema);
const Rectangle = Stroke.discriminator('Rectangle', rectangleSchema);
const Polygon = Stroke.discriminator('Polygon', polygonSchema);
const Text = Stroke.discriminator('Text', textSchema);
const Fill = Stroke.discriminator('Fill', fillSchema);

export { Stroke, Brush, Circle, Rectangle, Polygon, Text, Fill, strokeSchema };
