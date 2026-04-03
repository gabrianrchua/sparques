import { Request, Response } from 'express';
import Post from '../../models/Post.js';
import { listComments } from '../comments/comment-listing.js';

export const getPostComments = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comments = await listComments({
      match: { postId: post._id, parentId: { $exists: false } },
      cursor:
        typeof req.query.cursor === 'string' ? req.query.cursor : undefined,
      limit:
        typeof req.query.limit === 'number' ? req.query.limit : undefined,
      username: res.locals.username,
    });

    res.json(comments);
  } catch (error) {
    if (error instanceof Error && error.message === 'Invalid cursor') {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: 'Server error', error });
  }
};
