import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
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

export default mongoose.model('Vote', voteSchema);
