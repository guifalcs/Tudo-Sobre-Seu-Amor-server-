import { z } from 'zod';

export const timelineSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().datetime('Invalid date format'),
  userId: z.string().uuid('Invalid user ID'),
});