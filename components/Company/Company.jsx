import { Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import moment from "moment";
import usdFormat from "../../lib/currencyFormat";
import { useDropzone } from "react-dropzone";
import axios, { post } from "axios";
import { Fragment, useCallback, useMemo, useState } from "react";
import Notification from "../Toaster";
import router from "next/router";
import useSWR from "swr";
import Comments from "../Utils/Comment";
export default function Company({
  data,
  contact,
  balance,
  invoice,
  companyid,
  count,
  depo,
  token,
}) {
  const { data: file, mutate } = useSWR(
    `/api/file/list?ref=COMPANY-${companyid}`
  );
  const [msg, setMsg] = useState(false);
  const [show, setShow] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      const formData = new FormData();
      formData.append("userPhoto", file);
      try {
        await axios
          .post(`/api/file/uploadVersion2?ref=COMPANY-${companyid}`, formData, {
            headers: {
              "content-type": "multipart/form-data",
            },
          })
          .then((response) => {
            if (response.data.error) {
              setMsg(`ERROR: ${response.data.message}`);
              setShow(true);
            } else {
              setMsg(response.data.message);
              setShow(true);
              mutate();
              // File is successfully uploaded
            }
          })
          .catch((err) => {
            setMsg(JSON.stringify(err));
            setShow(true);
          });
      } catch (err) {
        setMsg(JSON.stringify(err));
        setShow(true);
      }
    });
  }, []);

  const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    outline: "none",
    transition: "border .24s ease-in-out",
  };

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ onDrop });

  async function handleFileHide(id) {
    const verify = confirm("Are you sure you want to delete this file?");
    if (verify) {
      const res = await fetch(`/api/file/hide?q=${id}`);
      if (res.ok) {
        setMsg(`File Successfully deleted!`);
        setShow(true);
        mutate();
      }
    }
  }
  const CompanyType = () => {
    if (count && (count.AP || count.INV || count.CR)) {
      if (count.AP > Math.max(count.INV, count.CR)) {
        return (
          <span className="bg-indigo-500 rounded-full text-white p-1">
            VENDOR
          </span>
        );
      }
      if (count.CR > Math.max(count.AP, count.INV)) {
        return (
          <span className="bg-indigo-500 rounded-full text-white p-1">
            AGENT
          </span>
        );
      }
      if (count.INV > Math.max(count.AP, count.CR)) {
        return (
          <span className="bg-indigo-500 rounded-full text-white p-1">
            CUSTOMER
          </span>
        );
      }
    } else {
      return (
        <span className="bg-red-500 rounded-full text-white p-1">
          NO HISTORY
        </span>
      );
    }
  };

  function handleInvoiceClick(inv) {
    switch (inv.F_TBName) {
      case "T_INVOHD":
        router.push(`/invoice/${inv.F_ID}`);
        break;
      case "T_APHD":
        router.push(`/ap/${inv.F_ID}`);
        break;
      case "T_CRDBHD":
        router.push(`/crdr/${inv.F_ID}`);
        break;
      default:
        alert(inv.F_TBName);
    }
  }

  if (data[0]) {
    return (
      <div className="pb-14">
        <div className="flex flex-row items-center">
          <h3 className="dark:text-white mr-2">{data[0].F_FName}</h3>
          <CompanyType />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-3">
          <div className="card col-span-2 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    colSpan="2"
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                  >
                    Information
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap">Address</td>
                  <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                    <span>{data[0].F_Addr}</span> <span>{data[0].F_City}</span>{" "}
                    <span>{data[0].F_State}</span>{" "}
                    <span>{data[0].F_ZipCode}</span>{" "}
                    <span>{data[0].F_Country}</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap">Tax Info</td>
                  <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                    {`${data[0].F_IRSNo} ${data[0].F_IRSType}`}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap">Created</td>
                  <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                    Created by{" "}
                    <span className="uppercase">{data[0].F_U1ID}</span> at{" "}
                    {new Date(data[0].F_U1Date).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap">Updated</td>
                  <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                    Updated by{" "}
                    <span className="uppercase">{data[0].F_U2ID}</span> at{" "}
                    {new Date(data[0].F_U2Date).toLocaleDateString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="card col-span-1 w-100 p-3">
            <iframe
              className="w-100 h-100"
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/search?q=${encodeURIComponent(
                data[0].F_Addr +
                  "+" +
                  data[0].F_City +
                  "+" +
                  data[0].F_State +
                  "+" +
                  data[0].F_ZipCode +
                  "+" +
                  data[0].F_Country
              )}&key=AIzaSyDti1yLvLp4RYMBR2hHBDk7jltZU44xJqc`}
            ></iframe>
          </div>
        </div>
        <div className="flex flex-row gap-4 my-3">
          <div className="gap-4 flex-1">
            <div className="card flex-auto overflow-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    >
                      Balance
                    </th>
                    <th className="px-6 py-1 font-bold uppercase tracking-wider text-right">
                      {balance && usdFormat(balance[0].F_Balance)}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
                  {balance &&
                    balance.map((ga) => (
                      <Fragment key={ga.f_id}>
                        <tr>
                          <td className="px-6 py-2 whitespace-nowrap">
                            AR BALANCE
                          </td>
                          <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                            {usdFormat(ga.F_AR)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-2 whitespace-nowrap">
                            AP BALANCE
                          </td>
                          <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                            {usdFormat(ga.F_AP)}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-2 whitespace-nowrap">
                            CREDIT BALANCE
                          </td>
                          <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                            {usdFormat(ga.F_CrDr)}
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="card flex-auto p-3 mt-3">
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>CLICK OR DROP THE FILE HERE</p>
              </div>
              <div className="mt-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    {file &&
                      file.map((ga, i) => (
                        <tr key={`${i}-file`}>
                          <td
                            className="px-6 py-2 whitespace-nowrap hover:bg-indigo-500 hover:text-white w-3/6"
                            onClick={async () => {
                              window.location.assign(
                                `/api/file/get?ref=COMPANY-${companyid}&file=${encodeURIComponent(
                                  ga.F_FILENAME
                                )}`
                              );
                            }}
                          >
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
                            <span className="font-bold"> {ga.F_FILENAME}</span>
                          </td>

                          <td className="px-6 py-2 text-center whitespace-nowrap uppercase w-1/6">
                            <select className="uppercase">
                              <option value={ga.F_LABEL}>{ga.F_LABEL}</option>
                            </select>
                          </td>
                          <td
                            className="px-6 py-2 text-center whitespace-nowrap hover:bg-indigo-500 hover:text-white w-1/6"
                            onClick={async () => {
                              const data = await fetch(
                                `/api/file/get?ref=COMPANY-${companyid}&file=${encodeURIComponent(
                                  ga.F_FILENAME
                                )}`
                              );
                              const blob = await data.blob();
                              var file = new Blob([blob], {
                                type: blob.type,
                              });
                              var fileURL = URL.createObjectURL(file);
                              window.open(fileURL);
                            }}
                          >
                            Open
                          </td>
                          <td
                            className="px-6 py-2 text-center whitespace-nowrap hover:bg-indigo-500 hover:text-white w-1/6"
                            onClick={() => {
                              handleFileHide(ga.F_ID);
                            }}
                          >
                            Delete
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card flex-auto overflow-hidden mt-3">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      colSpan="4"
                      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    >
                      Pending Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
                  {invoice &&
                    invoice.map((ga, i) => (
                      <tr
                        key={`${i}-invoice`}
                        className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                        onClick={() => handleInvoiceClick(ga)}
                      >
                        <td className="py-1 whitespace-nowrap pl-6">
                          {ga.F_InvoiceNo || ga.F_ID}
                        </td>
                        <td className="py-1 whitespace-nowrap">{ga.PIC}</td>
                        <td className="py-1 whitespace-nowrap text-right">
                          Due {moment(ga.F_DueDate).fromNow()}
                        </td>
                        <td className="py-1 whitespace-nowrap text-right pr-6">
                          {usdFormat(ga.F_InvoiceAmt)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="card flex-auto overflow-hidden mt-3">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th
                      scope="col"
                      colSpan="3"
                      className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    >
                      Recent Payment History
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
                  {depo &&
                    depo.map((ga, i) => (
                      <tr key={`${i}-depo`} className="px-6">
                        <td className="py-1 whitespace-nowrap pl-6">
                          {ga.F_Type == "C"
                            ? `Payment Sent by ${ga.F_CheckNo} at 
                          ${moment(ga.F_PostDate).utc().format("l")}`
                            : `Payment Recevied by ${ga.F_CheckNo} at ${moment(
                                ga.F_PostDate
                              )
                                .utc()
                                .format("l")}`}
                        </td>
                        <td className="py-1 whitespace-nowrap text-right pr-6">
                          {moment(ga.F_U1Date, "YYYY-MM-DD HH:mm:ss").fromNow()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* {JSON.stringify(depo)} */}
            </div>
          </div>
          <div className="flex-grow-0 card flex-auto overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    Contact
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
                {contact &&
                  contact.map((ga, i) => (
                    <tr
                      key={`${i}-contact`}
                      className="hover:text-white hover:bg-indigo-500 cursor-pointer"
                    >
                      <Popover2
                        content={
                          <div className="card p-3 focus:outline-none">
                            <h3>{ga.F_Contact}</h3>
                            <p>PHONE {ga.F_Phone}</p>
                            <p>FAX {ga.F_Fax}</p>
                            <p>EMAIL {ga.F_EMail}</p>
                          </div>
                        }
                      >
                        <td className="px-6 py-2 whitespace-nowrap">
                          {ga.F_Contact}
                        </td>
                      </Popover2>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Comments tbname="T_COMPANY" tbid={data[0]?.F_ID} uid={token.uid} />
        <Notification setShow={setShow} show={show} msg={msg} />
      </div>
    );
  } else {
    return <h1>NOT FOUND</h1>;
  }
}
