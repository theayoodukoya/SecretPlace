import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const journalSchema = z.object({
  title: z.string().optional(),
  body: z.string().min(1, 'Entry cannot be empty'),
});
