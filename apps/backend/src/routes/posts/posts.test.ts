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
const findComments = vi.fn();
const Comment = createModelMock(
  () => ({
    save: saveComment,
  }),
  { find: findComments },
);

const findVote = vi.fn();
const findVotes = vi.fn();
const findVoteByIdAndUpdate = vi.fn();
const findVoteByIdAndDelete = vi.fn();
const saveVote = vi.fn();
const Vote = createModelMock(
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

vi.mock('../../models/Vote.js', () => ({
  default: Vote,
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

  it('createComment increments the comment counter and saves the comment', async () => {
    const { createComment } = await import('./create-comment.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { content: 'reply', parentId: '507f191e810c19729de860ea' },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findPostByIdAndUpdate.mockResolvedValueOnce({ _id: 'post-1' });
    saveComment.mockResolvedValueOnce({ _id: 'comment-1' });

    await createComment(req, res);

    expect(findPostByIdAndUpdate).toHaveBeenCalledWith(
      'post-1',
      { $inc: { numComments: 1 } },
      { new: true, runValidators: true },
    );
    expect(Comment).toHaveBeenCalledWith({
      postId: 'post-1',
      author: 'alice',
      content: 'reply',
      parentId: '507f191e810c19729de860ea',
    });
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

    expect(Vote).toHaveBeenCalledWith({
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

  it('createVote switches an existing downvote to an upvote', async () => {
    const { createVote } = await import('./create-vote.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { isUpvote: true },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findVote.mockResolvedValueOnce({ _id: 'vote-1', isUpvote: false });
    findPostByIdAndUpdate.mockResolvedValueOnce({ _id: 'post-1' });
    findVoteByIdAndUpdate.mockResolvedValueOnce({ _id: 'vote-1', isUpvote: true });

    await createVote(req, res);

    expect(findPostByIdAndUpdate).toHaveBeenCalledWith(
      'post-1',
      { $inc: { numUpvotes: 1, numDownvotes: -1 } },
      { new: true, runValidators: true },
    );
    expect(res.json).toHaveBeenCalledWith({ _id: 'vote-1', isUpvote: true });
  });

  it('createVote removes an existing upvote when voting up again', async () => {
    const { createVote } = await import('./create-vote.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { isUpvote: true },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findVote.mockResolvedValueOnce({ _id: 'vote-1', isUpvote: true });
    findPostByIdAndUpdate.mockResolvedValueOnce({ _id: 'post-1' });
    findVoteByIdAndDelete.mockResolvedValueOnce({ _id: 'vote-1' });

    await createVote(req, res);

    expect(findPostByIdAndUpdate).toHaveBeenCalledWith(
      'post-1',
      { $inc: { numUpvotes: -1 } },
      { new: true, runValidators: true },
    );
    expect(findVoteByIdAndDelete).toHaveBeenCalledWith('vote-1');
    expect(res.json).toHaveBeenCalledWith({ _id: 'vote-1' });
  });

  it('createVote removes an existing downvote when voting down again', async () => {
    const { createVote } = await import('./create-vote.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { isUpvote: false },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findVote.mockResolvedValueOnce({ _id: 'vote-1', isUpvote: false });
    findPostByIdAndUpdate.mockResolvedValueOnce({ _id: 'post-1' });
    findVoteByIdAndDelete.mockResolvedValueOnce({ _id: 'vote-1' });

    await createVote(req, res);

    expect(findPostByIdAndUpdate).toHaveBeenCalledWith(
      'post-1',
      { $inc: { numDownvotes: -1 } },
      { new: true, runValidators: true },
    );
    expect(res.json).toHaveBeenCalledWith({ _id: 'vote-1' });
  });

  it('createVote still returns the created vote after reporting a missing post', async () => {
    const { createVote } = await import('./create-vote.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { isUpvote: false },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findVote.mockResolvedValueOnce(null);
    findPostByIdAndUpdate.mockResolvedValueOnce(null);
    saveVote.mockResolvedValueOnce({ _id: 'vote-1', isUpvote: false });

    await createVote(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenLastCalledWith({ _id: 'vote-1', isUpvote: false });
  });

  it('createVote returns 500 when vote creation fails', async () => {
    const { createVote } = await import('./create-vote.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { isUpvote: true },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    const error = new Error('db failure');
    findVote.mockRejectedValueOnce(error);

    await createVote(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
      error,
    });
  });

  it('getPost returns post details with comments and vote state for authenticated users', async () => {
    const { getPost } = await import('./get-post.js');
    const req = createRequest({ params: { id: 'post-1' } });
    const res = createResponse();
    res.locals.username = 'alice';
    findPost.mockResolvedValueOnce({
      toObject: () => ({ _id: 'post-1', title: 'hello' }),
    });
    const sortComments = vi.fn().mockResolvedValueOnce([{ _id: 'comment-1' }]);
    findComments.mockReturnValueOnce({ sort: sortComments } as never);
    findVotes.mockResolvedValueOnce([{ _id: 'vote-1', isUpvote: true }]);

    await getPost(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: 'post-1',
      title: 'hello',
      comments: [{ _id: 'comment-1' }],
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

  it('getPosts aggregates all posts for authenticated users without a community filter', async () => {
    const { getPosts } = await import('./get-posts.js');
    const req = createRequest();
    const res = createResponse();
    res.locals.username = 'alice';
    const sort = vi.fn().mockResolvedValueOnce([{ _id: 'post-1' }]);
    aggregatePosts.mockReturnValueOnce({ sort } as never);

    await getPosts(req, res);

    expect(aggregatePosts).toHaveBeenCalledWith([
      expect.objectContaining({
        $lookup: expect.objectContaining({
          as: 'votes',
        }),
      }),
    ]);
    expect(res.json).toHaveBeenCalledWith([{ _id: 'post-1' }]);
  });

  it('getPosts returns plain posts for anonymous users', async () => {
    const { getPosts } = await import('./get-posts.js');
    const req = createRequest({ query: { community: 'main' } });
    const res = createResponse();
    const sort = vi.fn().mockResolvedValueOnce([{ _id: 'post-1' }]);
    vi.mocked(Post.find).mockReturnValueOnce({ sort } as never);

    await getPosts(req, res);

    expect(Post.find).toHaveBeenCalledWith({ community: 'main' });
    expect(res.json).toHaveBeenCalledWith([{ _id: 'post-1' }]);
  });

  it('getPosts returns the full anonymous feed when no filter is provided', async () => {
    const { getPosts } = await import('./get-posts.js');
    const req = createRequest();
    const res = createResponse();
    const sort = vi.fn().mockResolvedValueOnce([{ _id: 'post-1' }]);
    vi.mocked(Post.find).mockReturnValueOnce({ sort } as never);

    await getPosts(req, res);

    expect(Post.find).toHaveBeenCalledWith();
    expect(res.json).toHaveBeenCalledWith([{ _id: 'post-1' }]);
  });

  it('getPosts returns 500 when the query fails', async () => {
    const { getPosts } = await import('./get-posts.js');
    const req = createRequest({ query: { community: 'main' } });
    const res = createResponse();
    const error = new Error('aggregate failure');
    const sort = vi.fn().mockRejectedValueOnce(error);
    aggregatePosts.mockReturnValueOnce({ sort } as never);
    res.locals.username = 'alice';

    await getPosts(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Server error',
      error,
    });
  });

  it('getPost returns post details without vote state for anonymous users', async () => {
    const { getPost } = await import('./get-post.js');
    const req = createRequest({ params: { id: 'post-1' } });
    const res = createResponse();
    findPost.mockResolvedValueOnce({
      toObject: () => ({ _id: 'post-1', title: 'hello' }),
    });
    const sortComments = vi.fn().mockResolvedValueOnce([{ _id: 'comment-1' }]);
    findComments.mockReturnValueOnce({ sort: sortComments } as never);

    await getPost(req, res);

    expect(res.json).toHaveBeenCalledWith({
      _id: 'post-1',
      title: 'hello',
      comments: [{ _id: 'comment-1' }],
    });
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

  it('updatePost rejects edits from non-authors', async () => {
    const { updatePost } = await import('./update-post.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { title: 'edited', content: 'copy' },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findPost.mockResolvedValueOnce({ author: 'bob' });

    await updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('updatePost updates a post for its author', async () => {
    const { updatePost } = await import('./update-post.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { title: 'edited', content: 'copy' },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findPost.mockResolvedValueOnce({ author: 'alice' });
    findPostByIdAndUpdate.mockResolvedValueOnce({ _id: 'post-1', title: 'edited' });

    await updatePost(req, res);

    expect(findPostByIdAndUpdate).toHaveBeenCalledWith(
      'post-1',
      { title: 'edited', content: 'copy', editDate: expect.any(Number) },
      { new: true, runValidators: true },
    );
    expect(res.json).toHaveBeenCalledWith({ _id: 'post-1', title: 'edited' });
  });

  it('updatePost returns 404 when the post does not exist', async () => {
    const { updatePost } = await import('./update-post.js');
    const req = createRequest({
      params: { id: 'post-1' },
      body: { title: 'edited', content: 'copy' },
    });
    const res = createResponse();
    res.locals.username = 'alice';
    findPost.mockResolvedValueOnce(null);

    await updatePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });

  it('deletePost deletes the post for its author', async () => {
    const { deletePost } = await import('./delete-post.js');
    const req = createRequest({ params: { id: 'post-1' } });
    const res = createResponse();
    res.locals.username = 'alice';
    findPost.mockResolvedValueOnce({ author: 'alice' });
    findPostByIdAndDelete.mockResolvedValueOnce({ _id: 'post-1' });

    await deletePost(req, res);

    expect(findPostByIdAndDelete).toHaveBeenCalledWith('post-1');
    expect(res.json).toHaveBeenCalledWith({
      message: 'Post deleted successfully',
    });
  });

  it('deletePost returns 404 when the post does not exist', async () => {
    const { deletePost } = await import('./delete-post.js');
    const req = createRequest({ params: { id: 'post-1' } });
    const res = createResponse();
    findPost.mockResolvedValueOnce(null);

    await deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Post not found' });
  });

  it('deletePost rejects deletion by a non-author', async () => {
    const { deletePost } = await import('./delete-post.js');
    const req = createRequest({ params: { id: 'post-1' } });
    const res = createResponse();
    res.locals.username = 'alice';
    findPost.mockResolvedValueOnce({ author: 'bob' });

    await deletePost(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User is forbidden to delete a post created by another user ',
    });
  });
});
