import Post from '../../models/Post.js';
import Comment from '../../models/Comment.js';
import { Request, Response } from 'express';

export const createComment = async (req: Request, res: Response) => {
  const { content, parentId } = req.body;

  try {
    // update counter
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { numComments: 1 } },
      { new: true, runValidators: true },
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = parentId
      ? new Comment({
          postId: req.params.id,
          author: res.locals.username,
          content,
          parentId,
        })
      : new Comment({
          postId: req.params.id,
          author: res.locals.username,
          content,
        });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
