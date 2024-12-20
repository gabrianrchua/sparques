const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  post_id: {
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

module.exports = mongoose.model('Vote', voteSchema);