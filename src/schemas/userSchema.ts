import { z } from 'zod';

const UserStatus = z.enum(['Ativo', 'Inativo']);
const SubscriptionType = z.enum(['Nenhum', 'Básico', 'Romântico', 'Apaixonado']);

export const createUserSchema = z.object({
  name: z.string().min(2, 'Nome tem que ter pelo menos 2 caracteres'),
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  subscription: SubscriptionType.default('Nenhum'),
  status: UserStatus.default('Ativo'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Nome tem que ter pelo menos 2 caracteres').optional(),
  email: z.string().email('Formato de email inválido').optional(),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional(),
  subscription: SubscriptionType.optional(),
  status: UserStatus.optional(),
});

export const loginUserSchema = z.object({
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type loginUserInput = z.infer<typeof loginUserSchema>;