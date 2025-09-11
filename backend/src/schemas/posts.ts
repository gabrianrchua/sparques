import { z } from 'zod';
import { objectId } from './mongo';

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
  parentId: objectId.optional(),
});

export const CreateVoteBody = z.object({
  isUpvote: z.boolean(),
});

export const UpdatePostBody = z.object({
  title: z.string(),
  content: z.string(),
});
