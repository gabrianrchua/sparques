import mongoose from 'mongoose';
import Post from '../../models/Post.js';
import Comment from '../../models/Comment.js';
import { Request, Response } from 'express';

export const createComment = async (req: Request, res: Response) => {
  const { content } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const commentId = new mongoose.Types.ObjectId();
    const newComment = new Comment({
      _id: commentId,
      postId: req.params.id,
      author: res.locals.username,
      content,
      rootId: commentId,
      depth: 0,
      path: commentId.toString(),
    });
    const savedComment = await newComment.save();
    await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { numComments: 1 } },
      { new: true, runValidators: true },
    );
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
};
