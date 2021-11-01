import cookie from "cookie";
import {
  Alignment,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Button,
  Dialog,
} from "@blueprintjs/core";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import filterFactory, {
  textFilter,
  selectFilter,
} from "react-bootstrap-table2-filter";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";
import "@blueprintjs/core/lib/css/blueprint.css";
import React, { useState } from "react";
import useSWR from "swr";
import Select from "react-select";

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

export const Navigation = ({ token }) => {
  const [menu, setMenu] = useState(3);
  const { data: checkList } = useSWR("/api/accounting/getCheckList");
  const { data: depositList } = useSWR(
    menu === 2 ? "/api/accounting/getDepositList" : null
  );

  const { data: distinctVendor } = useSWR(
    menu === 3 ? "/api/requests/getDistinctVendors" : null
  );
  const [selectedVendor, setSelectedVendor] = useState(false);
  const { data: accountPayableList } = useSWR(
    selectedVendor
      ? `/api/requests/getAccountPayableListByVendor?vendor=${selectedVendor.value}`
      : null
  );
  const [selectedAccountPayable, setSelectedAccountPayable] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [checkDetails, setCheckDetails] = useState([]);

  const options = distinctVendor
    ? distinctVendor.map((ga) => ({ value: ga, label: ga }))
    : [];

  // When click check, the data is display
  async function getCheckDetail(id) {
    const check = await fetch("/api/accounting/getCheckDetail", {
      headers: {
        id: id,
      },
    }).then(async (j) => await j.json());
    setCheckDetails(check || []);
  }

  async function getDepositDetail(id) {
    const check = await fetch("/api/accounting/getDepositDetail", {
      headers: {
        id: id,
      },
    }).then(async (j) => await j.json());
    setCheckDetails(check || []);
  }

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      // console.log(row);
      if (menu == 1) {
        getCheckDetail(row.F_ID);
      }
      if (menu == 2) {
        getDepositDetail(row.F_ID);
      }
      setIsOpen(row);
    },
  };
  function usdFormat(x) {
    var num = parseFloat(x).toFixed(2);
    if (typeof x == "number") {
      return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "$" + 0;
    }
  }

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

  const handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      setSelectedAccountPayable((prev) => [...prev, row]);
    } else {
      setSelectedAccountPayable(
        selectedAccountPayable.filter((x) => x !== row)
      );
    }
  };

  const handleOnSelectAll = (isSelect, rows) => {
    if (isSelect) {
      setSelectedAccountPayable((prev) => [...prev, ...rows]);
    } else {
      setSelectedAccountPayable(
        selectedAccountPayable.filter((x) => rows.indexOf(x) < 0)
      );
    }
  };

  const selectRow = {
    mode: "checkbox",
    onSelect: handleOnSelect,
    clickToSelect: true,
    onSelectAll: handleOnSelectAll,
    // headerColumnStyle: {
    //   width: "39px",
    //   textAlign: "center",
    //   backgroundColor: "#4e73df",
    // },
    // bgColor: "#ced7f5",
  };

  const selectOptions = {
    121: "APPROVED",
    131: "CONFIRMED BY CEO",
  };

  const classes = "text-xs text-left text-truncate text-uppercase";
  const column = [
    {
      dataField: "F_ID",
      text: "ID",
      classes:
        "text-xs text-center text-truncate text-uppercase font-weight-bold",
      headerStyle: (column, colIndex) => {
        return { width: "100px", textAlign: "center" };
      },
      sort: true,
    },
    {
      dataField: "F_CheckNo",
      text: "CHECK",
      classes,
      sort: true,
    },
    {
      dataField: "BILL",
      text: "VENDOR",
      classes,
    },
    {
      dataField: "BANK",
      text: "BANK",
      classes,
    },
    {
      dataField: "F_U2ID",
      text: "EDITOR",
      classes,
    },
    {
      dataField: "F_U2Date",
      text: "UPDATED",
      classes,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).utc().format("LLL");
        }
      },
    },
    {
      dataField: "F_PostDate",
      text: "POST",
      classes,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).utc().format("L");
        }
      },
      sort: true,
    },
  ];

  const apColumns = [
    {
      dataField: "RefNo",
      text: "REFERENCE",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      classes: "truncate sm:px-0 px-4",
      headerFormatter: filterHeader,
    },
    {
      dataField: "Body",
      text: "VENDOR",
      classes: "text-uppercase cursor-pointer",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      classes: "truncate sm:px-0 px-4",
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
      classes: "truncate sm:px-0 px-4",
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
          className={`rounded text-xs rounded text-center ${
            cell == 121
              ? "bg-blue-500 text-white"
              : cell == 101
              ? "bg-white border border-gray-800 text-gray-500"
              : cell == 110 || cell == 120
              ? "bg-red-500 text-white"
              : "bg-gray-400 text-white"
          }`}
        >
          {selectOptions[cell]}
        </div>
      ),
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
      classes: "truncate sm:px-0 px-4",
      headerFormatter: filterHeader,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).utc().format("lll");
        }
      },
    },
    {
      dataField: "ApType",
      text: "AP",
      headerClasses:
        "text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      classes: "truncate sm:px-0 px-4 uppercase",
      headerFormatter: filterHeader,
    },
  ];

  async function handleAccountPayableSummary() {
    // Assume it is all T_APHD
    setSubmitLoading(true);
    const res = await fetch("/api/requests/getMultipleAPHD", {
      method: "POST",
      body: JSON.stringify({
        selectedVendor,
        vendor: selectedAccountPayable.map((ga) => ga.TBID),
        ref: selectedAccountPayable.map((ga) => ga.RefNo),
      }),
    });

    if (res.status === 200) {
      const blob = await res.blob();
      var file = new Blob([blob], {
        type: blob.type,
      });
      var fileURL = URL.createObjectURL(file);
      setSubmitLoading(false);
      window.open(fileURL);
    } else {
      alert(await res.text());
      setSubmitLoading(false);
    }
  }

  async function handleUpdateStatus() {
    setSubmitLoading(true);
    const res = await fetch("/api/requests/updateMultipleAPstatus", {
      method: "POST",
      body: JSON.stringify({
        request: selectedAccountPayable.map((ga) => ga.ID),
      }),
    });
    if (res.status == 200) {
      alert("Updated Successfully!");
      setSubmitLoading(false);
    } else {
      alert(res.status);
      setSubmitLoading(false);
    }
  }

  return (
    <Layout TOKEN={token} TITLE="Accounting" LOADING={submitLoading}>
      <Navbar
        fixedToTop={false}
        className="my-1 shadow card"
        style={{ zIndex: 0 }}
      >
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Accounting</NavbarHeading>
          <NavbarDivider />
          <Button
            icon="issue-new"
            small={true}
            minimal={true}
            onClick={() => setMenu(3)}
          >
            <span
              className={
                menu === 3 ? "text-blue-500 font-bold" : "dark:text-gray-200"
              }
            >
              Account Payable
            </span>
          </Button>
          <Button
            icon="book"
            small={true}
            minimal={true}
            onClick={() => setMenu(1)}
          >
            <span
              className={
                menu === 1 ? "text-blue-500 font-bold" : "dark:text-gray-200"
              }
            >
              Check
            </span>
          </Button>
          <Button
            icon="bank-account"
            small={true}
            minimal={true}
            intent={menu === 2 ? "primary" : "none"}
            onClick={() => setMenu(2)}
          >
            <span
              className={
                menu === 2 ? "text-blue-400 font-bold" : "dark:text-gray-200"
              }
            >
              Deposit
            </span>
          </Button>
        </NavbarGroup>
      </Navbar>
      {menu == 1 && (
        <>
          <div className="card shadow my-4" style={{ cursor: "pointer" }}>
            <BootstrapTable
              keyField="F_ID"
              hover
              data={checkList || []}
              columns={column}
              rowEvents={rowEvents}
              defaultSorted={[{ dataField: "F_PostDate", order: "desc" }]}
            />
          </div>
          <Dialog
            isOpen={isOpen}
            title={`CHECK ${isOpen.F_ID} (${isOpen.F_CheckNo})`}
            onClose={() => {
              setIsOpen(false);
              setCheckDetails([]);
            }}
            className="bg-white w-75"
            // When user click on the button, width 50 to 100 and height 50 to 100
          >
            <div className="card shadow my-2 mx-2">
              <div className="row px-4 py-4">
                <div className="col-6">
                  <label>VENDOR</label>
                  <input
                    type="text"
                    defaultValue={isOpen.PAY}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>PAY TO</label>
                  <input
                    type="text"
                    defaultValue={isOpen.BILL}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>BANK</label>
                  <input
                    type="text"
                    defaultValue={isOpen.BANK}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                </div>
                <div className="col-3">
                  <label>POST</label>
                  <input
                    type="text"
                    defaultValue={moment(isOpen.F_PostDate).utc().format("L")}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>CHECK NUMBER</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_CheckNo}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>CURRENCY</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_Currency}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                </div>
                <div className="col-3">
                  <label>CLEAR DATE</label>
                  <input
                    type="text"
                    defaultValue={
                      isOpen.F_DepositDate != null
                        ? moment(isOpen.F_DepositDate).utc().format("L")
                        : ""
                    }
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>VOID DATE</label>
                  <input
                    type="text"
                    defaultValue=""
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>VOID</label>
                  <input
                    type="text"
                    defaultValue=""
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                </div>
              </div>
            </div>
            {/* {JSON.stringify(isOpen)} */}
            <div className="card shadow my-2 mx-2">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th scope="col">DEPT</th>
                    <th scope="col">CREATOR</th>
                    <th scope="col">INVOICE</th>
                    <th scope="col">GL</th>
                    <th scope="col">REF NO</th>
                    <th scope="col">DSECRIPTION</th>
                    <th scope="col">INVOICE AMOUNT</th>
                    <th scope="col">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {checkDetails &&
                    checkDetails.map((ga) => (
                      <tr key={ga.F_ID}>
                        <td>{ga.F_Type}</td>
                        <td className="text-uppercase">
                          {ga.CREATOR || isOpen.F_U2ID}
                        </td>
                        <td>{ga.F_OthInvNo || ga.F_InvoiceNo}</td>
                        <td>{ga.F_GLno}</td>
                        <td>{ga.F_RefNo || ga.DESCRIPTION}</td>
                        <td>{ga.F_BLNo || ga.F_Description}</td>
                        <td>{usdFormat(ga.F_PaidAmt) || 0}</td>
                        <td>{usdFormat(ga.F_Amount)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="border-t flex justify-center py-2 px-4 font-bold text-indigo-500">
                TOTAL{" "}
                {usdFormat(
                  checkDetails
                    ? checkDetails.reduce((sum, item) => {
                        return (sum = sum + item.F_Amount);
                      }, 0)
                    : 0
                )}
              </div>
            </div>
            {isOpen.F_Remark && (
              <div className="card shadow m-2 p-3 font-semibold">
                <h5>{isOpen.F_Remark}</h5>
              </div>
            )}
          </Dialog>
        </>
      )}
      {menu === 2 && (
        <>
          <div className="card shadow my-4" style={{ cursor: "pointer" }}>
            <BootstrapTable
              keyField="F_ID"
              hover
              data={depositList || []}
              columns={column}
              rowEvents={rowEvents}
              defaultSorted={[{ dataField: "F_PostDate", order: "desc" }]}
            />
          </div>
          <Dialog
            isOpen={isOpen}
            title={`DEPOSIT ${isOpen.F_ID} (${isOpen.F_CheckNo})`}
            onClose={() => {
              setIsOpen(false);
              setCheckDetails([]);
            }}
            className="bg-white w-75"
            // When user click on the button, width 50 to 100 and height 50 to 100
          >
            <div className="card shadow my-2 mx-2">
              <div className="row px-4 py-4">
                <div className="col-6">
                  <label>CUSTOMER</label>
                  <input
                    type="text"
                    defaultValue={isOpen.BILL}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>RECEIVED FROM</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_ReceivedFrom}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>BANK</label>
                  <input
                    type="text"
                    defaultValue={isOpen.BANK}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                </div>
                <div className="col-3">
                  <label>POST</label>
                  <input
                    type="text"
                    defaultValue={moment(isOpen.F_PostDate).utc().format("L")}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>CHECK NUMBER</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_CheckNo}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>CURRENCY</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_Currency}
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                </div>
                <div className="col-3">
                  <label>CLEAR DATE</label>
                  <input
                    type="text"
                    defaultValue={
                      isOpen.F_DepositDate != null
                        ? moment(isOpen.F_DepositDate).utc().format("L")
                        : ""
                    }
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>VOID DATE</label>
                  <input
                    type="text"
                    defaultValue=""
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                  <label>VOID</label>
                  <input
                    type="text"
                    defaultValue=""
                    className="form-control font-weight-light text-xs mb-2"
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="card shadow my-2 mx-2">
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th scope="col">DEPT</th>
                    <th scope="col">CREATOR</th>
                    <th scope="col">INVOICE</th>
                    <th scope="col">GL</th>
                    <th scope="col">REF NO</th>
                    <th scope="col">DSECRIPTION</th>
                    <th scope="col">INVOICE AMOUNT</th>
                    <th scope="col">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {checkDetails &&
                    checkDetails.map((ga) => (
                      <tr key={ga.F_ID}>
                        <td>{ga.F_Type}</td>
                        <td className="text-uppercase">
                          {ga.CREATOR || isOpen.F_U2ID}
                        </td>
                        <td>{ga.F_OthInvNo || ga.F_InvoiceNo}</td>
                        <td>{ga.F_GLno}</td>
                        <td>{ga.F_RefNo || ga.DESCRIPTION}</td>
                        <td>{ga.F_BLNo || ga.F_Description}</td>
                        <td>{usdFormat(ga.F_PaidAmt) || 0}</td>
                        <td>{usdFormat(ga.F_Amount)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <div className="border-t flex justify-center py-2 px-4 font-bold text-indigo-500">
                TOTAL{" "}
                {usdFormat(
                  checkDetails
                    ? checkDetails.reduce((sum, item) => {
                        return (sum = sum + item.F_Amount);
                      }, 0)
                    : 0
                )}
              </div>
            </div>

            {isOpen.F_Remark && (
              <div className="card shadow m-2 p-3 font-semibold">
                <h5>{isOpen.F_Remark}</h5>
              </div>
            )}
          </Dialog>
        </>
      )}
      {menu === 3 && (
        <>
          <Select
            options={options}
            className="my-3"
            placeholder="Select James Worldwide Vendors"
            onChange={(e) => {
              setSelectedVendor(e);
              setSelectedAccountPayable([]);
            }}
          />
          <div className="flex flex-row-reverse gap-4 my-3">
            <button
              className={`p-2 text-white rounded text-xs ${
                selectedAccountPayable.length
                  ? "bg-indigo-500 hover:bg-indigo-300"
                  : "bg-gray-500"
              }`}
              disabled={!selectedAccountPayable.length}
              onClick={handleAccountPayableSummary}
            >
              <i className="fa fa-print" /> PRINT SUMMARY
            </button>
            <button
              className={`p-2 text-white rounded text-xs ${
                selectedAccountPayable.length
                  ? "bg-indigo-500 hover:bg-indigo-300"
                  : "bg-gray-500"
              }`}
              onClick={handleUpdateStatus}
              disabled={!selectedAccountPayable.length}
            >
              <i className="fa fa-check-circle" /> UPDATE STATUS
            </button>
          </div>
          <div className="card border-0 py-3 px-0 shadow mt-3 overflow-x-auto">
            <ToolkitProvider
              keyField="ID"
              bordered={false}
              columns={apColumns}
              data={accountPayableList ? accountPayableList : []}
              exportCSV
              search
            >
              {(props) => (
                <BootstrapTable
                  {...props.baseProps}
                  rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer dark:bg-gray-700 dark:text-white"
                  condensed
                  rowStyle={{ cursor: "pointer" }}
                  filter={filterFactory()}
                  wrapperClasses="rounded table-fixed mx-0 px-0"
                  bordered={false}
                  // pagination={paginationFactory(pageOption)}
                  selectRow={selectRow}
                />
              )}
            </ToolkitProvider>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Navigation;
