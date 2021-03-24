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
    customDonation: 100,
    text: "",
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
      name: input.text,
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
          <label>AMOUNT: </label>
          <input
            className="checkout-style mb-4"
            type="number"
            name="customDonation"
            value={input.customDonation}
            min={1.0}
            max={10000.0}
            step={1.0}
            onChange={handleInputChange}
          ></input>
          <br />
          <label>CUSTOMER: </label>
          <input
            className="mb-4"
            type="text"
            name="customer"
            value={input.text}
            onChange={(e) => setInput({ ...input, text: e.target.value })}
          />
          <br />
          <button
            className="btn btn-outline-primary btn-sm"
            type="submit"
            disabled={loading}
          >
            Checkout {formatAmountForDisplay(input.customDonation, "usd")}
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
