import { z } from 'zod';
import { customDateValidator } from '../utils/dateValidation';

export const relationshipSchema = z.object({
  userId: z.string(),
  partnerName: z.string().min(1, 'Nome do parceiro é obrigatório'),
  startDate: z.string()
    .refine(customDateValidator, 'Data deve ser no formato DD/MM/AAAA ou MM/DD/AAAA')
});

export const updateRelationshipSchema = z.object({
  userId: z.string(),
  partnerName: z.string().min(1, 'Nome do parceiro é obrigatporio').optional(),
  startDate: z.string()
    .refine(customDateValidator, 'Data deve ser no formato DD/MM/AAAA ou MM/DD/AAAA').optional()
});