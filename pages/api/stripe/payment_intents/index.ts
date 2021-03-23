import { NextApiRequest, NextApiResponse } from "next";
import { formatAmountForStripe } from "../../../../components/Utils/stripe-helpers";

import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`!, {
  apiVersion: "2020-08-27",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { amount }: { amount: number } = req.body;
    try {
      if (!(amount >= 10.0 && amount <= 5000.0)) {
        throw new Error("Invalid amount.");
      }
      const params: Stripe.PaymentIntentCreateParams = {
        payment_method_types: ["card"],
        amount: formatAmountForStripe(amount, "usd"),
        currency: "usd",
      };
      const payment_intent: Stripe.PaymentIntent = await stripe.paymentIntents.create(
        params
      );

      res.status(200).json(payment_intent);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
