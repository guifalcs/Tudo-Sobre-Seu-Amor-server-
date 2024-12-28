import { z } from 'zod';

export const specialDateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  date: z.string().datetime('Invalid date format'),
  userId: z.string().uuid('Invalid user ID'),
});