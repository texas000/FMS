import cookie from "cookie";
import Layout from "../../../components/Layout";
import jwt from "jsonwebtoken";
import React, { useState } from "react";
import useSWR, { mutate } from "swr";
import { Popover2 } from "@blueprintjs/popover2";
import {
  Menu,
  MenuItem,
  Button,
  MenuDivider,
  Dialog,
  Classes,
  Checkbox,
} from "@blueprintjs/core";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import { BlobProvider } from "@react-pdf/renderer";
import Cover from "../../../components/Forwarding/Oim/Cover";
import usdFormat from "../../../lib/currencyFormat";
import Select from "react-select";
import { HorizontalBar } from "react-chartjs-2";
import Notification from "../../../components/Toaster";
import CheckRequestForm from "../../../components/Dashboard/CheckRequestForm";
import moment from "moment";
import { useRouter } from "next/router";
import { post } from "axios";
import shipmentFileType from "../../../lib/shipmentFileType";

const Detail = ({ token, Reference }) => {
  const router = useRouter();
  // Store path to local storage
  if (typeof window !== "undefined") {
    var arr = [];
    var history = localStorage.getItem("pageHistory");
    if (history == null) {
      arr.unshift({ path: router.asPath, ref: Reference });
      localStorage.setItem("pageHistory", JSON.stringify(arr));
    } else {
      arr = JSON.parse(history);
      // If the page history is exist, check the most recent history
      // If the reference is same as current reference, do not store data
      if (arr[0].ref != Reference) {
        arr.unshift({ path: router.asPath, ref: Reference });
        localStorage.setItem("pageHistory", JSON.stringify(arr));
      }
    }
  }
  const { data } = useSWR(`/api/forwarding/oim/detail?ref=${Reference}`);
  const { data: files, mutate: fileMutate } = useSWR(
    "/api/file/list?ref=" + Reference
  );
  const { data: comment, mutate: commentMutate } = useSWR(
    `/api/comment/list?ref=${Reference}`
  );

  // For Comment Textfield
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;
  const [commentHtml, setCommentHtml] = useState("");
  const [fileTypeSelected, setFileTypeSelected] = useState({});
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(false);
  const [selectedApType, setSelectedApType] = useState(false);
  const [invoiceMemo, setInvoiceMemo] = useState(false);
  const [invoiceAutoSend, setInvoiceAutoSend] = useState(1);
  const [selectedFile, setSelectedFile] = useState([]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const { data: invoiceDetail } = useSWR(
    selectedPayment.type == 10
      ? `/api/requests/getInvoiceDetail?id=${selectedPayment.F_ID}`
      : null
  );
  const { data: crdrDetail } = useSWR(
    selectedPayment.type == 20
      ? `/api/requests/getCreditDebitDetail?id=${selectedPayment.F_ID}`
      : null
  );
  const { data: payableDetail } = useSWR(
    selectedPayment.type == 30
      ? `/api/requests/getAccountPayableDetail?id=${selectedPayment.F_ID}`
      : null
  );
  const { data: invoiceRequested } = useSWR(
    selectedPayment.type == 10
      ? `/api/requests/getInvoiceRequestDetail?tbid=${selectedPayment.F_ID}`
      : null
  );
  const { data: apRequested } = useSWR(`/api/requests/get?ref=${Reference}`);

  async function handleInvoiceRequest() {
    // Set submit loading to be true
    setSubmitLoading(true);
    const sure = confirm(
      `Are you sure you want to request for invoice ${selectedPayment.F_InvoiceNo}?`
    );
    if (sure) {
      const invoiceRequestFetch = await fetch(
        "/api/requests/postInvoiceRequest",
        {
          method: "POST",
          body: JSON.stringify({
            invoiceReq: selectedPayment,
            memo: invoiceMemo,
            selectedFile: selectedFile.map((ga) => ga.ID),
            fileNames: selectedFile.map((ga) => ga.NAME),
            Reference: Reference,
            autosend: invoiceAutoSend,
            path: router.asPath,
          }),
        }
      );
      if (invoiceRequestFetch.status == 200) {
        setMsg(`Requested approval for ${selectedPayment.F_InvoiceNo}`);
        setSelectedPayment(false);
      } else {
        setMsg(`Error: ${invoiceRequestFetch.status}`);
      }
      setShow(true);
    }
    // Set submit loading to be false
    setSubmitLoading(false);
  }

  // Only Director update the invoice request
  async function handleInvoiceUpdate(approve, id) {
    setSubmitLoading(true);
    const invoiceUpdate = await fetch(
      `/api/requests/updateInvoice?id=${id}&approve=${approve}`,
      {
        method: "POST",
      }
    );

    if (invoiceUpdate.status == 200) {
      setMsg(
        `The invoice is successfully ${approved ? "approved" : "rejected"}!`
      );
      setSelectedPayment(false);
    } else {
      setMsg(`Error: ${invoiceUpdate.status}`);
    }
    setShow(true);
    setSubmitLoading(false);
  }

  async function handleSendInvoice(invoice) {
    setSubmitLoading(true);
    const sendInvoiceFetch = await fetch(`/api/requests/sendInvoice`, {
      invoice,
      invoiceReq: selectedPayment,
      files: invoiceRequested[1],
      MBL: data.M.F_MBLNo,
      HBL: data.H.map((na) => `${na.F_HBLNo} `),
      CONTAINER: data.C.map((ga) => `${ga.F_ContainerNo} `),
    });
    if (sendInvoiceFetch.status == 200) {
      setMsg(`The invoice has been sent to customer!`);
    } else {
      setMsg(`Error: ${sendInvoiceFetch.status}`);
    }
    setShow(true);
    setSubmitLoading(false);
  }

  async function handleCreditDebitRequest() {
    setSubmitLoading(true);
    const sure = confirm(
      `Are you sure you want to request for Credit Debit ${selectedPayment.F_CrDbNo}?`
    );
    if (sure) {
      // Success
      // setMsg(`Requested approval for ${selectedPayment.F_CrDbNo}`);
      setMsg(`Sorry, ${selectedPayment.F_CrDbNo} can not be completed!`);
      setShow(true);
      setSelectedPayment(false);
      // Failed
    }
    setSubmitLoading(false);
  }

  async function handleAccountPayableRequest() {
    setSubmitLoading(true);
    const sure = confirm(
      `Are you sure you want to request for Account Payable ${selectedPayment.F_InvoiceNo}?`
    );
    if (sure) {
      // Success
      const apRequestFetch = await fetch("/api/requests/postRequest", {
        method: "POST",
        headers: { ref: Reference, token: JSON.stringify(token) },
        body: JSON.stringify({
          ...selectedPayment,
          file: selectedFile.map((ga) => ga.ID),
          filenames: selectedFile.map((ga) => ga.NAME),
          type: selectedApType,
          customer: data.H[0].CUSTOMER,
          path: router.asPath,
        }),
      });
      if (apRequestFetch.status == 200) {
        setMsg(`Requested approval for ${selectedPayment.F_InvoiceNo}`);
        setSelectedPayment(false);
      } else {
        setMsg(`Error: ${apRequestFetch.status}`);
      }
      setShow(true);
      setSelectedPayment(false);
      // Failed
    }
    setSubmitLoading(false);
  }

  const Files = ({ File, Level }) => {
    if (File) {
      return (
        <div>
          {File.map((ga) => {
            if (ga.F_SECURITY == Level) {
              return (
                <div key={ga.F_ID} className="relative">
                  <button
                    className="mb-2 w-100 bg-white dark:bg-gray-700 p-1 border border-gray-400 rounded-lg hover:bg-indigo-500 hover:text-white z-0"
                    onClick={async () => {
                      window.location.assign(
                        `/api/file/get?ref=${Reference}&file=${encodeURIComponent(
                          ga.F_FILENAME
                        )}`
                      );
                    }}
                  >
                    <div className="flex justify-between px-2 text-xs">
                      <span className="uppercase tracking-tight">
                        <svg
                          width="18"
                          height="18"
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
                      <span className="text-truncate w-1/2 text-right tracking-tight">
                        {ga.F_FILENAME}
                      </span>
                    </div>
                  </button>
                  {ga.F_UPLOADER == token.uid && (
                    <div
                      className="bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-full float-right absolute top-0 right-0 shadow items-center cursor-pointer hover:bg-indigo-500 z-10"
                      onClick={() => handleFileHide(ga.F_ID)}
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/126/126497.png"
                        width="20"
                        height="20"
                      />
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return <p>PREVENT DEFAULT</p>;
    }
  };

  const Comments = ({ Comment }) => {
    if (Comment) {
      return (
        <div>
          {Comment.map((ga) => {
            if (ga.F_Show == "1") {
              return (
                <div
                  key={ga.F_ID}
                  className="bg-white dark:bg-gray-800 dark:text-gray-200 px-4 pb-2 antialiased flex w-100"
                >
                  {/* rounded-full h-8 w-8 mr-2 mt-1 */}
                  <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white mt-1 mr-2 rounded-full">
                    <span className="inline-block">{ga.FNAME.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl px-4 pt-2 pb-2.5">
                      <div className="font-semibold text-sm leading-relaxed">
                        {ga.FNAME} {ga.LNAME}
                      </div>
                      <div
                        className="text-normal leading-snug md:leading-normal"
                        dangerouslySetInnerHTML={{ __html: ga.F_Content }}
                      ></div>
                    </div>
                    <div className="text-sm ml-4 mt-0.5 text-gray-500 dark:text-gray-400">
                      {moment(moment(ga.F_Date).utc().format("LLL")).fromNow()}
                    </div>
                    <div className="bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-full float-right -mt-8 mr-0.5 flex shadow items-center cursor-pointer">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/126/126497.png"
                        width="20"
                        height="20"
                      />
                    </div>
                    {token.uid == ga.F_UID && (
                      <div
                        className="bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-full float-right -mt-8 mr-0.5 flex shadow items-center cursor-pointer"
                        onClick={() => handleCommentHide(ga.F_ID)}
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/126/126497.png"
                          width="20"
                          height="20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  function handleFileUpload(e) {
    var uploadFile = e.target.files[0];
    if (uploadFile) {
      const formData = new FormData();
      formData.append("userPhoto", uploadFile);
      try {
        const upload = new Promise((res, rej) => {
          res(
            post(`/api/file/upload?ref=${Reference}`, formData, {
              headers: {
                "content-type": "multipart/form-data",
                label: fileTypeSelected.value,
                level: fileTypeSelected.level,
              },
            })
          );
        });
        upload
          .then((ga) => {
            if (ga.status == 200) {
              setMsg(`UPLOADING FILE ${uploadFile.name}...`);
              fileMutate();
            } else {
              setMsg(ga.status);
            }
          })
          .catch((err) => {
            setMsg(JSON.stringify(err));
          });
      } catch (err) {
        if (err) {
          setMsg(JSON.stringify(err));
        }
      }
    }
    setShow(true);
  }

  async function handleFileHide(id) {
    const verify = confirm("Are you sure you want to delete this file?");
    if (verify) {
      const res = await fetch(`/api/file/hide?q=${id}`);
      if (res.ok) {
        fileMutate();
        setMsg(`File Successfully deleted!`);
        setShow(true);
      }
    }
  }

  async function handleCommentPost() {
    const fetchCommentPost = await fetch(
      `/api/comment/post?ref=${Reference.toUpperCase()}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ content: commentHtml }),
      }
    );
    if (fetchCommentPost.status == 200) {
      commentMutate();
      setCommentHtml("");
      setMsg("Message Uploaded");
      setShow(true);
    }
  }

  async function handleCommentHide(id) {
    const fetchCommentPost = await fetch(`/api/comment/hide?id=${id}`);
    if (fetchCommentPost.status == 200) {
      commentMutate();
      setMsg("Message Deleted");
      setShow(true);
    }
  }

  var mailSubject, mailBody, mailHref;
  if (data) {
    if (data.M && token) {
      mailSubject = `[JW] ${data.H.length > 0 && data.H[0].CUSTOMER} `;
      mailSubject += `MBL# ${data.M.F_MBLNo} `;
      mailSubject += `HBL# ${data.H.map((na) => `${na.F_HBLNo}`)} `;
      mailSubject += `CNTR# ${
        data.C && data.C.map((ga) => `${ga.F_ContainerNo} `)
      }`;
      mailSubject += `ETD ${moment(data.M.F_ETD).utc().format("l")} `;
      mailSubject += `ETA ${moment(data.M.F_ETA).utc().format("l")} // ${
        data.M.F_RefNo
      }`;
    }

    mailBody = `Dear ${data.H.length > 0 && data.H[0].CUSTOMER}
	  \nPlease note that there is an OCEAN IMPORT SHIPMENT for ${
      data.H.length > 0 && data.H[0].CUSTOMER
    } scheduled to depart on ${moment(data.M.F_ETA).utc().format("LL")}.
	  \n_______________________________________
	  ETD:  ${moment(data.M.F_ETD).format("L")}
	  POL:  ${data.M.F_LoadingPort}
	  ETA:  ${moment(data.M.F_ETA).format("L")}
	  POD:  ${data.M.F_DisCharge}
	  SHIPPER:  ${(data.H.length > 0 && data.H[0].SHIPPER) || ""}
	  CONSIGNEE:  ${(data.H.length > 0 && data.H[0].CONSIGNEE) || ""}
	  MBL:  ${data.M.F_MBLNo}
	  HBL:  ${data.H.map((ga) => `${ga.F_HBLNo} `)}
	  CONTAINER:  ${data.C.map(
      (ga) => `${ga.F_ContainerNo}${ga.F_SealNo && `(${ga.F_SealNo})`} `
    )}`;

    mailHref = data.M
      ? `mailto:?cc=${token.email}&subject=${encodeURIComponent(
          mailSubject
        )}&body=${encodeURIComponent(mailBody)}`
      : "";
  }
  const Status = ({ data }) => {
    if (data == 101) {
      return <span className="font-bold">Current Status: Requested</span>;
    }
    if (data == 110) {
      return (
        <span className="font-bold">Current Status: Director Rejected</span>
      );
    }
    if (data == 111) {
      return (
        <span className="font-bold">Current Status: Director Approved</span>
      );
    }
    if (data == 120) {
      return (
        <span className="font-bold">Current Status: Account Rejected</span>
      );
    }
    if (data == 121) {
      return (
        <span className="font-bold">Current Status: Account Approved</span>
      );
    }
  };

  return (
    <Layout TOKEN={token} TITLE={Reference} LOADING={!data}>
      <div>
        {data && data.M ? (
          <div>
            <div className="flex justify-between">
              <h3 className="text-xl font-bold uppercase">{Reference}</h3>
              <Popover2
                content={
                  <Menu className="p-3">
                    <MenuDivider title="FOLDER COVER" />
                    <BlobProvider
                      document={
                        <Cover
                          master={data.M}
                          house={data.H}
                          containers={data.C}
                        />
                      }
                    >
                      {({ blob, url, loading, error }) => (
                        <MenuItem
                          text="Download"
                          icon="cloud-download"
                          href={url}
                          target="__blank"
                          disabled={error || loading}
                        />
                      )}
                    </BlobProvider>

                    <MenuDivider title="TOOLS" />
                    <MenuItem
                      text="Email"
                      icon="envelope"
                      onClick={() => window.open(mailHref, "__blank")}
                    />
                  </Menu>
                }
                fill={true}
                minimal={true}
              >
                <button className="w-100 bg-white hover:bg-indigo-500 hover:text-white border border-gray-500 text-xs font-bold tracking-wider p-2 mb-2">
                  ACTION <i className="ml-2 fa fa-caret-down"></i>
                </button>
              </Popover2>
            </div>
            {/* MASTER AND SHIPMENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      >
                        Customer
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      >
                        {data.H.length
                          ? data.H[0].CUSTOMER
                          : "CUSTOMER NOT FOUND"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">MBL</td>
                      <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                        {data.M.F_MBLNo}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">CARRIER</td>
                      <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                        {data.M.CARRIER}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">AGENT</td>
                      <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                        {data.M.AGENT}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">VESSEL</td>
                      <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                        {data.M.F_Vessel} {data.M.F_Voyage}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">COMMODITY</td>
                      <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                        {data.M.F_mCommodity}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                      >
                        Shipment
                      </th>
                      <th scope="col"></th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">CREATED</td>
                      <td className="px-6 py-2 font-bold whitespace-nowrap uppercase">
                        {data.M.F_U1ID}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-right">
                        {moment(data.M.F_U1Date).utc().format("LL")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">UPDATED</td>
                      <td className="px-6 py-2 font-bold whitespace-nowrap uppercase">
                        {data.M.F_U2ID}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-right">
                        {moment(data.M.F_U2Date).utc().format("LL")}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">SHIP</td>
                      <td className="px-6 py-2 font-bold whitespace-nowrap">
                        {data.M.F_LoadingPort}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-right">
                        {data.M.F_ETD
                          ? moment(data.M.F_ETD).utc().format("LL")
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">ARRIVAL</td>
                      <td className="px-6 py-2 font-bold whitespace-nowrap">
                        {data.M.F_DisCharge}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-right">
                        {data.M.F_ETA
                          ? moment(data.M.F_ETA).utc().format("LL")
                          : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-2 whitespace-nowrap">DELIVERY</td>
                      <td className="px-6 py-2 font-bold whitespace-nowrap">
                        {data.M.F_FinalDest}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-right">
                        {data.M.F_FETA
                          ? moment(data.M.F_FETA).utc().format("LL")
                          : ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {/* INVOICE CRDR AP GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 my-4 gap-4">
              <div className="card overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="border-b border-gray-200">
                      <th
                        scope="col"
                        className="px-6 py-3 text-left font-bold uppercase tracking-wider"
                      >
                        INVOICE
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
                      >
                        {/* <span className="bg-indigo-300 text-indigo-600 rounded-xl p-2">
                          PAID
                        </span> */}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs dark:text-white">
                    {data.I.map((ga) => (
                      <tr
                        key={ga.F_ID}
                        onClick={() => setSelectedPayment({ ...ga, type: 10 })}
                        className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                      >
                        <td className="px-6 py-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">
                              {ga.F_InvoiceNo}
                            </span>
                            <span className="truncate max-w-sm">
                              {ga.BILLTO}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-2 text-right whitespace-nowrap ${
                            ga.F_PaidAmt ? "line-through" : "font-bold"
                          }`}
                        >
                          {usdFormat(ga.F_InvoiceAmt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex bg-gray-50 justify-between px-4 py-2 border-t border-gray-200 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-xs">
                      number of invoice
                    </span>
                    <span className="text-xl font-bold">{data.I.length}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-300 text-xs">invoice total</span>
                    <span className="text-xl font-bold">
                      {usdFormat(
                        data.I.reduce((sum, item) => {
                          return (sum = sum + item.F_InvoiceAmt || 0);
                        }, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="border-b border-gray-200">
                      <th
                        scope="col"
                        className="px-6 py-3 text-left font-bold uppercase tracking-wider"
                      >
                        CRDR
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
                      >
                        {/* <span className="bg-indigo-300 text-indigo-600 rounded-xl p-2">
                          PAID
                        </span> */}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs dark:text-white">
                    {data.CR.map((ga) => (
                      <tr
                        key={ga.F_ID}
                        onClick={() => setSelectedPayment({ ...ga, type: 20 })}
                        className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                      >
                        <td className="px-6 py-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">
                              {ga.F_CrDbNo}
                            </span>
                            <span>{ga.AGENT}</span>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-2 text-right whitespace-nowrap ${
                            ga.F_PaidAmt ? "line-through" : "font-bold"
                          }`}
                        >
                          {usdFormat(ga.F_Total)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex bg-gray-50 justify-between px-4 py-2 border-t border-gray-200 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-xs">
                      number of credit debit
                    </span>
                    <span className="text-xl font-bold">{data.CR.length}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-300 text-xs">
                      credit debit total
                    </span>
                    <span className="text-xl font-bold">
                      {usdFormat(
                        data.CR.reduce((sum, item) => {
                          return (sum = sum + item.F_Total || 0);
                        }, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr className="border-b border-gray-200">
                      <th
                        scope="col"
                        className="px-6 py-3 text-left font-bold uppercase tracking-wider"
                      >
                        ACCOUNT PAYABLE
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
                      >
                        {/* <span className="bg-indigo-300 text-indigo-600 rounded-xl p-2">
                          PAID
                        </span> */}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs dark:text-white">
                    {data.A.map((ga) => (
                      <tr
                        key={ga.F_ID}
                        onClick={() => setSelectedPayment({ ...ga, type: 30 })}
                        className="hover:bg-indigo-500 hover:text-white cursor-pointer w-100"
                      >
                        <td className="px-6 py-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">
                              {ga.F_InvoiceNo}
                            </span>
                            <span>{ga.VENDOR}</span>
                          </div>
                        </td>
                        <td
                          className={`px-6 py-2 text-right whitespace-nowrap ${
                            ga.F_PaidAmt ? "line-through" : "font-bold"
                          }`}
                        >
                          {usdFormat(ga.F_InvoiceAmt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex bg-gray-50 justify-between px-4 py-2 border-t border-gray-200 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-gray-300 text-xs">
                      number of account payable
                    </span>
                    <span className="text-xl font-bold">{data.A.length}</span>
                  </div>
                  <div className="flex flex-col text-right">
                    <span className="text-gray-300 text-xs">
                      account payable total
                    </span>
                    <span className="text-xl font-bold">
                      {usdFormat(
                        data.A.reduce((sum, item) => {
                          return (sum = sum + item.F_InvoiceAmt || 0);
                        }, 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card overflow-visible ">
                <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2 rounded-t-xl">
                  INVOICE FILE
                </div>
                <div className="p-3 grid grid-cols-2 gap-4">
                  <Select
                    options={shipmentFileType(10)}
                    onChange={(e) => setFileTypeSelected(e)}
                    defaultValue={{ value: 0, label: "INVOICE FILE TYPE" }}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (styles) => ({
                        ...styles,
                      }),
                    }}
                    className="w-100"
                  />
                  <div className="input-group">
                    <input
                      type="file"
                      id="invoiceInput"
                      className="custom-file-input"
                      disabled={fileTypeSelected.level != 10}
                      onChange={handleFileUpload}
                    ></input>
                    <label className="custom-file-label font-light">
                      {fileTypeSelected.label
                        ? fileTypeSelected.label
                        : "Select File Type"}
                    </label>
                  </div>
                </div>
                <div className="px-4">
                  <Files File={files} Level={10} />
                </div>
              </div>
              <div className="card overflow-visible">
                <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2 rounded-t-xl">
                  CRDR FILE
                </div>
                <div className="p-3 grid grid-cols-2 gap-4">
                  <Select
                    options={shipmentFileType(20)}
                    onChange={(e) => setFileTypeSelected(e)}
                    defaultValue={{ value: 0, label: "CRDR FILE TYPE" }}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    className="w-100"
                  />
                  <div className="input-group">
                    <input
                      type="file"
                      id="crdrInput"
                      className="custom-file-input"
                      disabled={fileTypeSelected.level != 20}
                      onChange={handleFileUpload}
                    ></input>
                    <label className="custom-file-label font-light">
                      {fileTypeSelected.label
                        ? fileTypeSelected.label
                        : "Select File Type"}
                    </label>
                  </div>
                </div>
                <div className="px-4">
                  <Files File={files} Level={20} />
                </div>
              </div>
              <div className="card overflow-visible">
                <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2 rounded-t-xl">
                  ACCOUNT PAYABLE FILE
                </div>
                <div className="p-3 grid grid-cols-2 gap-4">
                  <Select
                    options={shipmentFileType(30)}
                    onChange={(e) => setFileTypeSelected(e)}
                    defaultValue={{ value: 0, label: "AP FILE TYPE" }}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                    className="w-100"
                  />
                  <div className="input-group">
                    <input
                      type="file"
                      id="apInput"
                      className="custom-file-input"
                      disabled={fileTypeSelected.level != 30}
                      onChange={handleFileUpload}
                    ></input>
                    <label className="custom-file-label font-light">
                      {fileTypeSelected.label
                        ? fileTypeSelected.label
                        : "Select File Type"}
                    </label>
                  </div>
                </div>
                <div className="px-4">
                  <Files File={files} Level={30} />
                </div>
              </div>
            </div>

            {/* COMMENT + PROFIT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-flow-col my-4 gap-4">
              <div className="card">
                <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2 rounded-t-xl">
                  COMMENT
                </div>
                {ReactQuill && (
                  <div className="p-3">
                    <ReactQuill
                      className="dark:text-white"
                      value={commentHtml}
                      placeholder="Add a comment..."
                      modules={{
                        toolbar: {
                          container: [
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            // [{ font: [] }],
                            // [{ align: [] }],
                            ["bold", "italic", "underline"],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              {
                                color: [
                                  "#000000",
                                  "#e60000",
                                  "#ff9900",
                                  "#ffff00",
                                  "#008a00",
                                  "#0066cc",
                                  "#9933ff",
                                  "#ffffff",
                                  "#facccc",
                                  "#ffebcc",
                                  "#ffffcc",
                                  "#cce8cc",
                                  "#cce0f5",
                                  "#ebd6ff",
                                  "#bbbbbb",
                                  "#f06666",
                                  "#ffc266",
                                  "#ffff66",
                                  "#66b966",
                                  "#66a3e0",
                                  "#c285ff",
                                  "#888888",
                                  "#a10000",
                                  "#b26b00",
                                  "#b2b200",
                                  "#006100",
                                  "#0047b2",
                                  "#6b24b2",
                                  "#444444",
                                  "#5c0000",
                                  "#663d00",
                                  "#666600",
                                  "#003700",
                                  "#002966",
                                  "#3d1466",
                                  "custom-color",
                                ],
                              },
                              { background: [] },
                              "link",
                              // "image",
                            ],
                          ],
                        },
                      }}
                      theme="snow"
                      onChange={setCommentHtml}
                    />
                  </div>
                )}
                <div className="px-3 mb-3">
                  <button
                    className="bg-indigo-500 text-white rounded px-4 py-2 mr-1 font-bold hover:bg-indigo-700"
                    onClick={handleCommentPost}
                    disabled={!commentHtml}
                  >
                    Save
                  </button>
                  <button
                    className="bg-white hover:bg-gray-200 rounded px-4 py-2"
                    onClick={() => setCommentHtml("")}
                  >
                    Cancel
                  </button>
                </div>

                <Comments Comment={comment} />
              </div>
              <div className="card">
                <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2 rounded-t-xl">
                  PROFIT
                </div>
                <div className="flex items-center justify-between h-100 p-2">
                  <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg w-1/2">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left font-bold uppercase tracking-wider"
                          >
                            TOTAL
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
                          >
                            {usdFormat(
                              data.P.reduce((sum, item) => {
                                return (sum = sum + item.F_HouseTotal || 0);
                              }, 0)
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs dark:text-white">
                        <tr className="hover:bg-indigo-500 hover:text-white cursor-pointer w-100">
                          <td className="px-6 py-2">
                            <div className="flex flex-col">INVOICE</div>
                          </td>
                          <td className="px-6 py-2 text-right whitespace-nowrap">
                            {usdFormat(
                              data.P.reduce((sum, item) => {
                                return (sum = sum + item.F_AR || 0);
                              }, 0)
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-indigo-500 hover:text-white cursor-pointer w-100">
                          <td className="px-6 py-2">
                            <div className="flex flex-col">CRDR</div>
                          </td>
                          <td className="px-6 py-2 text-right whitespace-nowrap">
                            {usdFormat(
                              data.P.reduce((sum, item) => {
                                return (sum = sum + item.F_CrDr || 0);
                              }, 0)
                            )}
                          </td>
                        </tr>
                        <tr className="hover:bg-indigo-500 hover:text-white cursor-pointer w-100">
                          <td className="px-6 py-2">
                            <div className="flex flex-col">AP</div>
                          </td>
                          <td className="px-6 py-2 text-right whitespace-nowrap">
                            {usdFormat(
                              data.P.reduce((sum, item) => {
                                return (sum = sum + item.F_AP || 0);
                              }, 0)
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-center">
                    <HorizontalBar
                      data={{
                        labels: ["INVOICE", "CRDR", "AP"],
                        datasets: [
                          {
                            label: "Amount",
                            data: [
                              data.I.reduce((sum, item) => {
                                return (sum = sum + item.F_InvoiceAmt || 0);
                              }, 0),
                              data.CR.reduce((sum, item) => {
                                return (sum = sum + item.F_Total || 0);
                              }, 0),
                              data.A.reduce((sum, item) => {
                                return (sum = sum + item.F_InvoiceAmt || 0);
                              }, 0),
                            ],
                            backgroundColor: ["#059669", "#10B981", "#FBBF24"],
                            hoverOffset: 4,
                          },
                        ],
                      }}
                      options={{
                        legend: {
                          display: false,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <Dialog
              isOpen={selectedPayment.type == 10}
              onOpening={() => setSelectedFile([])}
              onClose={() => {
                setSelectedPayment(false);
                setSelectedFile([]);
                setInvoiceMemo(false);
              }}
              title="Request Invoice Approval"
              className="dark:bg-gray-600 w-50"
            >
              <div className={Classes.DIALOG_BODY}>
                {invoiceRequested &&
                  invoiceRequested[0] &&
                  invoiceRequested[0].map((ga) => (
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
                          disabled={submitLoading || token.admin != 6}
                          loading={submitLoading}
                          onClick={() => handleInvoiceUpdate(true, ga.ID)}
                          small={true}
                        />
                        <Button
                          text="Reject"
                          fill={true}
                          minimal={true}
                          disabled={submitLoading || token.admin != 6}
                          loading={submitLoading}
                          onClick={() => handleInvoiceUpdate(false, ga.ID)}
                          small={true}
                        />
                      </div>
                      {/* ONLY IF DIRECTOR APPROVED, THE INVOICE CAN BE SENT TO THE CUSTOMER */}
                      {ga.STATUS == 111 && (
                        <Button
                          text="Send Invoice (Test)"
                          icon="envelope"
                          className="mt-2"
                          loading={submitLoading}
                          small={true}
                          onClick={() => handleSendInvoice(ga)}
                          disabled={ga.AUTOSEND == 0}
                        />
                      )}
                    </div>
                  ))}
                {invoiceRequested &&
                  invoiceRequested[1] &&
                  invoiceRequested[1].map((ga) => (
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
                  <div className="d-flex tracking-wider font-bold bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
                    <span>{selectedPayment.F_InvoiceNo}</span>
                  </div>
                  {/* INVOICE SUMMARY AND DETAILS */}
                  <div className="p-2">
                    <div className="pl-2 font-bold text-lg">
                      Invoice Summary
                    </div>
                    <div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Invoice Date
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {moment(selectedPayment.F_InvoiceDate)
                                .utc()
                                .format("LL")}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Due Date
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {moment(selectedPayment.F_DueDate)
                                .utc()
                                .format("LL")}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Bill Party
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {selectedPayment.BILLTO}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Ship Party
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {selectedPayment.SHIPTO}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Person in Charge
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {selectedPayment.F_U1ID} /{" "}
                              {selectedPayment.F_U2ID}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Invoice Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {usdFormat(selectedPayment.F_InvoiceAmt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Paid Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {usdFormat(selectedPayment.F_PaidAmt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Balance Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap font-bold">
                              {usdFormat(
                                selectedPayment.F_InvoiceAmt -
                                  (selectedPayment.F_PaidAmt || 0)
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pl-2 font-bold text-lg">Invoice Detail</div>

                    <div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-700">
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
                        <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200">
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
                                  <div className="text-xs text-gray-900 dark:text-white">
                                    {usdFormat(inv.F_Rate)}
                                  </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {inv.F_Qty}
                                  </span>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-200 text-right">
                                  {usdFormat(inv.F_Amount)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <hr className="mt-4" />
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
                        onChange={(e) => setInvoiceMemo(e.target.value)}
                      />

                      <label
                        className="block text-gray-700 text-sm font-semibold my-2"
                        htmlFor="mail"
                      >
                        Email Setting <span className="text-red-600">*</span>
                      </label>
                      <Checkbox
                        label="Auto Mail Invoice"
                        defaultChecked
                        id="mail"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInvoiceAutoSend(1);
                          } else {
                            setInvoiceAutoSend(0);
                          }
                        }}
                      />

                      <label className="block text-gray-700 text-sm font-semibold my-2">
                        Files
                      </label>

                      {files &&
                        files.map((ga) => {
                          if (ga.F_SECURITY == "10") {
                            return (
                              <Checkbox
                                key={ga.F_ID + "CHECK"}
                                label={`[${ga.F_LABEL.toUpperCase()}] ${
                                  ga.F_FILENAME
                                }`}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFile((prev) => [
                                      ...prev,
                                      { ID: ga.F_ID, NAME: ga.F_FILENAME },
                                    ]);
                                  } else {
                                    var arr = [...selectedFile];
                                    var index = arr.findIndex(
                                      (i) => i.ID == ga.F_ID
                                    );
                                    if (index !== -1) {
                                      arr.splice(index, 1);
                                      setSelectedFile(arr);
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
                  loading={submitLoading}
                  disabled={!invoiceMemo}
                  onClick={handleInvoiceRequest}
                />
              </div>
            </Dialog>
            <Dialog
              isOpen={selectedPayment.type == 20}
              onOpening={() => setSelectedFile([])}
              onClose={() => {
                setSelectedPayment(false);
                setSelectedFile([]);
              }}
              title="Request Credit Debit Approval"
              className="dark:bg-gray-600 w-50"
            >
              <div className={Classes.DIALOG_BODY}>
                <div className="card my-2">
                  <div className="d-flex tracking-wider font-bold bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
                    <span>{selectedPayment.F_CrDbNo}</span>
                  </div>
                  <div className="p-2">
                    <div className="pl-2 font-bold text-lg">
                      Credit Debit Summary
                    </div>
                    <div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Invoice Date
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {moment(selectedPayment.F_InvoiceDate)
                                .utc()
                                .format("LL")}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Due Date
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {moment(selectedPayment.F_DueDate)
                                .utc()
                                .format("LL")}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Agent
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {selectedPayment.AGENT}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Person in Charge
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {selectedPayment.F_U1ID} /{" "}
                              {selectedPayment.F_U2ID}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Invoice Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {usdFormat(selectedPayment.F_Total)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Paid Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {usdFormat(selectedPayment.F_PaidAmt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Balance Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap font-bold">
                              {usdFormat(
                                selectedPayment.F_Total -
                                  (selectedPayment.F_PaidAmt || 0)
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pl-2 font-bold text-lg">
                      Credit Debit Detail
                    </div>

                    <div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Crdit
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Debit
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200">
                          {crdrDetail &&
                            crdrDetail.map((inv) => (
                              <tr key={inv.F_ID}>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="flex items-center text-xs">
                                    {inv.F_Description}
                                    {/* <div className="flex-shrink-0 h-10 w-10">
                              </div> */}
                                  </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-xs text-red-400 text-right">
                                  {usdFormat(inv.F_Credit)}
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-xs text-blue-400 text-right">
                                  {usdFormat(inv.F_Debit)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <hr className="mt-4" />
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
                        onChange={(e) => setInvoiceMemo(e.target.value)}
                      />

                      <label
                        className="block text-gray-700 text-sm font-semibold my-2"
                        htmlFor="mail"
                      >
                        Email Setting <span className="text-red-600">*</span>
                      </label>
                      <Checkbox
                        label="Auto Mail Invoice"
                        defaultChecked
                        id="mail"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setInvoiceAutoSend(1);
                          } else {
                            setInvoiceAutoSend(0);
                          }
                        }}
                      />

                      <label className="block text-gray-700 text-sm font-semibold my-2">
                        Files
                      </label>

                      {files &&
                        files.map((ga) => {
                          if (ga.F_SECURITY == "20") {
                            return (
                              <Checkbox
                                key={ga.F_ID + "CHECK"}
                                label={`[${ga.F_LABEL.toUpperCase()}] ${
                                  ga.F_FILENAME
                                }`}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFile((prev) => [
                                      ...prev,
                                      { ID: ga.F_ID, NAME: ga.F_FILENAME },
                                    ]);
                                  } else {
                                    var arr = [...selectedFile];
                                    var index = arr.findIndex(
                                      (i) => i.ID == ga.F_ID
                                    );
                                    if (index !== -1) {
                                      arr.splice(index, 1);
                                      setSelectedFile(arr);
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
                  disabled={!invoiceMemo}
                  onClick={handleCreditDebitRequest}
                />
              </div>
            </Dialog>
            <Dialog
              isOpen={selectedPayment && selectedPayment.type == 30}
              onOpening={() => setSelectedFile([])}
              onClose={() => {
                setSelectedPayment(false);
                setSelectedApType(false);
                setSelectedFile([]);
              }}
              title="Request Account Payable Approval"
              className="dark:bg-gray-600 w-50"
            >
              <div className={Classes.DIALOG_BODY}>
                {apRequested &&
                  apRequested.map((ga) => {
                    if (ga.Title == selectedPayment.F_InvoiceNo) {
                      return (
                        <div className="card p-2 mb-2" key={ga.ID}>
                          <div className="flex justify-between">
                            <Status data={ga.Status} />
                            <span>
                              {moment(ga.CreateAt).utc().format("LLL")}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  })}
                <div className="card my-2">
                  <div className="d-flex tracking-wider font-bold bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
                    <span>{selectedPayment.F_InvoiceNo}</span>
                  </div>
                  <div className="p-2">
                    <div className="pl-2 font-bold text-lg">
                      Account Payable Summary
                    </div>
                    <div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Invoice Date
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {moment(selectedPayment.F_InvoiceDate)
                                .utc()
                                .format("LL")}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Due Date
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {moment(selectedPayment.F_DueDate)
                                .utc()
                                .format("LL")}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Vendor
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {selectedPayment.VENDOR}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Person in Charge
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {selectedPayment.F_U1ID} /{" "}
                              {selectedPayment.F_U2ID}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Invoice Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {usdFormat(selectedPayment.F_InvoiceAmt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Paid Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap">
                              {usdFormat(selectedPayment.F_PaidAmt)}
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-2 whitespace-nowrap">
                              Balance Amount
                            </td>
                            <td className="px-6 py-2 whitespace-nowrap font-bold">
                              {usdFormat(
                                selectedPayment.F_InvoiceAmt -
                                  (selectedPayment.F_PaidAmt || 0)
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pl-2 font-bold text-lg">
                      Account Payable Detail
                    </div>
                    <div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200">
                          {payableDetail &&
                            payableDetail.map((inv) => (
                              <tr key={inv.F_ID}>
                                <td className="px-6 py-2 whitespace-nowrap">
                                  <div className="flex items-center text-xs">
                                    {inv.F_Description}
                                    {/* <div className="flex-shrink-0 h-10 w-10">
                              </div> */}
                                  </div>
                                </td>
                                <td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-200 text-right">
                                  {usdFormat(inv.F_Amount)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <hr className="mt-4" />
                    <div className="p-3">
                      <label
                        className="block text-gray-700 text-sm font-semibold mb-2"
                        htmlFor="type"
                      >
                        Account Payable Type{" "}
                        <span className="text-red-600">*</span>
                      </label>
                      <select
                        className="form-control"
                        id="type"
                        onChange={(e) => setSelectedApType(e.target.value)}
                      >
                        <option value={false}>Please select type</option>
                        <option value="CHECK">Check</option>
                        <option value="CARD">Card</option>
                        <option value="ACH">ACH</option>
                        <option value="WIRE">Wire</option>
                      </select>
                      <label className="block text-gray-700 text-sm font-semibold my-2">
                        Files
                      </label>

                      {files &&
                        files.map((ga) => {
                          if (ga.F_SECURITY == "30") {
                            return (
                              <Checkbox
                                key={ga.F_ID + "CHECK"}
                                label={`[${ga.F_LABEL.toUpperCase()}] ${
                                  ga.F_FILENAME
                                }`}
                                className="truncate"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedFile((prev) => [
                                      ...prev,
                                      { ID: ga.F_ID, NAME: ga.F_FILENAME },
                                    ]);
                                  } else {
                                    var arr = [...selectedFile];
                                    var index = arr.findIndex(
                                      (i) => i.ID == ga.F_ID
                                    );
                                    if (index !== -1) {
                                      arr.splice(index, 1);
                                      setSelectedFile(arr);
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
                <BlobProvider
                  document={
                    <CheckRequestForm
                      pic={selectedPayment.F_U1ID || ""}
                      payto={selectedPayment.VENDOR}
                      amt={selectedPayment.F_InvoiceAmt}
                      oim={Reference.toUpperCase()}
                      type={selectedApType}
                      inv={selectedPayment.F_InvoiceNo}
                      desc={selectedPayment.F_Descript}
                      customer={data.H[0].CUSTOMER}
                      metd={moment(data.M.F_ETD).utc().format("MM/DD/YY")}
                      meta={moment(data.M.F_ETA).utc().format("MM/DD/YY")}
                      pod={data.M.F_DisCharge}
                      comm={data.M.F_mCommodity}
                      shipper={data.H[0].SHIPPER}
                      consignee={data.H[0].CONSIGNEE}
                    />
                  }
                >
                  {({ blob, url, loading, error }) => (
                    <Button
                      text="Account Payable Request Form"
                      fill={true}
                      className="mb-4"
                      onClick={() => window.open(url, "__blank")}
                      icon="document-open"
                      disabled={error}
                      loading={loading}
                    />
                  )}
                </BlobProvider>

                <Button
                  text="Submit"
                  fill={true}
                  disabled={!selectedApType || !selectedFile.length}
                  onClick={handleAccountPayableRequest}
                />
              </div>
            </Dialog>
            <Notification show={show} setShow={setShow} msg={msg} />
          </div>
        ) : (
          <section className="flex items-center justify-center py-10 text-white sm:py-16 md:py-24 lg:py-32">
            <div className="relative max-w-3xl px-10 text-center text-white auto lg:px-0">
              <div className="flex justify-between">
                <h1 className="relative flex flex-col text-6xl font-extrabold text-left text-black">
                  Shipment
                  <span>Does</span>
                  <span>Not</span>
                  <span>Exist</span>
                </h1>
              </div>

              <div className="my-16 border-b border-gray-300 lg:my-24"></div>

              <h2 className="text-left text-gray-500 xl:text-xl"></h2>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);

    return {
      props: {
        token: token,
        Reference: query.Detail,
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

export default Detail;
