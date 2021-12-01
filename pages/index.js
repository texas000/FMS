import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import moment from "moment";
import React, { useState, useEffect, Fragment } from "react";
import useSWR from "swr";
import { useRouter } from "next/router";
import Notification from "../components/Toaster";
import Checkout from "../components/Dashboard/Payment";
import usdFormat from "../lib/currencyFormat";
import axios from "axios";
import Head from "next/head";
import RecentBoard from "../components/Dashboard/RecentBoard";
import Forwarding from "../components/Dashboard/Forwarding";

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    return {
      props: {
        token: token,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}

export default function dashboard(props) {
  const { data } = useSWR("/api/dashboard/list");
  const { data: invoice } = useSWR("/api/dashboard/invoice");
  const { data: board } = useSWR("/api/board/getRecentBoard");
  const router = useRouter();
  useEffect(() => {}, []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: "4db5fd76-1074-4e1c-ad4b-9c365fea2cf6",
        safari_web_id:
          "web.onesignal.auto.215a98b6-2876-4938-a894-401760de5038",
        notifyButton: {
          enable: true,
        },
      });
      OneSignal.sendTag("uid", props.token.uid);
    });

    return () => {
      window.OneSignal = undefined;
    };
  }, []);

  return (
    <Layout TOKEN={props.token} TITLE="Dashboard" LOADING={!data || loading}>
      <div className="flex justify-between mb-4">
        <h3 className="dark:text-white">Dashboard</h3>
        <a
          className="bg-white dark:bg-gray-700 dark:text-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
          style={{ textDecoration: "none" }}
          onClick={() => {
            setLoading(true);
            router.push("/invoice");
          }}
        >
          Pending Invoice{" "}
          {invoice && invoice.length && usdFormat(invoice[0].pending)}
        </a>
      </div>

      <RecentBoard board={board} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Forwarding
          data={data && data[0]}
          path="oim"
          title="Ocean Import"
          loading={Boolean(data)}
        />
        <Forwarding
          data={data && data[1]}
          path="oex"
          title="Ocean Export"
          loading={Boolean(data)}
        />
        <Forwarding
          data={data && data[2]}
          path="aim"
          title="Air Import"
          loading={Boolean(data)}
        />
        <Forwarding
          data={data && data[3]}
          path="aex"
          title="Air Export"
          loading={Boolean(data)}
        />
        <Checkout />
      </div>
    </Layout>
  );
}
