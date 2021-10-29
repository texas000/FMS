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
  const router = useRouter();
  useEffect(() => {}, []);
  const [loading, setLoading] = useState(false);

  async function sendMsg(e) {
    // const channel = new BroadcastChannel("sw-messages");
    // channel.postMessage({ body: e, icon: "/image/JLOGO.png" });
    const fet = await fetch("/api/message/oneSignalPostNew", {
      method: "POST",
      body: e,
    });
  }
  // const handleFileUpload = async (e) => {
  //   var form = new FormData();
  //   form.append("userPhoto", e.target.files[0]);
  //   await axios({
  //     url: "http://jameswi.com:49991/api/upload/test",
  //     method: "POST",
  //     data: form,
  //   })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

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
    });

    return () => {
      window.OneSignal = undefined;
    };
  }, []);

  return (
    <Layout TOKEN={props.token} TITLE="Dashboard" LOADING={!data || loading}>
      {/* <Notification
				show={show}
				setShow={setShow}
				msg="Hello"
				intent="primary"
			/> */}

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
      {props.token.uid == 14 && (
        <>
          <input
            type="text"
            className="p-2 m-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMsg(e.target.value);
              }
            }}
          />
          {/* <input type="file" onChange={handleFileUpload} /> */}
        </>
      )}
      {/* RECENT LIST FREIGHT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {data && data.length && (
          <Fragment>
            {data[0].length ? (
              <div className="card h-80 max-h-80 overflow-auto">
                {/*  ------------------- OIM ------------------------  */}
                <div className="p-3 flex justify-between">
                  <div>
                    <h3 className="text-base leading-6 dark:text-white">
                      Ocean Import
                    </h3>
                    <p className="text-xs">
                      Total of {data && data.length ? data[0].length : "0"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  {data[0].map((ga, i) => (
                    <dl
                      className={`${
                        i % 2
                          ? "bg-gray-200 dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-500"
                      } p-2 text-xs text-gray-800 dark:text-white hover:text-white hover:bg-indigo-500 group`}
                      key={i + "oim"}
                    >
                      <a
                        className="flex justify-between hover:text-white"
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          setLoading(true);
                          router.push(`/forwarding/oim/${ga.F_RefNo}`);
                        }}
                      >
                        <dt className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </dt>
                        <dd className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </dd>
                        <dd
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(new Date(ga.F_ETA)).utc(), "days") <
                            0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </dd>
                      </a>
                    </dl>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}

            {data[1].length ? (
              <div className="card h-80 max-h-80 overflow-auto">
                {/*  ------------------- OEX ------------------------  */}
                <div className="p-3 flex justify-between">
                  <div>
                    <h3 className="text-base leading-6 dark:text-white">
                      Ocean Export
                    </h3>
                    <p className="text-xs">
                      Total of {data && data.length ? data[1].length : "0"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  {data[1].map((ga, i) => (
                    <dl
                      className={`${
                        i % 2
                          ? "bg-gray-200 dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-500"
                      } p-2 text-xs text-gray-800 dark:text-white hover:text-white hover:bg-indigo-500 group`}
                      key={i + "oex"}
                    >
                      <a
                        className="flex justify-between hover:text-white"
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          setLoading(true);
                          router.push(`/forwarding/oex/${ga.F_RefNo}`);
                        }}
                      >
                        <dt className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </dt>
                        <dd className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </dd>
                        <dd
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(new Date(ga.F_ETA)).utc(), "days") <
                            0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </dd>
                      </a>
                    </dl>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}

            {data[2].length ? (
              <div className="card h-30 max-h-30 overflow-auto">
                {/*  ------------------- AIM ------------------------  */}
                <div className="p-3 flex justify-between">
                  <div>
                    <h3 className="text-base leading-6 dark:text-white">
                      Air Import
                    </h3>
                    <p className="text-xs">
                      Total of {data && data.length ? data[2].length : "0"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  {data[2].map((ga, i) => (
                    <dl
                      className={`${
                        i % 2
                          ? "bg-gray-200 dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-500"
                      } p-2 text-xs text-gray-800 dark:text-white hover:text-white hover:bg-indigo-500 group`}
                      key={i + "aim"}
                    >
                      <a
                        className="flex justify-between hover:text-white"
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          setLoading(true);
                          router.push(`/forwarding/aim/${ga.F_RefNo}`);
                        }}
                      >
                        <dt className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </dt>
                        <dd className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </dd>
                        <dd
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(new Date(ga.F_ETA)).utc(), "days") <
                            0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </dd>
                      </a>
                    </dl>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}

            {data[3].length ? (
              <div className="card h-30 max-h-30 overflow-auto">
                {/*  ------------------- AIM ------------------------  */}
                <div className="p-3 flex justify-between">
                  <div>
                    <h3 className="text-base leading-6 dark:text-white">
                      Air Export
                    </h3>
                    <p className="text-xs">
                      Total of {data && data.length ? data[3].length : "0"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  {data[3].map((ga, i) => (
                    <dl
                      className={`${
                        i % 2
                          ? "bg-gray-200 dark:bg-gray-800"
                          : "bg-gray-50 dark:bg-gray-500"
                      } p-2 text-xs text-gray-800 dark:text-white hover:text-white hover:bg-indigo-500 group`}
                      key={i + "aex"}
                    >
                      <a
                        className="flex justify-between hover:text-white"
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          setLoading(true);
                          router.push(`/forwarding/aex/${ga.F_RefNo}`);
                        }}
                      >
                        <dt className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </dt>
                        <dd className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </dd>
                        <dd
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(new Date(ga.F_ETA)).utc(), "days") <
                            0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </dd>
                      </a>
                    </dl>
                  ))}
                </div>
              </div>
            ) : (
              <></>
            )}

            <Checkout />
          </Fragment>
        )}
      </div>

      {/* <div className="card h-80 max-h-80 overflow-auto">
          <div className="p-3 flex justify-between">
            <div>
              <h3 className="text-base leading-6">Ocean Import</h3>
              <p className="text-xs">
                Total of {data && data.length ? data[0].length : "0"}
              </p>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {data && data.length ? (
              data[0].map((ga, i) => {
                return (
                  <dl
                    className={`${
                      i % 2 ? "bg-gray-200" : "bg-gray-50"
                    } p-2 text-xs text-gray-800 hover:text-white hover:bg-indigo-500 group`}
                    key={i + "ocean"}
                  >
                    <Link href={`/forwarding/oim/${ga.F_RefNo}`}>
                      <a
                        className="flex justify-between hover:text-white"
                        style={{ textDecoration: "none" }}
                      >
                        <dt className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </dt>
                        <dd className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </dd>
                        <dd
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(ga.F_ETA).utc(), "days") < 0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </dd>
                      </a>
                    </Link>
                  </dl>
                );
              })
            ) : (
              <div className="mt-2 text-danger text-xs">No Result</div>
            )}
          </div>
        </div> */}
      {/* <div className="card shadow h-80 p-3 h-50 max-h-80 overflow-auto">
          <div className="px-4 py-3 sm:px-6">
            <h3 className="text-base leading-6 font-medium text-gray-900">
              Ocean Import
            </h3>
          </div>
          <ul className="px-0 divide-y divide-gray-300">
            {data && data.length ? (
              data[0].map((ga, i) => {
                return (
                  <li
                    className="px-2 py-1 hover:bg-gray-200 focus:ring-2 focus:ring-blue-600"
                    key={i + "oim"}
                  >
                    <Link href={`/forwarding/oim/${ga.F_RefNo}`}>
                      <a
                        className="flex justify-between"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </span>
                        <span className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </span>
                        <span
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(ga.F_ETA).utc(), "days") < 0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              })
            ) : (
              <div className="mt-2 text-danger text-xs">No Result</div>
            )}
          </ul>
        </div> */}

      {/*  ------------------- OEX ------------------------  */}

      {/* <div className="card shadow h-100 p-3">
          <ul className="px-0 divide-y divide-gray-300">
            {data && data.length ? (
              data[1].map((ga, i) => {
                return (
                  <li
                    className="px-2 py-1 hover:bg-gray-200 focus:ring-2 focus:ring-blue-600"
                    key={i + "oex"}
                  >
                    <Link href={`/forwarding/oex/${ga.F_RefNo}`}>
                      <a
                        className="flex justify-between"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </span>
                        <span className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </span>
                        <span
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(ga.F_ETA).utc(), "days") < 0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              })
            ) : (
              <div className="mt-2 text-danger text-xs">No Result</div>
            )}
          </ul>
        </div> */}

      {/*  ------------------- AIM ------------------------  */}

      {/* <div className="card shadow h-100 p-3">
          <ul className="px-0 divide-y divide-gray-300">
            {data && data.length ? (
              data[2].map((ga, i) => {
                return (
                  <li
                    className="px-2 py-1 hover:bg-gray-200 focus:ring-2 focus:ring-blue-600"
                    key={i + "aim"}
                  >
                    <Link href={`/forwarding/aim/${ga.F_RefNo}`}>
                      <a
                        className="flex justify-between"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </span>
                        <span className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </span>
                        <span
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(ga.F_ETA).utc(), "days") < 0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              })
            ) : (
              <div className="mt-2 text-danger text-xs">No Result</div>
            )}
          </ul>
        </div> */}

      {/*  ------------------- AEX ------------------------  */}

      {/* <div className="card shadow h-100 p-3">
          <ul className="px-0 divide-y divide-gray-300">
            {data && data.length ? (
              data[3].map((ga, i) => {
                return (
                  <li
                    className="px-2 py-1 hover:bg-gray-200 focus:ring-2 focus:ring-blue-600"
                    key={i + "aex"}
                  >
                    <Link href={`/forwarding/aex/${ga.F_RefNo}`}>
                      <a
                        className="flex justify-between"
                        style={{ textDecoration: "none" }}
                      >
                        <span className="w-1/4 truncate font-semibold">
                          {ga.F_RefNo}
                        </span>
                        <span className="w-1/2 truncate">
                          {ga.Customer || "NO CUSTOMER"}
                        </span>
                        <span
                          className={`font-weight-bold ${
                            moment()
                              .startOf("day")
                              .diff(moment(ga.F_ETA).utc(), "days") < 0
                              ? "text-danger"
                              : "text-primary"
                          }`}
                        >
                          {moment(ga.F_ETA)
                            .utc()
                            .add(1, "days")
                            .startOf("day")
                            .diff(new Date().toDateString(), "days")}
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              })
            ) : (
              <div className="mt-2 text-danger text-xs">No Result</div>
            )}
          </ul>
        </div> */}
    </Layout>
  );
}
