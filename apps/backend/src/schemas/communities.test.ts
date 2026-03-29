import { describe, expect, it } from 'vitest';

import {
  CreateCommunityBody,
  GetCommunitiesQuery,
  UpdateCommunityBody,
} from './communities.js';

describe('schemas/communities', () => {
  it('parses valid community payloads', () => {
    const image = { mime: 'image/png', data: 'abc' };

    expect(GetCommunitiesQuery.parse({ title: 'main' })).toEqual({
      title: 'main',
    });
    expect(
      CreateCommunityBody.parse({
        title: 'main',
        bannerImage: image,
        iconImage: image,
      }),
    ).toEqual({
      title: 'main',
      bannerImage: image,
      iconImage: image,
    });
    expect(UpdateCommunityBody.parse({ bannerImage: image })).toEqual({
      bannerImage: image,
    });
  });

  it('rejects invalid image shapes', () => {
    expect(() =>
      CreateCommunityBody.parse({
        title: 'main',
        bannerImage: { mime: 'image/png' },
      }),
    ).toThrow();
  });
});
