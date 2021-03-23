import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import { fetchGetJSON } from "../../components/Utils/api-helper";
import Cart from "../../components/Cart";
import { useShoppingCart } from "use-shopping-cart";

const ResultPage = ({ Cookie }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const { data, error } = useSWR(
    router.query.session_id
      ? `/api/stripe/checkout_sessions/${router.query.session_id}`
      : null,
    fetchGetJSON
  );

  if (error) return <div>failed to load</div>;

  const PrintObject = (content) => {
    const formattedContent: string = JSON.stringify(content, null, 2);
    return <pre>{formattedContent}</pre>;
  };

  const ClearCart = () => {
    const { clearCart } = useShoppingCart();
    useEffect(() => clearCart(), [clearCart]);
    return <p>Cart Cealred.</p>;
  };

  return (
    <Layout TOKEN={TOKEN} TITLE="Payment Result">
      <div className="page-container">
        <h1>Checkout Payment Result</h1>
        <h2>Status: {data?.payment_intent?.status ?? "loading..."}</h2>
        <h3>CheckoutSession response:</h3>
        <PrintObject content={data ?? "loading..."} />
        <Cart>
          <ClearCart />
        </Cart>
        <p>{router.query.session_id}</p>
      </div>
    </Layout>
  );
};

export default ResultPage;

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  // Pass data to the page via props
  return { props: { Cookie: cookies } };
}
