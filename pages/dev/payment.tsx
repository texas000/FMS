import React, { useState, useEffect } from "react";
import cookie from "cookie";
import { NextPage } from "next";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import { useShoppingCart, formatCurrencyString } from "use-shopping-cart";
import { fetchPostJSON } from "../../components/Utils/api-helper";
import Cart from "../../components/Cart/index";
import getStripe from "../../components/Utils/get-stripejs";
import { formatAmountForDisplay } from "../../components/Utils/stripe-helpers";

const Payment = ({ Cookie }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    customDonation: Math.round(5000 / 5),
  });

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    //Create a Cehckout Sesssion
    const response = await fetchPostJSON("/api/stripe/checkout_sessions", {
      amount: input.customDonation,
    });
    if (response.statusCode === 500) {
      console.error(response.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: response.id,
    });
    console.warn(error.message);
    setLoading(false);
  };

  return (
    <Layout TOKEN={jwt.decode(Cookie.jamesworldwidetoken)} TITLE="Payment">
      <Cart>
        <form onSubmit={handleSubmit}>
          <label>
            Custom Donation Amount{" "}
            {`(${formatAmountForDisplay(10.0, "usd")}-${formatAmountForDisplay(
              5000.0,
              "usd"
            )}):`}
          </label>
          <input
            className="checkout-style"
            type="number"
            name="customDonation"
            value={input.customDonation}
            min={10.0}
            max={5000.0}
            step={5.0}
            onChange={handleInputChange}
          ></input>
          <input
            className="checkout-style"
            type="range"
            name="customDonation"
            value={input.customDonation}
            min={10.0}
            max={5000.0}
            step={5.0}
            onChange={handleInputChange}
          ></input>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            Donate {formatAmountForDisplay(input.customDonation, "usd")}
          </button>
        </form>
      </Cart>
    </Layout>
  );
};

export default Payment;
export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  // Pass data to the page via props
  return { props: { Cookie: cookies } };
}
