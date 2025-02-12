import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { stripe, STRIPE_PRICES } from "../config/stripe";
import { NotFoundError } from "../lib/errors";
import Stripe from "stripe";
import prisma from "../lib/prisma";

export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    if (!req.body.userId) {
      throw new NotFoundError("User not authenticated");
    }

   const priceId = req.body.priceId

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      currency: "brl",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `http://localhost:4200/dashboard`,
      cancel_url: `http://localhost:4200`,
      customer_email: req.body.email,
      metadata: {
        userId,
      },
    });

    res.json({ url: session.url });
  }
);

export const getSubscriptionPlans = asyncHandler(
  async (req: Request, res: Response) => {
    const plans = [
      {
        id: "prod_RXlHdVVaV6l8p5",
        name: "Básico",
        price: 0,
        priceId: STRIPE_PRICES.BASICO,
        features: ["Contador do Tempo", "Lembrete de Aniversário"],
      },
      {
        id: "prod_RXlETGNanKixNU",
        name: "Romântico",
        price: 9.99,
        priceId: STRIPE_PRICES.ROMANTICO,
        features: ["Todos os recursos do plano básico", "Linha do Tempo", "Lista de desejos", "Lembretes de todas as datas especiais"],
      },
    ];

    res.json(plans);
  }
);

export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type as any) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          throw new Error('No userId in session metadata');
        }

        // Map Stripe price IDs to subscription types
        const subscriptionMap: { [key: string]: 'Nenhum' | 'Básico' | 'Romântico' | 'Apaixonado' } = {
          [STRIPE_PRICES.BASICO]: 'Básico',
          [STRIPE_PRICES.ROMANTICO]: 'Romântico',
        };

        // Get the price ID from the session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;

        if (!priceId) {
          throw new Error('No price ID found in session');
        }

        // Update user subscription
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscription: {
              connect: {
                id: subscriptionMap[priceId] || 'Nenhum'
              }
            }
          }
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        // Handle subscription updates (e.g., plan changes, payment issues)
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscription: {
                disconnect: true
              }
            }
          });
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          // Handle successful payment (e.g., update user status or subscription)
          await prisma.user.update({
            where: { id: userId },
            data: {
              status: 'Ativo' // Atualize conforme necessário
            }
          });
        } else {
          console.warn('User ID not found in payment intent metadata');
        }
        break;
      }

      case 'payment_intent.failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          // Handle failed payment (e.g., update user status or notify user)
          await prisma.user.update({
            where: { id: userId },
            data: {
              status: 'Inativo' // Atualize conforme necessário
            }
          });
        } else {
          console.warn('User ID not found in payment intent metadata');
        }
        break;
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(400).send(`Webhook Error: ${err}`);
  }
});
