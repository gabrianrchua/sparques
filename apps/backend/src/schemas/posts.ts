import { z } from 'zod';

export const GetPostsQuery = z.object({
  community: z.string().optional(),
  author: z.string().optional(),
});
export type GetPostsQuery = z.infer<typeof GetPostsQuery>;

export const CreatePostBody = z.object({
  title: z.string(),
  content: z.string(),
  community: z.string(),
});
export type CreatePostBody = z.infer<typeof CreatePostBody>;

export const CreateCommentBody = z.object({
  content: z.string(),
});
export type CreateCommentBody = z.infer<typeof CreateCommentBody>;

export const CreateVoteBody = z.object({
  isUpvote: z.boolean(),
});
export type CreateVoteBody = z.infer<typeof CreateVoteBody>;

export const CommentListQuery = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});
export type CommentListQuery = z.infer<typeof CommentListQuery>;

export const UpdatePostBody = z.object({
  title: z.string(),
  content: z.string(),
});
export type UpdatePostBody = z.infer<typeof UpdatePostBody>;
