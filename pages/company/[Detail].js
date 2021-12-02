import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import CalculatedType from "../../components/Company/CalculatedType";
import CompanyInfo from "../../components/Company/CompanyInfo";
import CompanyBalance from "../../components/Company/CompanyBalance";
import CompanyFile from "../../components/Company/CompanyFile";
import CompanyRecentPayment from "../../components/Company/CompanyRecentPayment";
import CompanyContact from "../../components/Company/CompanyContact";
import Comments from "../../components/Utils/Comment";

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    return {
      props: {
        token: token,
        q: query.Detail,
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

export default function company({ token, q }) {
  const { data } = useSWR(`/api/company/detail?q=${q}`);
  const { data: balance } = useSWR(`/api/company/balance?q=${q}`);
  const { data: count } = useSWR(`/api/company/accountingCount?q=${q}`);
  const { data: depo } = useSWR(`/api/company/getAccountingHistory?q=${q}`);
  const { data: pendingSum } = useSWR(`/api/company/pendingByTerms?q=${q}`);
  const router = useRouter();
  if (typeof window !== "undefined" && data) {
    // Define an empty array
    var arr = [];
    // Initial value is null value but change to empty array string
    var history = localStorage.getItem("pageHistory");
    // If the page history is empty
    if (history == null) {
      arr.unshift({
        path: router.asPath,
        ref: data ? data.F_FName : q,
      });
      localStorage.setItem("pageHistory", JSON.stringify(arr));
    } else {
      arr = JSON.parse(history);
      // If the page history is exist, check the most recent history
      // If the reference is same as current reference, do not store data
      if (arr[0].ref != (data ? data.F_FName : q)) {
        arr.unshift({
          path: router.asPath,
          ref: data ? data.F_FName : q,
        });
        localStorage.setItem("pageHistory", JSON.stringify(arr));
      }
    }
  }
  return (
    <Layout
      TOKEN={token}
      TITLE={data ? data.F_FName : "Company not found"}
      LOADING={!data}
    >
      {data ? (
        data.error ? (
          <section className="flex items-center justify-center py-10 text-white sm:py-16 md:py-24 lg:py-32">
            <div className="relative max-w-3xl px-10 text-center text-white auto lg:px-0">
              <div className="flex justify-between">
                <h1 className="relative flex flex-col text-6xl font-extrabold text-left text-black">
                  Company
                  <span>Not</span>
                  <span>Found</span>
                </h1>
              </div>
              <div className="my-16 border-b border-gray-300 lg:my-24"></div>
              <h2 className="text-left text-gray-500 xl:text-xl"></h2>
            </div>
          </section>
        ) : (
          <div>
            <div className="flex flex-row items-center">
              <h3 className="dark:text-white mr-2">{data.F_FName}</h3>
              <CalculatedType count={count} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-3">
              <CompanyInfo data={data} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 my-3">
              <CompanyBalance
                balance={balance}
                pendingSum={pendingSum}
                id={q}
              />
              <CompanyFile id={q} />
              <CompanyRecentPayment depo={depo} />
              <CompanyContact contact={data && data.contact} />
            </div>
            <Comments tbname="T_COMPANY" tbid={data?.F_ID} uid={token.uid} />
          </div>
        )
      ) : (
        <Fragment />
      )}
    </Layout>
  );
}
