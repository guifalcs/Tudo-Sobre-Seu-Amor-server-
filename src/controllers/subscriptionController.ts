import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { stripe, STRIPE_PRICES } from "../config/stripe";
import { NotFoundError } from "../lib/errors";

export const createCheckoutSession = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.body.userId;

    if (!req.body.userId) {
      throw new NotFoundError("User not authenticated");
    }

   const priceId = req.body.priceId

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "pix"],
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

// export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
//   const sig = req.headers['stripe-signature'];

//   if (!process.env.STRIPE_WEBHOOK_SECRET || !sig) {
//     throw new Error('Webhook secret not configured');
//   }

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     res.status(400).send(`Webhook Error: ${err}`);
//     return;
//   }

//   switch (event.type) {
//     case 'checkout.session.completed': {
//       const session = event.data.object;
//       const userId = session.metadata!.userId;
//       const subscriptionId = session.subscription as string;

//       await prisma.user.update({
//         where: { id: userId },
//         data: {
//           subscriptionId: subscriptionId,
//           subscription: {
//             connect: {
//               stripeSubscriptionId: subscriptionId,
//             },
//           },
//         },
//       });
//       break;
//     }
//     case 'customer.subscription.deleted': {
//       const subscription = event.data.object;
//       await prisma.user.updateMany({
//         where: { subscriptionId: subscription.id },
//         data: {
//           subscriptionId: null,
//         },
//       });
//       break;
//     }
//   }

//   res.json({ received: true });
// });
