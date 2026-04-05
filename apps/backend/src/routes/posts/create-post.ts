import Post from '../../models/Post.js';
import { Request } from 'express';
import type { CreatePostBody } from '../../schemas/posts.js';
import type { RequiredAuthResponse } from '../../types/locals.js';

export const createPost = async (
  req: Request<never, unknown, CreatePostBody, never>,
  res: RequiredAuthResponse,
) => {
  const { title, content, community } = req.body;

  try {
    const newPost = new Post({
      title,
      content,
      author: res.locals.username,
      community,
    });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
};
