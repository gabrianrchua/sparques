const mongoose = require('mongoose');
const { strokeSchema } = require('./Stroke');

const canvasSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  strokes: { type: [strokeSchema], default: [] },
  baseImage: { type: String, required: true }, // image/png 512x512
});

module.exports = mongoose.model("Canvas", canvasSchema);