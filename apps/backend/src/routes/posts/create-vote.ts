import { Request, Response } from 'express';
import Post from '../../models/Post.js';
import Vote from '../../models/Vote.js';

export const createVote = async (req: Request, res: Response) => {
  const { isUpvote } = req.body;

  try {
    const vote = await Vote.findOne({
      postId: req.params.id,
      author: res.locals.username,
    });
    if (vote) {
      // change vote
      // update counters
      if (vote.isUpvote && !isUpvote) {
        // upvote --> downvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: -1, numDownvotes: 1 } },
          { new: true, runValidators: true },
        );
        if (!post) res.status(404).json({ message: 'Post not found' });

        // update vote
        const newVote = await Vote.findByIdAndUpdate(
          vote._id,
          { isUpvote },
          { new: true, runValidators: true },
        );
        return res.json(newVote);
      } else if (!vote.isUpvote && isUpvote) {
        // downvote --> upvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: 1, numDownvotes: -1 } },
          { new: true, runValidators: true },
        );
        if (!post) res.status(404).json({ message: 'Post not found' });

        // update vote
        const newVote = await Vote.findByIdAndUpdate(
          vote._id,
          { isUpvote },
          { new: true, runValidators: true },
        );
        return res.json(newVote);
      } else if (vote.isUpvote && isUpvote) {
        // remove upvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: -1 } },
          { new: true, runValidators: true },
        );
        if (!post) res.status(404).json({ message: 'Post not found' });

        // delete vote
        const deletedVote = await Vote.findByIdAndDelete(vote._id);
        return res.json(deletedVote);
      } else {
        // remove downvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numDownvotes: -1 } },
          { new: true, runValidators: true },
        );
        if (!post) res.status(404).json({ message: 'Post not found' });

        // delete vote
        const deletedVote = await Vote.findByIdAndDelete(vote._id);
        return res.json(deletedVote);
      }
    } else {
      // add vote
      // update counters
      const edit = isUpvote ? { numUpvotes: 1 } : { numDownvotes: 1 };
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: edit },
        { new: true, runValidators: true },
      );
      if (!post) res.status(404).json({ message: 'Post not found' });
      // create vote
      const newVote = new Vote({
        postId: req.params.id,
        author: res.locals.username,
        isUpvote,
      });
      const savedVote = await newVote.save();
      res.status(201).json(savedVote);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};
