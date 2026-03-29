import { describe, expect, it } from 'vitest';

import { IdOnlyParams, objectId } from './mongo.js';

describe('schemas/mongo', () => {
  it('accepts valid object ids', () => {
    const id = '507f191e810c19729de860ea';

    expect(objectId.parse(id)).toBe(id);
    expect(IdOnlyParams.parse({ id })).toEqual({ id });
  });

  it('rejects invalid object ids', () => {
    expect(() => objectId.parse('bad-id')).toThrow();
    expect(() => IdOnlyParams.parse({ id: '123' })).toThrow();
  });
});
