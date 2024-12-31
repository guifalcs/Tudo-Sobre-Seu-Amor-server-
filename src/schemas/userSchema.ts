import { z } from 'zod';

const UserStatus = z.enum(['active', 'inactive']);
const SubscriptionType = z.enum(['none', 'basico', 'romantico', 'apaixonado']);

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  subscription: SubscriptionType.default('none'),
  status: UserStatus.default('active'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  subscription: SubscriptionType.optional(),
  status: UserStatus.optional(),
});

export const findUserSchema = z.object({
  id: z.string().min(1, 'User id is required')
});

export const loginUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password has at least 6 characters'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type FindUserInput = z.infer<typeof findUserSchema>;
export type loginUserInput = z.infer<typeof loginUserSchema>;