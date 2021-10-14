import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import { Dialog, Classes, Tag, Button } from "@blueprintjs/core";
import { useState } from "react";
import usdFormat from "../lib/currencyFormat";
import moment from "moment";
import { BlobProvider } from "@react-pdf/renderer";
import CheckRequestForm from "../components/Dashboard/CheckRequestForm";
import router from "next/router";

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
export default function request(props) {
  const [selected, setSelected] = useState(false);
  const { data, mutate } = useSWR("/api/requests/get");
  const { data: invoice } = useSWR("api/requests/getInvoiceList");
  const { data: ap } = useSWR(
    selected
      ? `/api/requests/detail?table=${selected.TBName}&id=${selected.TBID}`
      : null
  );

  function filterHeader(column, colIndex, { sortElement, filterElement }) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {column.text}
        {filterElement}
        {sortElement}
      </div>
    );
  }

  const Status = ({ data }) => {
    if (data == 101) {
      return <span className="text-green-500 font-bold">REQUESTED</span>;
    }
    if (data == 110) {
      return <span className="text-red-500 font-bold">DIRECTOR REJECTED</span>;
    }
    if (data == 111) {
      return (
        <span className="text-green-500 font-bold">DIRECTOR APPROVED</span>
      );
    }
    if (data == 120) {
      return (
        <span className="text-red-500 font-bold">ACCOUNTING REJECTED</span>
      );
    }
    if (data == 121) {
      return (
        <span className="text-green-500 font-bold">ACCOUNTING APPROVED</span>
      );
    }
  };

  const selectOptions = {
    101: "REQUESTED",
    110: "DIRECTOR REJECTED",
    111: "DIRECTOR",
    120: "ACCOUNTING REJECTED",
    121: "APPROVED",
  };

  const selectInvoiceOptions = {
    101: "REQUESTED",
    110: "REJECTED",
    111: "APPROVED",
  };

  const column = [
    {
      dataField: "RefNo",
      text: "REFERENCE",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "Body",
      text: "VENDOR",
      classes: "text-uppercase cursor-pointer",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      classes: "truncate",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "Title",
      text: "INVOICE",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "Status",
      text: "STATUS",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: selectFilter({
        className: "text-xs text-center hidden sm:block",
        options: selectOptions,
      }),
      formatter: (cell) => (
        <div
          className={`rounded text-xs rounded text-center text-white ${
            cell == 121
              ? "bg-blue-500"
              : cell == 101
              ? "bg-gray-400"
              : cell == 110 || cell == 120
              ? "bg-red-500"
              : "bg-gray-500"
          }`}
        >
          {selectOptions[cell]}
        </div>
      ),
      headerFormatter: filterHeader,
    },
    {
      dataField: "Creator",
      text: "CREATOR",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "CreateAt",
      text: "CREATED",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).utc().format("lll");
        }
      },
    },
  ];

  const invoiceColumn = [
    {
      dataField: "REFNO",
      text: "REFERENCE",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "BILLTO",
      text: "CUSTOMER",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      classes: "truncate",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "INVOICE",
      text: "INVOICE",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "STATUS",
      text: "STATUS",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: selectFilter({
        className: "text-xs text-center hidden sm:block",
        options: selectInvoiceOptions,
      }),
      formatter: (cell) => (
        <div
          className={`rounded text-xs rounded text-center text-white ${
            cell == 101
              ? "bg-gray-500"
              : cell == 111
              ? "bg-blue-500"
              : "bg-red-500"
          }`}
        >
          {selectInvoiceOptions[cell]}
        </div>
      ),
      headerFormatter: filterHeader,
    },
    {
      dataField: "CREATOR",
      text: "CREATOR",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "CREATED",
      text: "CREATED",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).utc().format("lll");
        }
      },
    },
  ];

  const pageOption = {
    sizePerPageList: [{ text: "10", value: 10 }],
    custom: true,
  };

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      setSelected(row);
    },
  };

  const invoiceRowEvents = {
    onClick: (e, row, rowIndex) => {
      router.push(row.PATH);
    },
  };

  async function updateRequest(approve) {
    // UPDATE STATUS AND SEND MAIL TO RELATED
    const res = await fetch(
      `/api/requests/update?id=${selected.ID}&approve=${approve}`
    );
    console.log(res.status);
    mutate();
    setSelected(false);
  }

  return (
    <Layout TOKEN={props.token} TITLE="Dashboard" LOADING={!data}>
      <div className="flex flex-sm-row justify-between">
        <h3 className="dark:text-white">Account Payable</h3>
      </div>
      <div className="card border-0 py-3 px-0 shadow mt-3 overflow-x-auto">
        <ToolkitProvider
          keyField="ID"
          bordered={false}
          columns={column}
          data={data ? data : []}
          exportCSV
          search
        >
          {(props) => (
            <PaginationProvider pagination={paginationFactory(pageOption)}>
              {({ paginationProps, paginationTableProps }) => (
                <div className="flex flex-col">
                  <div className="flex flex-row-reverse mr-2">
                    <PaginationListStandalone {...paginationProps} />
                  </div>
                  <BootstrapTable
                    {...props.baseProps}
                    {...paginationTableProps}
                    rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer dark:bg-gray-700 dark:text-white"
                    condensed
                    rowStyle={{ cursor: "pointer" }}
                    filter={filterFactory()}
                    wrapperClasses="rounded table-fixed mx-0 px-0"
                    bordered={false}
                    // pagination={paginationFactory(pageOption)}
                    rowEvents={rowEvents}
                  />
                </div>
              )}
            </PaginationProvider>
          )}
        </ToolkitProvider>
      </div>
      <div className="flex flex-sm-row mt-4 justify-between">
        <h3 className="dark:text-white">Invoice</h3>
      </div>

      <div className="card border-0 py-3 px-0 shadow my-3 overflow-x-auto">
        <ToolkitProvider
          keyField="ID"
          bordered={false}
          columns={invoiceColumn}
          data={invoice ? invoice : []}
          exportCSV
          search
        >
          {(props) => (
            <PaginationProvider pagination={paginationFactory(pageOption)}>
              {({ paginationProps, paginationTableProps }) => (
                <div className="flex flex-col">
                  <div className="flex flex-row-reverse mr-2">
                    <PaginationListStandalone {...paginationProps} />
                  </div>
                  <BootstrapTable
                    {...props.baseProps}
                    {...paginationTableProps}
                    rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer dark:bg-gray-700 dark:text-white"
                    condensed
                    rowStyle={{ cursor: "pointer" }}
                    filter={filterFactory()}
                    wrapperClasses="rounded table-fixed mx-0 px-0"
                    bordered={false}
                    rowEvents={invoiceRowEvents}
                  />
                </div>
              )}
            </PaginationProvider>
          )}
        </ToolkitProvider>
      </div>

      <Dialog
        isOpen={selected}
        onClose={() => {
          setSelected(false);
        }}
        title="Manage Request"
        className="dark:bg-gray-600"
      >
        <div className={`${Classes.DIALOG_BODY} h-100`}>
          <h5>Would you like to accept request?</h5>
          <div className="card my-2">
            <div className="d-flex justify-content-between bg-gray-100 text-black dark:bg-gray-500 dark:text-white rounded-t shadow-inner p-2">
              <span className="font-extrabold text-lg px-2">
                {selected.Title}
              </span>
            </div>
            {/* RefNo */}
            <div className="leading-8 p-3">
              <p className="font-bold">Reference: {selected.RefNo}</p>
              <p>
                Status: <Status data={selected.Status} />
              </p>
              <p>
                Type: <mark className="text-uppercase">{selected.ApType}</mark>
              </p>
              {/* {JSON.stringify(selected)} */}
              {/* <p>Customer: {selected.Body}</p> */}
              {ap ? (
                <div>
                  <p>Customer: {ap.Customer}</p>
                  <p>Vendor : {selected.Body}</p>
                  <p>
                    Total Amount:{" "}
                    <mark className="font-bold">
                      {usdFormat(ap.F_InvoiceAmt)}
                    </mark>
                  </p>
                  <ul className="my-2 px-2 divide-y divide-gray-300 rounded border border-gray-100">
                    {ap.Detail.length &&
                      ap.Detail.map((ga) => (
                        <li key={ga.F_ID} className="flex justify-between">
                          <span>{ga.F_Description}</span>
                          <span>{usdFormat(ga.F_Amount)}</span>
                        </li>
                      ))}
                  </ul>
                  {ap.Files.length &&
                    ap.Files.map((ga, i) => (
                      <Tag
                        key={`FILE${i}`}
                        icon="cloud-download"
                        interactive={true}
                        intent="primary"
                        className="p-2 my-2 mx-1"
                        onClick={() => {
                          window.location.assign(
                            `/api/file/get?ref=${
                              selected.RefNo
                            }&file=${encodeURIComponent(ga.FILENAME)}`
                          );
                        }}
                      >
                        {ga.FILENAME}
                      </Tag>
                    ))}
                  <BlobProvider
                    document={
                      <CheckRequestForm
                        oim={selected.RefNo}
                        pic={selected.Creator}
                        payto={ap.Vendor}
                        customer={ap.Customer}
                        amt={ap.F_InvoiceAmt}
                        type={selected.ApType.toUpperCase()}
                        desc={ap.Detail.map(
                          (ga) => `\t\t${ga.F_Description}\n`
                        ).join("")}
                        inv={ap.F_InvoiceNo}
                        due={
                          ap.F_DueDate
                            ? moment(ap.F_DueDate).utc().format("L")
                            : ""
                        }
                        approved={
                          selected.Status === 111 || selected.Status === 121
                        }
                      />
                    }
                  >
                    {({ blob, url, loading, error }) => (
                      <a
                        href={url}
                        target="__blank"
                        style={{ textDecoration: "none" }}
                      >
                        <Tag
                          icon="cloud-download"
                          interactive={true}
                          intent="primary"
                          className="p-2 my-2 mx-1"
                        >
                          Form
                        </Tag>
                      </a>
                    )}
                  </BlobProvider>
                </div>
              ) : (
                <div></div>
              )}
              <p className="mt-2">
                Requested: {moment(selected.CreateAt).utc().format("LLL")} by{" "}
                {selected.Creator}
              </p>
              <p>
                Approved: {moment(selected.ModifyAt).utc().format("LLL")} by{" "}
                {selected.Modifier}
              </p>
            </div>
          </div>
        </div>

        <div
          className={`${Classes.DIALOG_FOOTER} d-flex justify-content-between`}
        >
          <Button
            text="Approve"
            fill={true}
            onClick={() => updateRequest(true)}
            disabled={
              props.token.admin === 6
                ? !(selected.Status === 101 || selected.Status === 110)
                : props.token.admin === 9
                ? selected.Status !== 111
                : true
            }
          />
          <Button
            text="Reject"
            fill={true}
            minimal={true}
            onClick={() => updateRequest(false)}
            disabled={
              props.token.admin === 6
                ? selected.Status !== 101
                : props.token.admin === 9
                ? selected.Status !== 111
                : true
            }
          />
          {/* WHEN REQUEST HAPPEN, UPLOAD TO DATABASE AND SEND THE NOTIFICATION TO IAN */}
        </div>
      </Dialog>
    </Layout>
  );
}
