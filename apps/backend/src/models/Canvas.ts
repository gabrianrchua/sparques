import mongoose from 'mongoose';
import { strokeSchema } from './Stroke';

const canvasSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  strokes: { type: [strokeSchema], default: [] },
  baseImage: { type: String, required: true }, // image/png 512x512
});

export default mongoose.model('Canvas', canvasSchema);
