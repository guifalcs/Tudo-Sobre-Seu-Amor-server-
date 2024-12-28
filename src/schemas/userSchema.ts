import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  subscription: z.enum(['none','basico','romantico','apaixonado']).default('none'),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updateUserSchema = createUserSchema.partial()