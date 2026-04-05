import { Request } from 'express';
import Comment from '../../models/Comment.js';
import { listComments } from './comment-listing.js';
import type { CommentListQuery } from '../../schemas/comments.js';
import type { IdOnlyParams } from '../../schemas/mongo.js';
import type { OptionalAuthResponse } from '../../types/locals.js';

export const getReplies = async (
  req: Request<IdOnlyParams, unknown, never, CommentListQuery>,
  res: OptionalAuthResponse,
) => {
  try {
    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const comments = await listComments({
      match: { parentId: parentComment._id },
      cursor: req.query.cursor,
      limit: req.query.limit,
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
