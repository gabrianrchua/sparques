import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRequest, createResponse } from '../../test-utils/http.js';
import { createModelMock } from '../../test-utils/model.js';

const findPost = vi.fn();
const findPostByIdAndUpdate = vi.fn();
const findPostByIdAndDelete = vi.fn();
const aggregatePosts = vi.fn();
const savePost = vi.fn();
const Post = createModelMock(
  () => ({
    save: savePost,
  }),
  {
    find: vi.fn(),
    findById: findPost,
    findByIdAndUpdate: findPostByIdAndUpdate,
    findByIdAndDelete: findPostByIdAndDelete,
    aggregate: aggregatePosts,
  },
);

const saveComment = vi.fn();
const Comment = createModelMock(
  () => ({
    _id: 'comment-1',
    save: saveComment,
  }),
  {
    aggregate: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
);

const findVote = vi.fn();
const findVotes = vi.fn();
const findVoteByIdAndUpdate = vi.fn();
const findVoteByIdAndDelete = vi.fn();
const saveVote = vi.fn();
const PostVote = createModelMock(
  () => ({
    save: saveVote,
  }),
  {
    findOne: findVote,
    find: findVotes,
    findByIdAndUpdate: findVoteByIdAndUpdate,
    findByIdAndDelete: findVoteByIdAndDelete,
  },
);

vi.mock('../../models/Post.js', () => ({
  default: Post,
}));

vi.mock('../../models/Comment.js', () => ({
  default: Comment,
}));

vi.mock('../../models/PostVote.js', () => ({
  default: PostVote,
}));

describe('routes/posts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createPost persists a new post with the authenticated username', async () => {
    const { createPost } = await import('./create-post.js');
    const req = createRequest({
      body: { title: 'hello', content: 'world', community: 'main' },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    savePost.mockResolvedValueOnce({ _id: 'post-1' });

    await createPost(req, res);

    expect(Post).toHaveBeenCalledWith({
      title: 'hello',
      content: 'world',
      author: 'alice',
      community: 'main',
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createComment saves a top-level comment and increments the post counter', async () => {
    const { createComment } = await import('./create-comment.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { content: 'reply' },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findPost.mockResolvedValueOnce({ _id: 'post-1' });
    saveComment.mockResolvedValueOnce({ _id: 'comment-1' });

    await createComment(req, res);

    expect(Comment).toHaveBeenCalledWith(
      expect.objectContaining({
        postId: 'post-1',
        author: 'alice',
        content: 'reply',
        depth: 0,
      }),
    );
    expect(findPostByIdAndUpdate).toHaveBeenCalledWith(
      'post-1',
      { $inc: { numComments: 1 } },
      { new: true, runValidators: true },
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createVote creates a new upvote when no prior vote exists', async () => {
    const { createVote } = await import('./create-vote.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { isUpvote: true },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findVote.mockResolvedValueOnce(null);
    findPostByIdAndUpdate.mockResolvedValueOnce({ _id: 'post-1' });
    saveVote.mockResolvedValueOnce({ _id: 'vote-1', isUpvote: true });

    await createVote(req, res);

    expect(PostVote).toHaveBeenCalledWith({
      postId: 'post-1',
      author: 'alice',
      isUpvote: true,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createVote switches an existing upvote to a downvote', async () => {
    const { createVote } = await import('./create-vote.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { isUpvote: false },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findVote.mockResolvedValueOnce({ _id: 'vote-1', isUpvote: true });
    findPostByIdAndUpdate.mockResolvedValueOnce({ _id: 'post-1' });
    findVoteByIdAndUpdate.mockResolvedValueOnce({ _id: 'vote-1', isUpvote: false });

    await createVote(req, res);

    expect(findVoteByIdAndUpdate).toHaveBeenCalledWith(
      'vote-1',
      { isUpvote: false },
      { new: true, runValidators: true },
    );
    expect(res.json).toHaveBeenCalledWith({ _id: 'vote-1', isUpvote: false });
  });

  it('getPost returns post details with vote state for authenticated users', async () => {
    const { getPost } = await import('./get-post.js');
    const req = createRequest({ params: { id: 'post-1' } });
    const res = createResponse();
    res.locals.username = 'alice';
    findPost.mockResolvedValueOnce({
      toObject: () => ({ _id: 'post-1', title: 'hello' }),
    });
    findVotes.mockResolvedValueOnce([{ _id: 'vote-1', isUpvote: true }]);

    await getPost(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: 'post-1',
      title: 'hello',
      votes: [{ _id: 'vote-1', isUpvote: true }],
    });
  });

  it('getPosts aggregates vote state for authenticated feeds', async () => {
    const { getPosts } = await import('./get-posts.js');
    const req = createRequest({ query: { community: 'main' } });
    const res = createResponse();
    res.locals.username = 'alice';
    const sort = vi.fn().mockResolvedValueOnce([{ _id: 'post-1' }]);
    aggregatePosts.mockReturnValueOnce({ sort } as never);

    await getPosts(req, res);

    expect(aggregatePosts).toHaveBeenCalledOnce();
    expect(sort).toHaveBeenCalledWith({ creationDate: 'descending' });
    expect(res.json).toHaveBeenCalledWith([{ _id: 'post-1' }]);
  });

  it('getPost returns 404 when the post does not exist', async () => {
    const { getPost } = await import('./get-post.js');
    const req = createRequest({ params: { id: 'post-1' } });
    const res = createResponse();
    findPost.mockResolvedValueOnce(null);

    await getPost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });
});
