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
import { InputGroup, NumericInput, Button } from "@blueprintjs/core";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/core/lib/css/blueprint.css";

const Payment = ({ Cookie }) => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    customDonation: undefined,
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
      <h2>Payment</h2>
      <h5 className="text-secondary">James Worldwide Use Only</h5>
      <Cart>
        <form onSubmit={handleSubmit}>
          <div className="row mt-4">
            <div className="col bp3-input-group bp3-large">
              <input
                type="number"
                className="bp3-input"
                pattern="[0-9]{0,5}"
                placeholder="Enter the amount"
                onChange={handleInputChange}
                name="customDonation"
                min={1.0}
                max={10000.0}
                step={0.01}
                value={input.customDonation || ""}
              ></input>
            </div>
            <div className="col">
              <InputGroup
                placeholder="Description"
                leftIcon="selection"
                large={true}
                value={input.text}
                onChange={(e) => setInput({ ...input, text: e.target.value })}
              ></InputGroup>
            </div>
            <div className="col">
              <Button
                className="btn btn-outline-primary btn-sm"
                type="submit"
                disabled={loading || input.customDonation <= 0}
                large={true}
              >
                Checkout{" "}
                {input.customDonation &&
                  formatAmountForDisplay(input.customDonation, "usd")}
              </Button>
            </div>
          </div>
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
