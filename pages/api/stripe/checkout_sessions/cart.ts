import { NextApiRequest, NextApiResponse } from "next";
import { validateCartItems } from "use-shopping-cart/src/serverUtil";

import Stripe from "stripe";
const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`!, {
  apiVersion: "2020-08-27",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const cartItems = req.body;

      const data = [
        {
          name: "Bananas",
          description: "Yummy yellow fruit",
          sku: "sku_GBJ2Ep8246qeeT",
          price: 400,
          image:
            "https://images.unsplash.com/photo-1574226516831-e1dff420e562?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=225&q=80",
          attribution: "Photo by Priscilla Du Preez on Unsplash",
          currency: "USD",
        },
        {
          name: "Tangerines",
          sku: "sku_GBJ2WWfMaGNC2Z",
          price: 100,
          image:
            "https://images.unsplash.com/photo-1482012792084-a0c3725f289f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=225&q=80",
          attribution: "Photo by Jonathan Pielmayer on Unsplash",
          currency: "USD",
        },
      ];

      const line_items = validateCartItems(data, cartItems);

      const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_address_collection: {
          allowed_countries: ["US", "CA"],
        },
        line_items,
        success_url: `${req.headers.origin}/dev/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/dev/payment`,
      };
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
        params
      );

      res.status(200).json(checkoutSession);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
