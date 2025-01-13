const mongoose = require('mongoose');

/**
 * base schema for all strokes
 * - brush: color, width, list of coordinates
 * - circle: color, width, center, radius,
 * - rectangle: color, width, top left coords, bottom right coords
 * - polygon: color, width, number of sides, center, side length
 * - text: color, font size, top left coordinates, text
 * - fill: color, coordinates
*/
const strokeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Brush", "Circle", "Rectangle", "Polygon", "Text", "Line", "Fill"],
    required: true,
  }
}, { discriminatorKey: "type" });

const brushSchema = new mongoose.Schema({
  color: { type: String, required: true },
  width: { type: Number, required: true },
  coordinates: [{ x: Number, y: Number }],
});

const circleSchema = new mongoose.Schema({
  color: { type: String, required: true },
  width: { type: Number, required: true },
  center: { x: Number, y: Number },
  radius: { type: Number, required: true },
});

const rectangleSchema = new mongoose.Schema({
  color: { type: String, required: true },
  width: { type: Number, required: true },
  topLeftCoordinates: { x: Number, y: Number },
  bottomRightCoordinates: { x: Number, y: Number },
});

const polygonSchema = new mongoose.Schema({
  color: { type: String, required: true },
  width: { type: Number, required: true },
  numSides: { type: Number, required: true },
  center: { x: Number, y: Number },
  sideLength: { type: Number, required: true },
});

const textSchema = new mongoose.Schema({
  color: { type: String, required: true },
  fontSize: { type: Number, required: true },
  topLeftCoordindates: { x: Number, y: Number },
  text: { type: String, required: true },
});

const fillSchema = new mongoose.Schema({
  color: { type: String, required: true },
  coordinates: { x: Number, y: Number },
});

const Stroke = mongoose.model("Stroke", strokeSchema);
const Brush = Stroke.discriminator("Brush", brushSchema);
const Circle = Stroke.discriminator("Circle", circleSchema);
const Rectangle = Stroke.discriminator("Rectangle", rectangleSchema);
const Polygon = Stroke.discriminator("Polygon", polygonSchema);
const Text = Stroke.discriminator("Text", textSchema);
const Fill = Stroke.discriminator("Fill", fillSchema);

module.exports = { Stroke, Brush, Circle, Rectangle, Polygon, Text, Fill, strokeSchema }