import { Request, Response } from 'express';
import Comment from '../../models/Comment.js';
import { listComments } from './comment-listing.js';

export const getReplies = async (req: Request, res: Response) => {
  try {
    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comments = await listComments({
      match: { parentId: parentComment._id },
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
