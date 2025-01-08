import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY must be defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export const STRIPE_PRICES = {
  BASICO: 'prod_RXlHdVVaV6l8p5',
  ROMANTICO: 'prod_RXlETGNanKixNU', 
};