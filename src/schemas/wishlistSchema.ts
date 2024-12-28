import { z } from 'zod';

export const wishlistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  link: z.string().url('Invalid URL format'),
  userId: z.string().uuid('Invalid user ID'),
});