const mongoose = require('mongoose');
const { strokeSchema } = require('./Stroke');

const canvasSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  strokes: { type: [strokeSchema], default: [] },
  baseImage: { type: String, required: true }, // image/bmp 512x512 8-bit RGB color ~= 786 kB
});

module.exports = mongoose.model("Canvas", canvasSchema);