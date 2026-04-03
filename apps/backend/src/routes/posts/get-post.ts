import { Request, Response } from 'express';
import Post from '../../models/Post.js';
import PostVote from '../../models/PostVote.js';

export const getPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // if logged in, get upvote status
    if (res.locals.username) {
      const vote = await PostVote.find({
        postId: req.params.id,
        author: res.locals.username,
      });
      res.json({
        ...post.toObject(),
        votes: vote,
      });
    } else {
      res.json(post);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};
