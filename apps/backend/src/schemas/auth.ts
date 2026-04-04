import { z } from 'zod';

export const RegisterUserBody = z.object({
  username: z.string(),
  password: z.string(),
});
export type RegisterUserBody = z.infer<typeof RegisterUserBody>;

export const LogInBody = z.object({
  username: z.string(),
  password: z.string(),
});
export type LogInBody = z.infer<typeof LogInBody>;
