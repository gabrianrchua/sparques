import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
};
const Router = vi.fn(() => router);

const getCommunities = vi.fn();
const getCommunity = vi.fn();
const createCommunity = vi.fn();
const updateCommunity = vi.fn();

const validateRequest = vi.fn((schema, target) => ({ schema, target }));

const GetCommunitiesQuery = { name: 'GetCommunitiesQuery' };
const CreateCommunityBody = { name: 'CreateCommunityBody' };
const UpdateCommunityBody = { name: 'UpdateCommunityBody' };
const IdOnlyParams = { name: 'IdOnlyParams' };

vi.mock('express', () => ({
  default: {
    Router,
  },
}));

vi.mock('./get-communities.js', () => ({
  getCommunities,
}));

vi.mock('./get-community.js', () => ({
  getCommunity,
}));

vi.mock('./create-community.js', () => ({
  createCommunity,
}));

vi.mock('./update-community.js', () => ({
  updateCommunity,
}));

vi.mock('../../middleware/validate.js', () => ({
  validateRequest,
}));

vi.mock('../../schemas/communities.js', () => ({
  GetCommunitiesQuery,
  CreateCommunityBody,
  UpdateCommunityBody,
}));

vi.mock('../../schemas/mongo.js', () => ({
  IdOnlyParams,
}));

describe('routes/communities/index', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers the community routes', async () => {
    await import('./index.js');

    expect(router.get).toHaveBeenNthCalledWith(
      1,
      '/',
      { schema: GetCommunitiesQuery, target: 'query' },
      getCommunities,
    );
    expect(router.get).toHaveBeenNthCalledWith(
      2,
      '/:id',
      { schema: IdOnlyParams, target: 'params' },
      getCommunity,
    );
    expect(router.post).toHaveBeenCalledWith(
      '/',
      { schema: CreateCommunityBody, target: 'body' },
      createCommunity,
    );
    expect(router.put).toHaveBeenCalledWith(
      '/:id',
      { schema: IdOnlyParams, target: 'params' },
      { schema: UpdateCommunityBody, target: 'body' },
      updateCommunity,
    );
  });
});
