import React, { ReactNode } from "react";
import { CartProvider } from "use-shopping-cart";
import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(
      `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`!
    );
  }
  return stripePromise;
};
const CURRENCY = "USD";

const Cart = ({ children }: { children: ReactNode }) => (
  <CartProvider
    mode="checkout-session"
    stripe={getStripe()}
    currency={CURRENCY}
  >
    <>{children}</>
  </CartProvider>
);

export default Cart;
