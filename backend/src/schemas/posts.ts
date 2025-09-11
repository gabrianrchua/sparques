import { z } from 'zod';

const objectId = z.stringFormat('ObjectId', /^[a-fA-F0-9]{24}$/);

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

export const IdOnlyParams = z.object({
  id: objectId,
});
