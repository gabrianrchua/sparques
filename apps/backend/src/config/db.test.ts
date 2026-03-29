import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createModelMock } from '../test-utils/model.js';

const connect = vi.fn();

vi.mock('mongoose', () => ({
  default: {
    connect,
  },
}));

const communityExists = vi.fn();
const saveCommunity = vi.fn();
const Community = createModelMock(
  () => ({
    save: saveCommunity,
  }),
  { exists: communityExists },
);

vi.mock('../models/Community.js', () => ({
  default: Community,
}));

describe('config/db', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('connectDB connects with the configured mongo uri', async () => {
    const { connectDB } = await import('./db.js');

    await connectDB();

    expect(connect).toHaveBeenCalledOnce();
  });

  it('seedDBData skips seeding when documents already exist', async () => {
    const { seedDBData } = await import('./db.js');
    communityExists.mockResolvedValueOnce(true);

    await seedDBData();

    expect(communityExists).toHaveBeenCalledWith({});
    expect(Community).not.toHaveBeenCalled();
  });

  it('seedDBData creates the initial community when the collection is empty', async () => {
    const { seedDBData } = await import('./db.js');
    communityExists.mockResolvedValueOnce(false);
    saveCommunity.mockResolvedValueOnce(undefined);

    await seedDBData();

    expect(Community).toHaveBeenCalledOnce();
    expect(saveCommunity).toHaveBeenCalledOnce();
  });
});
