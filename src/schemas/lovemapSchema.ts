import { z } from 'zod';

export const lovemapSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  userId: z.string().uuid('Invalid user ID'),
});