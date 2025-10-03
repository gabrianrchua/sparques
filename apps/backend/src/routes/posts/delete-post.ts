import { Request, Response } from 'express';
import Post from '../../models/Post';

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author !== res.locals.username)
      return res.status(403).json({
        message: 'User is forbidden to delete a post created by another user ',
      });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};
