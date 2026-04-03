import mongoose from 'mongoose';

const postVoteSchema = new mongoose.Schema({
  postId: {
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

postVoteSchema.index({ postId: 1, author: 1 }, { unique: true });

export default mongoose.model('PostVote', postVoteSchema);
