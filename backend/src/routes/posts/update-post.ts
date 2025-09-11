import { Request, Response } from 'express';
import Post from '../../models/Post';

export const updatePost = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author !== res.locals.username)
      return res.status(403).json({
        message: 'User is forbidden to edit a post created by another user ',
      });

    const editedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, editDate: Date.now() },
      { new: true, runValidators: true },
    );
    res.json(editedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};
