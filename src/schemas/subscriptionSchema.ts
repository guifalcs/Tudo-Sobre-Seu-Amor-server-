import { z } from 'zod';

export const specialDateSchema = z.object({
  userId: z.string().min(1, 'User ID é necessário'),
  subscriptionId: z.string().min(1, 'Subscription ID necessário'),
  priceId: z.string().min(1, 'Price ID necessário'),
});