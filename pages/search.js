import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import router from "next/router";
import { Spinner } from "reactstrap";

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    return {
      props: {
        token: token,
        word: query.q || null,
      },
    };
  } catch (err) {
    return {
      props: { token: false },
    };
  }
}
export default function search(props) {
  // const { data: git } = useSWR(
  // 	props.word
  // 		? `https://api.github.com/search/code?q=${decodeURIComponent(
  // 				`${props.word} user:texas000`
  // 		  )}`
  // 		: null
  // );
  const { data: forwarding } = useSWR(
    props.word ? `/api/forwarding/search?q=${props.word}` : null
  );
  const { data: dict } = useSWR(
    props.word
      ? `https://api.dictionaryapi.dev/api/v2/entries/en_US/${encodeURIComponent(
          props.word
        )}`
      : null
  );
  const { data: file } = useSWR(
    props.word ? `/api/file/search?q=${encodeURIComponent(props.word)}` : null
  );
  const { data: company } = useSWR(
    props.word
      ? `/api/company/search?q=${encodeURIComponent(props.word)}`
      : null
  );
  const { data: invoice } = useSWR(
    props.word
      ? `/api/invoice/search?q=${encodeURIComponent(props.word)}`
      : null
  );
  const { data: container } = useSWR(
    props.word
      ? `/api/forwarding/searchContainer?q=${encodeURIComponent(props.word)}`
      : null
  );
  const [collapseShip, setCollapseShip] = useState(false);
  const [collapseFile, setCollapseFile] = useState(false);
  const [collapseInvo, setCollapseInvo] = useState(false);
  const [collapseCont, setCollapseCont] = useState(false);
  return (
    <Layout TOKEN={props.token} TITLE="Search">
      <div className="flex flex-sm-row justify-between">
        <h3 className="dark:text-white">Search</h3>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="px-4 py-3 sm:px-6">
          <h3 className="text-base leading-6 font-medium text-gray-900">
            Shipment
            <p className="text-xs">
              {(forwarding && forwarding.length) || "0"} search results
            </p>
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {forwarding ? (
            forwarding.map((ga, i) => {
              if (i < 10 || (i >= 10 && collapseShip)) {
                return (
                  <dl
                    key={i + "SHIP"}
                    className={`${
                      i % 2 ? "bg-gray-200" : "bg-gray-50"
                    } p-2 text-gray-800 hover:text-white hover:bg-indigo-500 group`}
                  >
                    <Link href={`/forwarding/${ga.Type}/${ga.F_RefNo}`}>
                      <a
                        className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:text-white"
                        style={{
                          textDecoration: "none",
                        }}
                      >
                        <dt className="font-medium">{ga.F_RefNo}</dt>
                        <dd className="sm:mt-0 sm:col-span-2">
                          {ga.Customer || "Customer not found"}
                        </dd>
                      </a>
                    </Link>
                  </dl>
                );
              }
            })
          ) : (
            <div className="text-center">
              <Spinner size="sm" />
            </div>
          )}
        </div>
        {forwarding && forwarding.length > 9 ? (
          <div
            className="text-center hover:bg-indigo-500 hover:text-white cursor-pointer"
            onClick={() => setCollapseShip(!collapseShip)}
          >
            <i
              className={`fa ${
                collapseShip ? "fa-chevron-up" : "fa-chevron-down"
              } `}
            ></i>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-3">
        <div className="px-4 py-3 sm:px-6">
          <h3 className="text-base leading-6 font-medium text-gray-900">
            Files
            <p className="text-xs">
              {(file && file.length) || "0"} search results
            </p>
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {file ? (
            file.map((ga, i) => {
              if (i < 10 || (i >= 10 && collapseFile))
                return (
                  <dl
                    key={i + "FILE"}
                    className={`${
                      i % 2 ? "bg-gray-200" : "bg-gray-50"
                    } p-2 text-gray-800 hover:text-white hover:bg-indigo-500 group`}
                  >
                    <a
                      className="sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6 hover:text-white"
                      onClick={async () => {
                        const data = await fetch(
                          `/api/file/get?ref=${
                            ga.F_REF
                          }&file=${encodeURIComponent(ga.F_FILENAME)}`
                        );
                        const blob = await data.blob();
                        var file = new Blob([blob], {
                          type: blob.type,
                        });
                        var fileURL = URL.createObjectURL(file);
                        // prevent safari browser block new tab open
                        var ua = navigator.userAgent.toLowerCase();
                        if (ua.indexOf("safari") != -1) {
                          if (ua.indexOf("chrome") == -1) {
                            window.location.assign(fileURL);
                          }
                        }
                        window.open(fileURL, "_blank");
                      }}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <dt className="font-medium uppercase">{ga.F_LABEL}</dt>
                      <dd className="sm:mt-0">{ga.F_REF}</dd>
                      <dd className="sm:mt-0 sm:col-span-2">{ga.F_FILENAME}</dd>
                    </a>
                  </dl>
                );
            })
          ) : (
            <div className="text-center">
              <Spinner size="sm" />
            </div>
          )}
        </div>
        {file && file.length > 9 ? (
          <div
            className="text-center hover:bg-indigo-500 hover:text-white cursor-pointer"
            onClick={() => setCollapseFile(!collapseFile)}
          >
            <i
              className={`fa ${
                collapseFile ? "fa-chevron-up" : "fa-chevron-down"
              } `}
            ></i>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-3">
        <div className="px-4 py-3 sm:px-6">
          <h3 className="text-base leading-6 font-medium text-gray-900">
            Invoice
            <p className="text-xs">
              {(invoice && invoice.length) || "0"} search results
            </p>
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {invoice ? (
            invoice.map((ga, i) => {
              if (i < 10 || (i >= 10 && collapseInvo))
                return (
                  <dl
                    key={i + "INVOICE"}
                    className={`${
                      i % 2 ? "bg-gray-200" : "bg-gray-50"
                    } p-2 text-gray-800 hover:text-white hover:bg-indigo-500 group`}
                  >
                    <a
                      className="sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6 hover:text-white"
                      onClick={() => router.push(`/${ga.F_Type}/${ga.F_ID}`)}
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <dt className="font-medium uppercase">
                        {ga.F_Type} - {ga.F_InvoiceNo}
                      </dt>
                    </a>
                  </dl>
                );
            })
          ) : (
            <div className="text-center">
              <Spinner size="sm" />
            </div>
          )}
        </div>
        {invoice && invoice.length > 9 ? (
          <div
            className="text-center hover:bg-indigo-500 hover:text-white cursor-pointer"
            onClick={() => setCollapseInvo(!collapseInvo)}
          >
            <i
              className={`fa ${
                collapseInvo ? "fa-chevron-up" : "fa-chevron-down"
              } `}
            ></i>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-3">
        <div className="px-4 py-3 sm:px-6">
          <h3 className="text-base leading-6 font-medium text-gray-900">
            Container
            <p className="text-xs">
              {(container && container.length) || "0"} search results
            </p>
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {container ? (
            container.map((ga, i) => {
              if (i < 10 || (i >= 10 && collapseCont))
                return (
                  <dl
                    key={i + "CONTAINER"}
                    className={`${
                      i % 2 ? "bg-gray-200" : "bg-gray-50"
                    } p-2 text-gray-800 hover:text-white hover:bg-indigo-500 group`}
                  >
                    <a
                      className="sm:grid sm:grid-cols-1 sm:gap-4 sm:px-6 hover:text-white"
                      onClick={() =>
                        router.push(`/forwarding/${ga.Link}/${ga.RefNo}`)
                      }
                      style={{
                        textDecoration: "none",
                      }}
                    >
                      <dt className="font-medium uppercase">
                        {`${ga.F_ContainerNo} ${
                          ga.F_SealNo ? `SEAL# ${ga.F_SealNo}` : ""
                        }`}
                      </dt>
                    </a>
                  </dl>
                );
            })
          ) : (
            <div className="text-center">
              <Spinner size="sm" />
            </div>
          )}
        </div>
        {container && container.length > 9 ? (
          <div
            className="text-center hover:bg-indigo-500 hover:text-white cursor-pointer"
            onClick={() => setCollapseCont(!collapseCont)}
          >
            <i
              className={`fa ${
                collapseCont ? "fa-chevron-up" : "fa-chevron-down"
              } `}
            ></i>
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-3">
        <div className="px-4 py-3 sm:px-6">
          <h3 className="text-base leading-6 font-medium text-gray-900">
            Company
            <p className="text-xs">
              {(company && company.length) || "0"} search results
            </p>
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {company ? (
            company.map((ga, i) => (
              <dl
                key={i + "COMPANY"}
                className={`${
                  i % 2 ? "bg-gray-200" : "bg-gray-50"
                } p-2 text-gray-800 hover:text-white hover:bg-indigo-500`}
              >
                <Link href={`/company/${ga.F_ID}`}>
                  <a
                    className="hover:text-white"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <dt className="px-2 font-medium uppercase block w-100">
                      {ga.F_SName}
                    </dt>
                  </a>
                </Link>
              </dl>
            ))
          ) : (
            <div className="text-center">
              <Spinner size="sm" />
            </div>
          )}
        </div>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl my-3">
        <div className="px-4 py-3 sm:px-6">
          <h3 className="text-base leading-6 font-medium text-gray-900">
            Dictionary
            <p className="text-xs">
              {(dict && dict.length) || "0"} search results
            </p>
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {dict &&
            dict.length &&
            dict.map((na, j) => (
              <dl
                key={j + "LIST"}
                className={`${j % 2 ? "bg-gray-200" : "bg-gray-50"} p-3`}
              >
                <h5 className="text-lg">{na.word}</h5>
                {na.meanings.length &&
                  na.meanings.map((ga, i) => (
                    <div
                      className={`px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}
                      key={j + i + "DICT"}
                    >
                      <dt className="text-sm font-medium text-gray-500">
                        {ga.partOfSpeech}
                      </dt>
                      {ga.definitions.map((da, k) => (
                        <dd
                          className={`mt-1 text-sm text-gray-900 sm:mt-0 ${
                            k ? "col-span-2 col-start-2" : "col-span-2"
                          }`}
                          key={k + j + i}
                        >
                          {da.definition}
                        </dd>
                      ))}
                    </div>
                  ))}
              </dl>
            ))}
        </div>
      </div>
    </Layout>
  );
}
