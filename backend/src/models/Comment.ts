import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  author: {
    type: String,
    requried: true,
  },
  content: {
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
  parentId: {
    type: mongoose.Types.ObjectId,
    default: undefined,
  },
});

export default mongoose.model('Comment', commentSchema);
