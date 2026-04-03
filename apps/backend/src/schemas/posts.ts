import { z } from 'zod';
import { objectId } from './mongo.js';

export const GetPostsQuery = z.object({
  community: z.string().optional(),
  author: z.string().optional(),
});

export const CreatePostBody = z.object({
  title: z.string(),
  content: z.string(),
  community: z.string(),
});

export const CreateCommentBody = z.object({
  content: z.string(),
});

export const CreateVoteBody = z.object({
  isUpvote: z.boolean(),
});

export const CommentListQuery = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const UpdatePostBody = z.object({
  title: z.string(),
  content: z.string(),
});
