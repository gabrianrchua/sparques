import mongoose from 'mongoose';

const commentVoteSchema = new mongoose.Schema({
  commentId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  author: {
    type: String,
    requried: true,
  },
  isUpvote: {
    type: Boolean,
    required: true,
  },
});

commentVoteSchema.index({ commentId: 1, author: 1 }, { unique: true });

export default mongoose.model('CommentVote', commentVoteSchema);
