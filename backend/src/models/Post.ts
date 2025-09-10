import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  community: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  editDate: {
    type: Date,
    default: Date.now,
  },
  numComments: {
    type: Number,
    default: 0,
  },
  numUpvotes: {
    type: Number,
    default: 0,
  },
  numDownvotes: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Post', postSchema);
