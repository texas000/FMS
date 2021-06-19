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
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../../components/Layout";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";
import "@blueprintjs/core/lib/css/blueprint.css";

export const Navigation = ({ Cookie }) => {
  const router = useRouter();
  const [menu, setMenu] = React.useState(1);
  const [checks, setChecks] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [checkDetails, setCheckDetails] = React.useState([]);
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  async function getCheckDetail(id) {
    const check = await fetch("/api/accounting/getCheckDetail", {
      headers: {
        key: Cookie.jamesworldwidetoken,
        id: id,
      },
    }).then(async (j) => await j.json());
    setCheckDetails(check);
  }

  async function getDepositDetail(id) {
    const check = await fetch("/api/accounting/getDepositDetail", {
      headers: {
        key: Cookie.jamesworldwidetoken,
        id: id,
      },
    }).then(async (j) => await j.json());
    setCheckDetails(check);
  }

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(row);
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

  const classes =
    "text-xs text-left text-truncate text-uppercase font-weight-bold";
  const column = [
    {
      dataField: "F_ID",
      text: "ID",
      classes:
        "w-50 text-xs text-center text-truncate text-uppercase font-weight-bold",
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
    // {
    //   dataField: "PAY",
    //   text: "PAY TO",
    //   classes,
    // },
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
  async function getChecks() {
    const check = await fetch("/api/accounting/getCheckList", {
      headers: {
        key: Cookie.jamesworldwidetoken,
      },
    }).then(async (j) => await j.json());
    setChecks(check);
  }
  async function getDeposit() {
    const check = await fetch("/api/accounting/getDepositList", {
      headers: {
        key: Cookie.jamesworldwidetoken,
      },
    }).then(async (j) => await j.json());
    setChecks(check);
  }

  useEffect(() => {
    if (TOKEN.admin > 6) {
      setChecks([]);
      switch (menu) {
        case 1:
          getChecks();
        case 2:
          getDeposit();
      }
    } else {
      console.log("ACCESS DENIED");
    }
    !TOKEN && router.push("/login");
  }, [menu]);

  return (
    <Layout TOKEN={TOKEN} TITLE="Accounting">
      <Navbar fixedToTop={false} className="my-1 shadow" style={{ zIndex: 0 }}>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Accounting</NavbarHeading>
          <NavbarDivider />
          <Button
            icon="book"
            text="Check"
            small={true}
            minimal={true}
            intent={menu === 1 ? "primary" : "none"}
            onClick={() => setMenu(1)}
          ></Button>
          <Button
            icon="bank-account"
            text="Deposit"
            small={true}
            minimal={true}
            intent={menu === 2 ? "primary" : "none"}
            onClick={() => setMenu(2)}
          ></Button>
        </NavbarGroup>
      </Navbar>
      {menu == 1 && (
        <>
          <div
            className="card shadow py-2 px-2 my-4"
            style={{ cursor: "pointer" }}
          >
            <BootstrapTable
              keyField="F_ID"
              hover
              data={checks}
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
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>PAY TO</label>
                  <input
                    type="text"
                    defaultValue={isOpen.BILL}
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>BANK</label>
                  <input
                    type="text"
                    defaultValue={isOpen.BANK}
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                </div>
                <div className="col-3">
                  <label>POST</label>
                  <input
                    type="text"
                    defaultValue={moment(isOpen.F_PostDate).utc().format("L")}
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>CHECK NUMBER</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_CheckNo}
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>CURRENCY</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_Currency}
                    className="form-control font-weight-light mb-2"
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
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>VOID DATE</label>
                  <input
                    type="text"
                    defaultValue=""
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>VOID</label>
                  <input
                    type="text"
                    defaultValue=""
                    className="form-control font-weight-light mb-2"
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
                  {checkDetails.map((ga) => (
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
                  <tr className="font-weight-bold text-center bg-gray-500 text-white">
                    <td colSpan="6">TOTAL</td>
                    <td colSpan="2">
                      {usdFormat(
                        checkDetails.reduce((sum, item) => {
                          return (sum = sum + item.F_Amount);
                        }, 0)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {isOpen.F_Remark && (
              <div className="card shadow my-2 mx-2 px-4 pt-2">
                <h5>{isOpen.F_Remark}</h5>
              </div>
            )}
          </Dialog>
        </>
      )}
      {menu === 2 && (
        <>
          <div
            className="card shadow py-2 px-2 my-4"
            style={{ cursor: "pointer" }}
          >
            <BootstrapTable
              keyField="F_ID"
              hover
              data={checks}
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
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>RECEIVED FROM</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_ReceivedFrom}
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>BANK</label>
                  <input
                    type="text"
                    defaultValue={isOpen.BANK}
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                </div>
                <div className="col-3">
                  <label>POST</label>
                  <input
                    type="text"
                    defaultValue={moment(isOpen.F_PostDate).utc().format("L")}
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>CHECK NUMBER</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_CheckNo}
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>CURRENCY</label>
                  <input
                    type="text"
                    defaultValue={isOpen.F_Currency}
                    className="form-control font-weight-light mb-2"
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
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>VOID DATE</label>
                  <input
                    type="text"
                    defaultValue=""
                    className="form-control font-weight-light mb-2"
                    disabled
                  />
                  <label>VOID</label>
                  <input
                    type="text"
                    defaultValue=""
                    className="form-control font-weight-light mb-2"
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
                  {checkDetails.map((ga) => (
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
                  <tr className="font-weight-bold text-center bg-gray-500 text-white">
                    <td colSpan="6">TOTAL</td>
                    <td colSpan="2">
                      {usdFormat(
                        checkDetails.reduce((sum, item) => {
                          return (sum = sum + item.F_Amount);
                        }, 0)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* <code>{JSON.stringify(checkDetails)}</code> */}
            </div>

            {isOpen.F_Remark && (
              <div className="card shadow my-2 mx-2 px-4 pt-2">
                <h5>{isOpen.F_Remark}</h5>
              </div>
            )}
          </Dialog>
        </>
      )}
    </Layout>
  );
};

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  return { props: { Cookie: cookies } };
}
export default Navigation;
