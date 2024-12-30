import { z } from 'zod';
import { customDateValidator } from '../utils/dateValidation';

export const timelineSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  date: z.string().refine(customDateValidator, 'Date must be in DD/MM/YYYY or MM/DD/YYYY format'),
  userId: z.string().uuid('Invalid user ID'),
});