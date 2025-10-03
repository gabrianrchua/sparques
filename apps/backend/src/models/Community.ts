import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  mime: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const communitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  bannerImage: {
    type: imageSchema,
  },
  iconImage: {
    type: imageSchema,
  },
});

export default mongoose.model('Community', communitySchema);
