import { Request, Response } from 'express';
import Post from '../../models/Post.js';
import Comment from '../../models/Comment.js';
import Vote from '../../models/Vote.js';

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // get comments
    const comments = await Comment.find({ postId: req.params.id }).sort({
      creationDate: 'descending',
    });

    // if logged in, get upvote status
    if (res.locals.username) {
      const vote = await Vote.find({
        postId: req.params.id,
        author: res.locals.username,
      });
      res.json({
        ...post.toObject(),
        comments,
        votes: vote,
      });
    } else {
      res.json({
        ...post.toObject(),
        comments,
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};
