import {
  CommentListQuery as CommentListQuerySchema,
  CreateCommentBody as CreateCommentBodySchema,
  CreateVoteBody as CreateVoteBodySchema,
} from './posts.js';
import type {
  CommentListQuery as CommentListQueryType,
  CreateCommentBody as CreateCommentBodyType,
  CreateVoteBody as CreateVoteBodyType,
} from './posts.js';

export const CommentListQuery = CommentListQuerySchema;
export const CreateCommentBody = CreateCommentBodySchema;
export const CreateVoteBody = CreateVoteBodySchema;
export type CommentListQuery = CommentListQueryType;
export type CreateCommentBody = CreateCommentBodyType;
export type CreateVoteBody = CreateVoteBodyType;

export const CreateReplyBody = CreateCommentBody;
export type CreateReplyBody = CreateCommentBody;
