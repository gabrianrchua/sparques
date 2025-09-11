import { z } from 'zod';

export const RegisterUserBody = z.object({
  username: z.string(),
  password: z.string(),
});

export const LogInBody = z.object({
  username: z.string(),
  password: z.string(),
});
