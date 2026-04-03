import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = {
  get: vi.fn(),
  post: vi.fn(),
};
const Router = vi.fn(() => router);

const optionalAuth = vi.fn();
const requireAuth = vi.fn();
const validateRequest = vi.fn((schema, target) => ({ schema, target }));
const getReplies = vi.fn();
const createReply = vi.fn();
const createCommentVote = vi.fn();

const CommentListQuery = { name: 'CommentListQuery' };
const CreateReplyBody = { name: 'CreateReplyBody' };
const CreateVoteBody = { name: 'CreateVoteBody' };
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

vi.mock('./get-replies.js', () => ({
  getReplies,
}));

vi.mock('./create-reply.js', () => ({
  createReply,
}));

vi.mock('./create-comment-vote.js', () => ({
  createCommentVote,
}));

vi.mock('../../schemas/comments.js', () => ({
  CommentListQuery,
  CreateReplyBody,
  CreateVoteBody,
}));

vi.mock('../../schemas/mongo.js', () => ({
  IdOnlyParams,
}));

describe('routes/comments/index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers comment routes', async () => {
    await import('./index.js');

    expect(router.get).toHaveBeenCalledWith(
      '/:id/replies',
      optionalAuth,
      { schema: CommentListQuery, target: 'query' },
      { schema: IdOnlyParams, target: 'params' },
      getReplies,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      1,
      '/:id/replies',
      requireAuth,
      { schema: CreateReplyBody, target: 'body' },
      { schema: IdOnlyParams, target: 'params' },
      createReply,
    );
    expect(router.post).toHaveBeenNthCalledWith(
      2,
      '/:id/vote',
      requireAuth,
      { schema: CreateVoteBody, target: 'body' },
      { schema: IdOnlyParams, target: 'params' },
      createCommentVote,
    );
  });
});
