import { describe, expect, it } from 'vitest';

import { LogInBody, RegisterUserBody } from './auth.js';

describe('schemas/auth', () => {
  it('accepts valid register and login payloads', () => {
    const payload = { username: 'alice', password: 'secret' };

    expect(RegisterUserBody.parse(payload)).toEqual(payload);
    expect(LogInBody.parse(payload)).toEqual(payload);
  });

  it('rejects missing credentials', () => {
    expect(() => RegisterUserBody.parse({ username: 'alice' })).toThrow();
    expect(() => LogInBody.parse({ password: 'secret' })).toThrow();
  });
});
