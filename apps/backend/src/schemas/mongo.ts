import { z } from 'zod';

export const objectId = z.stringFormat('ObjectId', /^[a-fA-F0-9]{24}$/);

export const IdOnlyParams = z.object({
  id: objectId,
});
