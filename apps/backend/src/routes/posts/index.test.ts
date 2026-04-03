import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};
const Router = vi.fn(() => router);

const optionalAuth = vi.fn();
const requireAuth = vi.fn();
const validateRequest = vi.fn((schema, target) => ({ schema, target }));
const getPosts = vi.fn();
const createPost = vi.fn();
const createComment = vi.fn();
const createVote = vi.fn();
const getPost = vi.fn();
const getPostComments = vi.fn();
const updatePost = vi.fn();
const deletePost = vi.fn();

const GetPostsQuery = { name: 'GetPostsQuery' };
const CreatePostBody = { name: 'CreatePostBody' };
const CreateCommentBody = { name: 'CreateCommentBody' };
const CreateVoteBody = { name: 'CreateVoteBody' };
const CommentListQuery = { name: 'CommentListQuery' };
const UpdatePostBody = { name: 'UpdatePostBody' };
const IdOnlyParams = { name: 'IdOnlyParams' };

vi.mock('express', () => ({
  default: {
    Router,
  },
}));

vi.mock('../../middleware/optional-auth.js', () => ({
  optionalAuth,
}));

vi.mock('../../middleware/require-auth.js', () => ({
  requireAuth,
}));

vi.mock('../../middleware/validate.js', () => ({
  validateRequest,
}));

vi.mock('./get-posts.js', () => ({
  getPosts,
}));

vi.mock('./create-post.js', () => ({
  createPost,
}));

vi.mock('./create-comment.js', () => ({
  createComment,
}));

vi.mock('./create-vote.js', () => ({
  createVote,
}));

vi.mock('./get-post.js', () => ({
  getPost,
}));

vi.mock('./get-post-comments.js', () => ({
  getPostComments,
}));

vi.mock('./update-post.js', () => ({
  updatePost,
}));

vi.mock('./delete-post.js', () => ({
  deletePost,
}));

vi.mock('../../schemas/posts.js', () => ({
  GetPostsQuery,
  CreatePostBody,
  CreateCommentBody,
  CreateVoteBody,
  CommentListQuery,
  UpdatePostBody,
}));

vi.mock('../../schemas/mongo.js', () => ({
  IdOnlyParams,
}));

describe('routes/posts/index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers the posts routes', async () => {
    await import('./index.js');

    expect(router.get).toHaveBeenNthCalledWith(
      1,
      '/',
      optionalAuth,
      { schema: GetPostsQuery, target: 'query' },
      getPosts,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      1,
      '/',
      requireAuth,
      { schema: CreatePostBody, target: 'body' },
      createPost,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      2,
      '/:id/comments',
      requireAuth,
      { schema: CreateCommentBody, target: 'body' },
      { schema: IdOnlyParams, target: 'params' },
      createComment,
    );
    expect(router.get).toHaveBeenNthCalledWith(
      2,
      '/:id/comments',
      optionalAuth,
      { schema: CommentListQuery, target: 'query' },
      { schema: IdOnlyParams, target: 'params' },
      getPostComments,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      3,
      '/:id/vote',
      requireAuth,
      { schema: CreateVoteBody, target: 'body' },
      { schema: IdOnlyParams, target: 'params' },
      createVote,
    );
    expect(router.get).toHaveBeenNthCalledWith(
      3,
      '/:id',
      optionalAuth,
      { schema: IdOnlyParams, target: 'params' },
      getPost,
    );
    expect(router.put).toHaveBeenCalledWith(
      '/:id',
      requireAuth,
      { schema: UpdatePostBody, target: 'body' },
      { schema: IdOnlyParams, target: 'params' },
      updatePost,
    );
    expect(router.delete).toHaveBeenCalledWith(
      '/:id',
      requireAuth,
      { schema: IdOnlyParams, target: 'params' },
      deletePost,
    );
  });
});
