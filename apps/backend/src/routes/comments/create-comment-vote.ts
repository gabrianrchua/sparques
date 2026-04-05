import { Request } from 'express';
import Comment from '../../models/Comment.js';
import CommentVote from '../../models/CommentVote.js';
import type { CreateVoteBody } from '../../schemas/comments.js';
import type { IdOnlyParams } from '../../schemas/mongo.js';
import type { RequiredAuthResponse } from '../../types/locals.js';

export const createCommentVote = async (
  req: Request<IdOnlyParams, unknown, CreateVoteBody, never>,
  res: RequiredAuthResponse,
) => {
  const { isUpvote } = req.body;

  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const vote = await CommentVote.findOne({
      commentId: req.params.id,
      author: res.locals.username,
    });

    if (vote) {
      if (vote.isUpvote && !isUpvote) {
        await Comment.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: -1, numDownvotes: 1 } },
          { new: true, runValidators: true },
        );
        const updatedVote = await CommentVote.findByIdAndUpdate(
          vote._id,
          { isUpvote },
          { new: true, runValidators: true },
        );
        return res.json(updatedVote);
      }

      if (!vote.isUpvote && isUpvote) {
        await Comment.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: 1, numDownvotes: -1 } },
          { new: true, runValidators: true },
        );
        const updatedVote = await CommentVote.findByIdAndUpdate(
          vote._id,
          { isUpvote },
          { new: true, runValidators: true },
        );
        return res.json(updatedVote);
      }

      if (vote.isUpvote) {
        await Comment.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: -1 } },
          { new: true, runValidators: true },
        );
      } else {
        await Comment.findByIdAndUpdate(
          req.params.id,
          { $inc: { numDownvotes: -1 } },
          { new: true, runValidators: true },
        );
      }

      const deletedVote = await CommentVote.findByIdAndDelete(vote._id);
      return res.json(deletedVote);
    }

    await Comment.findByIdAndUpdate(
      req.params.id,
      { $inc: isUpvote ? { numUpvotes: 1 } : { numDownvotes: 1 } },
      { new: true, runValidators: true },
    );

    const newVote = new CommentVote({
      commentId: req.params.id,
      author: res.locals.username,
      isUpvote,
    });
    const savedVote = await newVote.save();
    res.status(201).json(savedVote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
