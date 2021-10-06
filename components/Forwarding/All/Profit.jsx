import { Classes, Dialog, Button, Checkbox } from "@blueprintjs/core";
import moment from "moment";
import { useEffect, useState } from "react";
import axios, { post } from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Select from "react-select";
import { Spinner } from "reactstrap";
import usdFormat from "../../../lib/currencyFormat";

export const Profit = ({
  invoice,
  ap,
  crdr,
  profit,
  TOKEN,
  Reference,
  customer,
}) => {
  const { data, mutate } = useSWR("/api/file/list?ref=" + Reference);
  const { data: apRequest } = useSWR("/api/requests/get?ref=" + Reference);

  const [selected, setSelected] = useState(false);
  // const [file, setFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [type, setType] = useState(false);
  const [arType, setArtype] = useState(false);
  const [crType, setCrtype] = useState(false);
  const [apType, setAptype] = useState(false);
  const [memo, setMemo] = useState(false);
  const [autosend, setAutosend] = useState(1);

  const [invoiceReq, setInvoiceReq] = useState(false);
  const { data: invoiceDetail } = useSWR(
    invoiceReq ? `/api/requests/getInvoiceDetail?id=${invoiceReq.F_ID}` : null
  );
  const { data: invRequest } = useSWR(
    invoiceReq
      ? `/api/requests/getInvoiceRequestDetail?tbid=${invoiceReq.F_ID}`
      : null
  );

  const { data: payableDetail } = useSWR(
    selected
      ? `/api/requests/getAccountPayableDetail?id=${selected.F_ID}`
      : null
  );

  const [submitLoading, setSubmitLoading] = useState(false);

  const arfiles = [
    { level: 10, value: "isf", label: "ISF" },
    { level: 10, value: "hbl", label: "House B/L" },
    { level: 10, value: "packing", label: "Packing List" },
    { level: 10, value: "invoice", label: "Commercial Invoice" },
    { level: 10, value: "customs", label: "Customs Document" },
    { level: 10, value: "pod", label: "Proof of delivery" },
    { level: 10, value: "quote", label: "Quotation" },
    { level: 10, value: "others", label: "Others" },
  ];
  const crdrfiles = [
    { level: 20, value: "debit", label: "Debit Note" },
    { level: 20, value: "credit", label: "Credit Note" },
    { level: 20, value: "others", label: "Others" },
  ];
  const apfiles = [
    { level: 30, value: "mbl", label: "Master B/L" },
    { level: 30, value: "truck", label: "Trucking Invoice" },
    { level: 30, value: "do", label: "Delivery Order" },
    { level: 30, value: "an", label: "Carrier Arrival Notice" },
    { level: 30, value: "cinvoice", label: "Customs Invoice" },
    { level: 30, value: "others", label: "Others" },
  ];

  const Status = ({ data }) => {
    if (data == 101) {
      return <span>Current Status: Requested</span>;
    }
    if (data == 110) {
      return <span>Current Status: Director Rejected</span>;
    }
    if (data == 111) {
      return <span>Current Status: Director Approved</span>;
    }
    if (data == 120) {
      return <span>Current Status: Account Rejected</span>;
    }
    if (data == 121) {
      return <span>Current Status: Account Approved</span>;
    }
  };

  useEffect(() => {
    // WHEN THE REFERENCE CHANGED, RESET SELECTED FILE
    setSelectedFile([]);
  }, [Reference]);

  const router = useRouter();

  async function handleInvoiceRequest() {
    // console.log(invoiceReq);
    // console.log(memo);
    // console.log(selectedFile);
    setSubmitLoading(true);
    const invoiceRequest = await fetch("/api/requests/postInvoiceRequest", {
      method: "POST",
      body: JSON.stringify({
        invoiceReq,
        memo,
        selectedFile,
        fileNames,
        Reference,
        autosend,
        path: router.asPath,
      }),
    });

    if (invoiceRequest.status == 200) {
      console.log(await invoiceRequest.json());
      setInvoiceReq(false);
      setSelectedFile([]);
      setFileNames([]);
      setSubmitLoading(false);
      alert("Requested, Thank you!");
    } else {
      console.log(invoiceRequest.status);
      setSubmitLoading(false);
    }
  }
  // Director update the invoice request
  async function handleInvoiceUpdate(approve, id) {
    setSubmitLoading(true);
    const invoiceUpdate = await fetch(
      `/api/requests/updateInvoice?id=${id}&approve=${approve}`,
      {
        method: "POST",
      }
    );

    if (invoiceUpdate.status == 200) {
      console.log(await invoiceUpdate.json());
      setInvoiceReq(false);
      setSubmitLoading(false);
      alert("Updated, Thank you!");
    } else {
      console.log(invoiceUpdate.status);
      setSubmitLoading(false);
    }
  }

  async function handleSendInvoice(invoice) {
    console.log(invoice);
  }

  async function postReq(body) {
    setSubmitLoading(true);
    const req = await fetch("/api/requests/postRequest", {
      method: "POST",
      headers: {
        ref: Reference,
        token: JSON.stringify(TOKEN),
      },
      body: JSON.stringify({
        ...body,
        file: selectedFile,
        filenames: fileNames,
        type: type,
        customer: customer,
        path: router.asPath,
      }),
    });
    if (req.status === 200) {
      setSubmitLoading(false);
      setSelectedFile([]);
      setFileNames([]);
      setSelected(false);
      setSubmitLoading(false);
      alert("Requested, Thank you!");
    } else {
      setSelectedFile([]);
      setFileNames([]);
      alert(req.status);
      setSubmitLoading(false);
    }
  }
  var arTotal = null;
  var crdrTotal = null;
  var apTotal = null;
  for (var i = 0; i < invoice.length; i++) {
    arTotal += invoice[i].F_PaidAmt;
  }
  for (var i = 0; i < crdr.length; i++) {
    crdrTotal += crdr[i].F_PaidAmt;
  }
  for (var i = 0; i < ap.length; i++) {
    apTotal += ap[i].F_PaidAmt;
  }

  function handleUpload(e) {
    var labels, levels;
    if (e.target.id == "crdr") {
      if (!crType) {
        alert("PLEASE SELECT FILE TYPE");
        return;
      }
      labels = crType.value;
      levels = crType.level;
    }
    if (e.target.id == "invoice") {
      if (!arType) {
        alert("PLEASE SELECT FILE TYPE");
        return;
      }
      labels = arType.value;
      levels = arType.level;
    }
    if (e.target.id == "ap") {
      if (!apType) {
        alert("PLEASE SELECT FILE TYPE");
        return;
      }
      labels = apType.value;
      levels = apType.level;
    }

    var uploadedFile = e.target.files[0];
    if (uploadedFile) {
      const formData = new FormData();
      formData.append("userPhoto", uploadedFile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          label: labels,
          level: levels,
        },
      };
      try {
        const upload = new Promise((res, rej) => {
          try {
            res(post(`/api/file/upload?ref=${Reference}`, formData, config));
          } catch (err) {
            console.log(err);
            res("uploaded");
          }
        });
        upload.then((ga) => {
          if (ga.status === 200) {
            mutate();
          } else {
            console.log(ga.status);
          }
        });
      } catch (err) {
        if (err.response) {
          console.log(err.response);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log(err);
        }
      }
    }
  }

  return (
    <div className="card my-4 py-4 shadow">
      <div className="row px-4 py-2">
        <div className="col-12">
          <h4 className="text-xl mb-4">SUMMARY</h4>
          {profit &&
            profit.map((ga, i) => (
              <div key={i + "PROFIT"}>
                <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-4">
                  {/* AR */}
                  <div>
                    {/* AR SUMMARY */}
                    <div
                      className={`${
                        arTotal != null && arTotal / ga.F_AR == 1
                          ? "bg-blue-400"
                          : "bg-gray-400"
                      } w-100 text-white rounded-sm px-3 py-1`}
                    >
                      <div className="flex justify-between">
                        <span>AR</span>
                        <span>{usdFormat(ga.F_AR)}</span>
                      </div>
                    </div>
                    {/* INVOICE LIST */}
                    <div className="grid grid-col-3 gap-2">
                      <div className="col-start-2 col-span-2">
                        {invoice &&
                          invoice.map((ga) => (
                            <div
                              className={`${
                                ga.F_InvoiceAmt == ga.F_PaidAmt &&
                                ga.F_InvoiceAmt != 0
                                  ? "bg-blue-400"
                                  : "bg-gray-400"
                              } px-2 py-1 text-white cursor-pointer bg-blue-500 rounded-sm font-light my-1 hover:bg-blue-600`}
                              key={ga.F_ID + "INVO"}
                              onClick={() => setInvoiceReq(ga)}
                              //   onClick={() =>
                              //     router.push(`/invoice/${ga.F_InvoiceNo}`)
                              //   }
                            >
                              <div className="flex justify-between">
                                <span>{ga.F_InvoiceNo}</span>
                                <span className="font-bold">
                                  {usdFormat(ga.F_InvoiceAmt)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    {/* FILE UPLOAD */}
                    <form className="upload mt-4 font-light text-sm">
                      <Select
                        options={arfiles}
                        className="py-0"
                        onChange={(e) => setArtype(e)}
                        defaultValue={{ value: 0, label: "SELECT TYPE" }}
                      />
                      <div className="input-group z-0 h-20 my-2">
                        <div className="custom-file">
                          <input
                            type="file"
                            id="invoice"
                            className="custom-file-input"
                            onChange={handleUpload}
                          />
                          <label className="custom-file-label font-light">
                            Choose file
                          </label>
                        </div>
                      </div>
                    </form>
                    {/* DISPLAY FILE */}
                    {!data ? (
                      <Spinner />
                    ) : !data.length ? (
                      <div></div>
                    ) : (
                      data.map((ga) => {
                        if (ga.F_SECURITY == 10) {
                          return (
                            <button
                              key={ga.F_ID + "FILE"}
                              className="w-100 my-1 bg-white dark:bg-gray-700 dark:text-white text-gray-700 font-medium py-2 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                              onClick={async () => {
                                window.location.assign(
                                  `/api/file/get?ref=${Reference}&file=${encodeURIComponent(
                                    ga.F_FILENAME
                                  )}`
                                );
                              }}
                            >
                              <div className="flex justify-between font-semibold text-xs">
                                <span className="text-uppercase inline-block">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline mr-1"
                                  >
                                    <path
                                      className="fill-current"
                                      d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
                                    />
                                    <path
                                      className="fill-current"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
                                    />
                                  </svg>
                                  {ga.F_LABEL}
                                </span>
                                <span
                                  className="text-truncate"
                                  style={{
                                    maxWidth: "180px",
                                  }}
                                >
                                  {ga.F_FILENAME}
                                </span>
                              </div>
                            </button>
                          );
                        }
                      })
                    )}
                  </div>
                  {/* CRDR */}
                  <div>
                    {/* CRDR SUMMARY */}
                    <div
                      className={`${
                        crdrTotal != null && crdrTotal / ga.F_CrDr == 1
                          ? "bg-blue-400"
                          : "bg-gray-400"
                      } w-100 text-white rounded-sm mr-4 px-3 py-1`}
                    >
                      <div className="flex justify-between">
                        <span>CRDR</span>
                        <span>{usdFormat(ga.F_CrDr)}</span>
                      </div>
                    </div>
                    {/* CRDR LIST */}
                    <div className="grid grid-col-3 gap-2">
                      <div className="col-start-2 col-span-2">
                        {crdr &&
                          crdr.map((ga) => (
                            <div
                              className={`${
                                ga.F_Total == ga.F_PaidAmt && ga.F_Total != 0
                                  ? "bg-blue-400"
                                  : "bg-gray-400"
                              } px-2 py-1 text-white cursor-not-allowed bg-blue-500 rounded-sm font-light my-1 hover:bg-blue-600`}
                              key={ga.F_ID + "CRDR"}
                              // onClick={() => setInvoiceReq(ga)}
                            >
                              <div className="flex justify-between">
                                <span>{ga.F_CrDbNo}</span>
                                <span className="font-bold">
                                  {usdFormat(ga.F_Total)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    {/* FILE UPLOAD */}
                    <form className="upload mt-4 font-light text-sm">
                      <Select
                        options={crdrfiles}
                        className="py-0"
                        onChange={(e) => setCrtype(e)}
                        defaultValue={{ value: 0, label: "SELECT TYPE" }}
                      />
                      <div className="input-group my-2" style={{ zIndex: "0" }}>
                        <div className="custom-file w-75">
                          <input
                            type="file"
                            id="crdr"
                            className="custom-file-input"
                            onChange={handleUpload}
                          />
                          <label className="custom-file-label">
                            Choose file
                          </label>
                        </div>
                      </div>
                    </form>
                    {/* DISPLAY FILE */}
                    {!data ? (
                      <Spinner />
                    ) : !data.length ? (
                      <div></div>
                    ) : (
                      data.map((ga) => {
                        if (ga.F_SECURITY == 20) {
                          return (
                            <button
                              key={ga.F_ID + "FILE"}
                              className="w-100 my-1 bg-white dark:bg-gray-700 dark:text-white text-gray-700 font-medium py-2 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                              onClick={async () => {
                                window.location.assign(
                                  `/api/file/get?ref=${Reference}&file=${encodeURIComponent(
                                    ga.F_FILENAME
                                  )}`
                                );
                              }}
                            >
                              <div className="flex justify-between font-semibold text-xs">
                                <span className="text-uppercase inline-block">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline mr-1"
                                  >
                                    <path
                                      className="fill-current"
                                      d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
                                    />
                                    <path
                                      className="fill-current"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
                                    />
                                  </svg>
                                  {ga.F_LABEL}
                                </span>
                                <span
                                  className="text-truncate"
                                  style={{
                                    maxWidth: "180px",
                                  }}
                                >
                                  {ga.F_FILENAME}
                                </span>
                              </div>
                            </button>
                          );
                        }
                      })
                    )}
                  </div>
                  {/* AP */}
                  <div>
                    {/* AP SUMMARY */}
                    <div
                      className={`${
                        apTotal != null && apTotal / ga.F_AP == 1
                          ? "bg-blue-400"
                          : "bg-gray-400"
                      } w-100 text-white rounded-sm mr-4 px-3 py-1`}
                    >
                      <div className="flex justify-between">
                        <span>AP</span>
                        <span>{usdFormat(ga.F_AP)}</span>
                      </div>
                    </div>
                    {/* AP LIST */}
                    <div className="grid grid-col-3 gap-2">
                      <div className="col-start-2 col-span-2">
                        {ap &&
                          ap.map((ga) => (
                            <div
                              className={`${
                                ga.F_InvoiceAmt == ga.F_PaidAmt &&
                                ga.F_InvoiceAmt != 0
                                  ? "bg-blue-400"
                                  : "bg-gray-400"
                              } px-2 py-1 text-white cursor-pointer bg-blue-500 rounded-sm font-light my-1 hover:bg-blue-600`}
                              key={ga.F_ID + "AP"}
                              onClick={() => setSelected(ga)}
                            >
                              <div className="flex justify-between">
                                <span className="truncate w-32">
                                  {ga.VENDOR}
                                </span>
                                <span className="font-bold">
                                  {usdFormat(ga.F_InvoiceAmt)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    {/* FILE UPLOAD */}
                    <form className="upload mt-4 font-light text-sm">
                      <Select
                        options={apfiles}
                        className="py-0"
                        onChange={(e) => setAptype(e)}
                        defaultValue={{ value: 0, label: "SELECT TYPE" }}
                      />
                      <div className="input-group my-2" style={{ zIndex: "0" }}>
                        <div className="custom-file w-75">
                          <input
                            type="file"
                            id="ap"
                            className="custom-file-input"
                            onChange={handleUpload}
                          />
                          <label className="custom-file-label">
                            Choose file
                          </label>
                        </div>
                      </div>
                    </form>
                    {/* DISPLAY FILE */}
                    {!data ? (
                      <div></div>
                    ) : !data.length ? (
                      <div></div>
                    ) : (
                      data.map((ga) => {
                        if (ga.F_SECURITY == 30) {
                          return (
                            <button
                              key={ga.F_ID + "FILE"}
                              className="w-100 my-1 bg-white dark:bg-gray-700 dark:text-white text-gray-700 font-medium py-2 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
                              onClick={async () => {
                                window.location.assign(
                                  `/api/file/get?ref=${Reference}&file=${encodeURIComponent(
                                    ga.F_FILENAME
                                  )}`
                                );
                              }}
                            >
                              <div className="flex justify-between font-semibold text-xs">
                                <span className="text-uppercase inline-block">
                                  <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="inline mr-1"
                                  >
                                    <path
                                      className="fill-current"
                                      d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
                                    />
                                    <path
                                      className="fill-current"
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
                                    />
                                  </svg>
                                  {ga.F_LABEL}
                                </span>
                                <span
                                  className="text-truncate"
                                  style={{
                                    maxWidth: "180px",
                                  }}
                                >
                                  {ga.F_FILENAME}
                                </span>
                              </div>
                            </button>
                          );
                        }
                      })
                    )}
                  </div>
                  {/* TOTAL */}
                  <div>
                    <div
                      className={`${
                        ((arTotal || 0) - (apTotal || 0) + (crdrTotal || 0)) /
                          (ga.F_HouseTotal || ga.F_MasterTotal) ==
                        1
                          ? "bg-blue-400"
                          : "bg-gray-400"
                      } w-100 text-white rounded-sm mr-4 px-3 py-1`}
                    >
                      <div className="flex justify-between">
                        <span>TOTAL</span>
                        <span>
                          {usdFormat(ga.F_HouseTotal || ga.F_MasterTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {apRequest && apRequest.length ? (
            <div className="w-100">
              <h4 className="text-xl my-4">REQUEST</h4>
              {apRequest.map((ga) => (
                <div key={ga.ID}>
                  <div className="my-1">
                    <div className="flex justify-between bg-white dark:bg-gray-700 dark:text-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100">
                      <div className="flex flex-row">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="fill-current mr-1"
                        >
                          <path d="M7.48334 5.25942C6.33891 5.38732 5.42286 6.29057 5.29045 7.42268C4.93476 10.4638 4.93476 13.5361 5.29045 16.5772C5.42286 17.7093 6.33891 18.6126 7.48334 18.7405C10.4602 19.0732 13.5398 19.0732 16.5166 18.7405C17.6611 18.6126 18.5771 17.7093 18.7095 16.5772C18.9651 14.3921 19.037 12.1909 18.9253 9.99668C18.9224 9.94002 18.9436 9.88475 18.9837 9.84463L20.0225 8.80585C20.1427 8.68562 20.3482 8.7608 20.3609 8.93036C20.557 11.5353 20.5031 14.1543 20.1994 16.7515C19.9845 18.5884 18.5096 20.0271 16.6832 20.2312C13.5957 20.5763 10.4043 20.5763 7.31673 20.2312C5.49035 20.0271 4.01545 18.5884 3.8006 16.7515C3.43137 13.5945 3.43137 10.4053 3.8006 7.24843C4.01545 5.41146 5.49035 3.97282 7.31673 3.7687C10.4043 3.42362 13.5957 3.42362 16.6832 3.7687C17.3265 3.84059 17.9261 4.06562 18.4425 4.40725C18.5441 4.47448 18.5542 4.61732 18.468 4.70346L17.6652 5.50635C17.5995 5.57202 17.4976 5.58307 17.4158 5.5392C17.1423 5.39271 16.8385 5.29539 16.5166 5.25942C13.5398 4.92671 10.4602 4.92671 7.48334 5.25942Z" />
                          <path d="M21.0303 6.03028C21.3232 5.73738 21.3232 5.26251 21.0303 4.96962C20.7374 4.67672 20.2625 4.67672 19.9696 4.96962L11.5 13.4393L9.0303 10.9696C8.73741 10.6767 8.26253 10.6767 7.96964 10.9696C7.67675 11.2625 7.67675 11.7374 7.96964 12.0303L10.9696 15.0303C11.2625 15.3232 11.7374 15.3232 12.0303 15.0303L21.0303 6.03028Z" />
                        </svg>
                        <span>{ga.Title}</span>
                      </div>
                      <Status data={ga.Status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* ACCOUNT PAYABLE DIALOG */}
      <Dialog
        isOpen={selected}
        onClose={() => {
          setSelected(false);
          setType(false);
          setSelectedFile([]);
          setFileNames([]);
        }}
        title="Request Approval"
        className="dark:bg-gray-600"
      >
        <div className={Classes.DIALOG_BODY}>
          {apRequest &&
            apRequest.map((ga) => {
              if (ga.Title == selected.F_InvoiceNo) {
                return (
                  <div className="card p-2 bg-indigo-200" key={ga.ID}>
                    <div className="flex justify-between">
                      <Status data={ga.Status} />
                      <span>{moment(ga.CreateAt).format("L")}</span>
                    </div>
                  </div>
                );
              }
            })}
          <div className="card my-2">
            <div className="d-flex font-bold bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
              <span>{selected.F_InvoiceNo}</span>
            </div>
            <div className="p-2">
              <div className="pl-2 font-bold text-lg">
                Account Payable Summary
              </div>
              <ul className="my-2 px-2 divide-y divide-gray-300 rounded border border-gray-100">
                <li className="flex justify-between py-2">
                  <span>Due Date</span>
                  <span>{moment(selected.F_DueDate).utc().format("L")}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Payable To</span>
                  <span>{selected.VENDOR}</span>
                </li>
                {/* <li className="flex justify-between py-2">
                  <span>Invoice To</span>
                  <span>{selected.BILLTO}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Ship To</span>
                  <span>{selected.SHIPTO}</span>
                </li> */}
                <li className="flex justify-between py-2">
                  <span>Description</span>
                  <span>{selected.F_Descript}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Payable Amount</span>
                  <span>
                    {usdFormat(selected.F_InvoiceAmt)} {selected.F_Currency}
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Paid Amount</span>
                  <span>
                    {usdFormat(selected.F_PaidAmt)} {selected.F_Currency}
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Balance Amount</span>
                  <span className="font-semibold">
                    {usdFormat(
                      selected.F_InvoiceAmt - (selected.F_PaidAmt || 0)
                    )}{" "}
                    {selected.F_Currency}
                  </span>
                </li>
              </ul>
              <div className="pl-2 font-bold text-lg">
                Account Payable Detail
              </div>
              <ul className="my-2 px-2 divide-y divide-gray-300 rounded border border-gray-100">
                {payableDetail &&
                  payableDetail.map((ga) => (
                    <li
                      className="flex justify-between py-2 text-gray-500"
                      key={ga.F_ID}
                    >
                      <span>{ga.F_Description}</span>
                      <span className="font-semibold">
                        {usdFormat(ga.F_Amount)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="leading-8 p-3">
              <div className="form-group mb-4">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="type"
                >
                  Account Payable Type <span className="text-red-600">*</span>
                </label>
                <select
                  className="form-control"
                  id="type"
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value={false}>Please select type</option>
                  <option value="check">Check</option>
                  <option value="card">Card</option>
                  <option value="ach">ACH</option>
                  <option value="wire">Wire</option>
                </select>

                <label className="block text-gray-700 text-sm font-semibold mb-2 mt-4">
                  Supporting File <span className="text-red-600">*</span>
                </label>

                {data &&
                  data.map((ga) => {
                    if (ga.F_SECURITY == "30") {
                      return (
                        <Checkbox
                          key={ga.F_ID + "CHECK"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFile((prev) => [...prev, ga.F_ID]);
                              setFileNames((prev) => [...prev, ga.F_FILENAME]);
                            } else {
                              var arr = [...selectedFile];
                              var index = arr.indexOf(ga.F_ID);
                              if (index !== -1) {
                                arr.splice(index, 1);
                                setSelectedFile(arr);
                              }
                              var nameArr = [...fileNames];
                              var nameIndex = nameArr.indexOf(ga.F_FILENAME);
                              if (nameIndex !== -1) {
                                nameArr.splice(nameIndex, 1);
                                setFileNames(nameArr);
                              }
                            }
                          }}
                          label={`[${ga.F_LABEL.toUpperCase()}] ${
                            ga.F_FILENAME
                          }`}
                        ></Checkbox>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button
            text="Confirm"
            fill={true}
            loading={submitLoading}
            onClick={() => postReq(selected)}
            disabled={
              !selectedFile.length ||
              type == false ||
              type == "false" ||
              submitLoading
            }
          />
          {/* WHEN REQUEST HAPPEN, UPLOAD TO DATABASE AND SEND THE NOTIFICATION TO IAN */}
        </div>
      </Dialog>

      {/* INVOICE REQ DIALOG */}
      <Dialog
        isOpen={invoiceReq}
        onClose={() => {
          setInvoiceReq(false);
          setSelectedFile([]);
          setFileNames([]);
        }}
        title="Request Invoice Approval"
        className="dark:bg-gray-600 w-50"
      >
        <div className={Classes.DIALOG_BODY}>
          {invRequest &&
            invRequest[0] &&
            invRequest[0].map((ga) => (
              <div className="card p-2 mb-2" key={ga.ID}>
                <div className="flex justify-between font-semibold">
                  <Status data={ga.STATUS} />
                  <span>{moment(ga.CREATED).format("L")}</span>
                </div>
                <div>{ga.MESSAGE}</div>
                <div className="flex justify-between mt-2">
                  <Button
                    text="Approve"
                    fill={true}
                    disabled={submitLoading || TOKEN.admin != 6}
                    loading={submitLoading}
                    onClick={() => handleInvoiceUpdate(true, ga.ID)}
                    small={true}
                  />
                  <Button
                    text="Reject"
                    fill={true}
                    minimal={true}
                    disabled={submitLoading || TOKEN.admin != 6}
                    loading={submitLoading}
                    onClick={() => handleInvoiceUpdate(false, ga.ID)}
                    small={true}
                  />
                </div>
                {/* ONLY IF DIRECTOR APPROVED, THE INVOICE CAN BE SENT TO THE CUSTOMER */}
                {/* {ga.STATUS == 111 && (
                  <Button
                    text="Send Invoice"
                    icon="envelope"
                    className="mt-2"
                    loading={submitLoading}
                    onClick={() => handleSendInvoice(ga)}
                    // disabled={TOKEN.admin != 6}
                  />
                )} */}
              </div>
            ))}
          {invRequest &&
            invRequest[1] &&
            invRequest[1].map((ga) => (
              <div
                className="card p-2 mb-2 flex flex-row cursor-pointer hover:bg-gray-200"
                key={ga.F_FILE}
                onClick={async () => {
                  window.location.assign(
                    `/api/file/get?ref=${Reference}&file=${encodeURIComponent(
                      ga.FILENAME
                    )}`
                  );
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline mr-1"
                >
                  <path
                    className="fill-current"
                    d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
                  />
                  <path
                    className="fill-current"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
                  />
                </svg>
                {ga.FILENAME}
              </div>
            ))}
          <div className="card my-2">
            <div className="d-flex font-bold bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
              {invoiceReq.F_InvoiceNo}
            </div>
            {/* {JSON.stringify(invRequest)} */}
            <div className="p-2">
              <div className="pl-2 font-bold text-lg">Invoice Summary</div>
              <ul className="my-2 px-2 divide-y divide-gray-300 rounded border border-gray-100">
                <li className="flex justify-between py-2">
                  <span>Invoice Date</span>
                  <span>
                    {moment(invoiceReq.F_InvoiceDate).utc().format("L")}
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Due Date</span>
                  <span>{moment(invoiceReq.F_DueDate).utc().format("L")}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Created At</span>
                  <span>{moment(invoiceReq.F_U1Date).utc().format("L")}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Created</span>
                  <span className="uppercase">{invoiceReq.F_U1ID}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Updated</span>
                  <span className="uppercase">{invoiceReq.F_U2ID}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Bill Party</span>
                  <span>{invoiceReq.BILLTO}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Ship Party</span>
                  <span>{invoiceReq.SHIPTO}</span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Invoice Amount</span>
                  <span>
                    {usdFormat(invoiceReq.F_InvoiceAmt)} {invoiceReq.F_Currency}
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Paid Amount</span>
                  <span>
                    {usdFormat(invoiceReq.F_PaidAmt || 0)}{" "}
                    {invoiceReq.F_Currency}
                  </span>
                </li>
                <li className="flex justify-between py-2">
                  <span>Balance Amount</span>
                  <span className="font-semibold">
                    {usdFormat(
                      invoiceReq.F_InvoiceAmt - (invoiceReq.F_PaidAmt || 0)
                    )}{" "}
                    {invoiceReq.F_Currency}
                  </span>
                </li>
              </ul>

              <div className="pl-2 font-bold text-lg">Invoice Detail</div>
              {/* <ul className="my-2 px-2 divide-y divide-gray-300 rounded border border-gray-100">
                {invoiceDetail &&
                  invoiceDetail.map((ga) => (
                    <li className="flex justify-between py-2" key={ga.F_ID}>
                      <span>{ga.F_Description}</span>
                      <span>
                        {ga.F_Rate}X{ga.F_Qty}
                      </span>
                      <span>{usdFormat(ga.F_Amount)}</span>
                    </li>
                  ))}
              </ul> */}
              <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rate
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Qty
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceDetail &&
                      invoiceDetail.map((inv) => (
                        <tr key={inv.F_ID}>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className="flex items-center text-xs">
                              {inv.F_Description}
                              {/* <div className="flex-shrink-0 h-10 w-10">
                              </div> */}
                            </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <div className="text-xs text-gray-900">
                              {usdFormat(inv.F_Rate)}
                            </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {inv.F_Qty}
                            </span>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500 text-right">
                            {usdFormat(inv.F_Amount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Input Field and File Selection */}
              <div className="p-3">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="memo"
                >
                  Memo <span className="text-red-600">*</span>
                </label>

                {/* Message Field has a limit of 100 character */}
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 my-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="memo"
                  type="text"
                  maxLength="100"
                  placeholder="Write Memo"
                  onChange={(e) => setMemo(e.target.value)}
                />

                <label
                  className="block text-gray-700 text-sm font-semibold my-2"
                  htmlFor="mail"
                >
                  Email Setting <span className="text-red-600">*</span>
                </label>
                <Checkbox
                  label="Auto Mail"
                  defaultChecked
                  id="mail"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAutosend(1);
                    } else {
                      setAutosend(0);
                    }
                  }}
                />

                <label
                  className="block text-gray-700 text-sm font-semibold my-2"
                  htmlFor="InvoiceFiles"
                >
                  Files
                </label>

                {data &&
                  data.map((ga) => {
                    if (ga.F_SECURITY == "10") {
                      return (
                        <Checkbox
                          key={ga.F_ID + "CHECK"}
                          label={`[${ga.F_LABEL.toUpperCase()}] ${
                            ga.F_FILENAME
                          }`}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFile((prev) => [...prev, ga.F_ID]);
                              setFileNames((prev) => [...prev, ga.F_FILENAME]);
                            } else {
                              var arr = [...selectedFile];
                              var index = arr.indexOf(ga.F_ID);
                              if (index !== -1) {
                                arr.splice(index, 1);
                                setSelectedFile(arr);
                              }
                              var nameArr = [...fileNames];
                              var nameIndex = nameArr.indexOf(ga.F_FILENAME);
                              if (nameIndex !== -1) {
                                nameArr.splice(nameIndex, 1);
                                setFileNames(nameArr);
                              }
                            }
                          }}
                        ></Checkbox>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button
            text="Submit"
            fill={true}
            disabled={!memo || submitLoading}
            loading={submitLoading}
            onClick={handleInvoiceRequest}
          />
        </div>
      </Dialog>
    </div>
  );
};
export default Profit;
