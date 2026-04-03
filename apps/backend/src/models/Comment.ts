import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  rootId: {
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
  depth: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  replyCount: {
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

commentSchema.index({ postId: 1, parentId: 1, numUpvotes: -1, numDownvotes: 1, _id: -1 });
commentSchema.index({ rootId: 1, path: 1 });
commentSchema.index({ postId: 1, creationDate: -1 });

export default mongoose.model('Comment', commentSchema);
