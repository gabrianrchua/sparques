import { describe, expect, it } from 'vitest';

import {
  CreateCommentBody,
  CreatePostBody,
  CreateVoteBody,
  GetPostsQuery,
  UpdatePostBody,
} from './posts.js';

describe('schemas/posts', () => {
  it('parses valid post payloads', () => {
    expect(GetPostsQuery.parse({ community: 'main', author: 'alice' })).toEqual(
      { community: 'main', author: 'alice' },
    );
    expect(
      CreatePostBody.parse({
        title: 'hello',
        content: 'world',
        community: 'main',
      }),
    ).toEqual({
      title: 'hello',
      content: 'world',
      community: 'main',
    });
    expect(
      CreateCommentBody.parse({
        content: 'reply',
      }),
    ).toEqual({
      content: 'reply',
    });
    expect(CreateVoteBody.parse({ isUpvote: true })).toEqual({
      isUpvote: true,
    });
    expect(UpdatePostBody.parse({ title: 'edited', content: 'copy' })).toEqual({
      title: 'edited',
      content: 'copy',
    });
  });

  it('rejects invalid object ids and vote payloads', () => {
    expect(() => CreateCommentBody.parse({})).toThrow();
    expect(() => CreateVoteBody.parse({ isUpvote: 'yes' })).toThrow();
  });
});
