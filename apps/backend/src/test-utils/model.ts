import { vi } from 'vitest';

export const createModelMock = <TInstance extends object>(
  createInstance: () => TInstance,
  statics?: Record<string, unknown>,
) => {
  const model = vi.fn();
  model.mockImplementation(() => createInstance());

  return Object.assign(model, statics);
};
