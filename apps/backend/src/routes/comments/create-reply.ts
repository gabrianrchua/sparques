import { Request, Response } from 'express';
import Comment from '../../models/Comment.js';
import Post from '../../models/Post.js';

export const createReply = async (req: Request, res: Response) => {
  const { content } = req.body;

  try {
    const parentComment = await Comment.findById(req.params.id);
    if (!parentComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const newComment = new Comment({
      postId: parentComment.postId,
      parentId: parentComment._id,
      rootId: parentComment.rootId,
      author: res.locals.username,
      content,
      depth: parentComment.depth + 1,
      path: '',
    });
    newComment.path = `${parentComment.path}/${newComment._id.toString()}`;

    const savedComment = await newComment.save();
    await Promise.all([
      Comment.findByIdAndUpdate(
        parentComment._id,
        { $inc: { replyCount: 1 } },
        { new: true, runValidators: true },
      ),
      Post.findByIdAndUpdate(
        parentComment.postId,
        { $inc: { numComments: 1 } },
        { new: true, runValidators: true },
      ),
    ]);

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
