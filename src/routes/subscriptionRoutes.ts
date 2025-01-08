import { Router } from 'express';
import {
  createCheckoutSession,
  getSubscriptionPlans,
  // handleWebhook,
} from '../controllers/subscriptionController';

const subscriptionRouter = Router();

subscriptionRouter.get('/plans', getSubscriptionPlans);
subscriptionRouter.post('/create-checkout-session', createCheckoutSession);
// subscriptionRouter.post('/webhook', handleWebhook);

export default subscriptionRouter;