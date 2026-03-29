import { mongo } from 'mongoose';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRequest, createResponse } from '../../test-utils/http.js';
import { createModelMock } from '../../test-utils/model.js';

const findCommunity = vi.fn();
const findCommunityById = vi.fn();
const findCommunityByIdAndUpdate = vi.fn();
const saveCommunity = vi.fn();
const Community = createModelMock(
  () => ({
    save: saveCommunity,
  }),
  {
    find: vi.fn(),
    findOne: findCommunity,
    findById: findCommunityById,
    findByIdAndUpdate: findCommunityByIdAndUpdate,
  },
);

vi.mock('../../models/Community.js', () => ({
  default: Community,
}));

describe('routes/communities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createCommunity stores a new community', async () => {
    const { createCommunity } = await import('./create-community.js');
    const req = createRequest({
      body: { title: 'main', bannerImage: { mime: 'image/png', data: 'abc' } },
    });
    const res = createResponse();
    saveCommunity.mockResolvedValueOnce({ _id: 'community-1', title: 'main' });

    await createCommunity(req, res);

    expect(Community).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('createCommunity returns 409 for duplicate titles', async () => {
    const { createCommunity } = await import('./create-community.js');
    const req = createRequest({ body: { title: 'main' } });
    const res = createResponse();
    const error = new mongo.MongoError('duplicate');
    error.code = 11000;
    saveCommunity.mockRejectedValueOnce(error);

    await createCommunity(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Community already exists',
    });
  });

  it('getCommunities returns a single community when filtered by title', async () => {
    const { getCommunities } = await import('./get-communities.js');
    const req = createRequest({ query: { title: 'main' } });
    const res = createResponse();
    findCommunity.mockResolvedValueOnce({ title: 'main' });

    await getCommunities(req, res);

    expect(findCommunity).toHaveBeenCalledWith({ title: 'main' });
    expect(res.json).toHaveBeenCalledWith({ title: 'main' });
  });

  it('getCommunities returns the list when no filter is provided', async () => {
    const { getCommunities } = await import('./get-communities.js');
    const req = createRequest();
    const res = createResponse();
    const select = vi.fn().mockResolvedValueOnce([{ title: 'main' }]);
    vi.mocked(Community.find).mockReturnValueOnce({ select } as never);

    await getCommunities(req, res);

    expect(select).toHaveBeenCalledWith('-bannerImage');
    expect(res.json).toHaveBeenCalledWith([{ title: 'main' }]);
  });

  it('getCommunity returns 404 when the id is missing', async () => {
    const { getCommunity } = await import('./get-community.js');
    const req = createRequest({ params: { id: 'community-1' } });
    const res = createResponse();
    findCommunityById.mockResolvedValueOnce(null);

    await getCommunity(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Community not found' });
  });

  it('updateCommunity updates the editable fields', async () => {
    const { updateCommunity } = await import('./update-community.js');
    const req = createRequest({
      params: { id: 'community-1' },
      body: { bannerImage: { mime: 'image/png', data: 'abc' } },
    });
    const res = createResponse();
    findCommunityById.mockResolvedValueOnce({ _id: 'community-1' });
    findCommunityByIdAndUpdate.mockResolvedValueOnce({ _id: 'community-1' });

    await updateCommunity(req, res);

    expect(findCommunityByIdAndUpdate).toHaveBeenCalledWith(
      'community-1',
      { bannerImage: { mime: 'image/png', data: 'abc' }, iconImage: undefined },
      { new: true, runValidators: true },
    );
    expect(res.json).toHaveBeenCalledWith({ _id: 'community-1' });
  });
});
