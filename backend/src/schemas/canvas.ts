import { z } from 'zod';

export const CanvasNameOnlyParams = z.object({
  canvas: z.string(), // canvas name, not _id
});
