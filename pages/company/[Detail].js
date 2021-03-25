import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { useRouter } from "next/router";
import { formatAmountForDisplay } from "../../components/Utils/stripe-helpers";
import { fetchPostJSON } from "../../components/Utils/api-helper";
import getStripe from "../../components/Utils/get-stripejs";
import { Comment } from "../../components/Forwarding/Comment";
import { Dialog, Classes, Button } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";

export default function Customer({ Cookie, Company, Id }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [balance, setBalance] = React.useState(false);
  const [invoice, setInvoice] = React.useState(false);
  const [open, setOpen] = React.useState(0);

  React.useEffect(() => {
    !TOKEN && useRouter().push("/login");
    getBalance();
  }, []);

  async function getBalance() {
    const balanceRes = await fetch(`/api/accounting/getBalance`, {
      headers: {
        customer: Id,
        key: Cookie.jamesworldwidetoken,
      },
    });
    if (balanceRes.status === 200) {
      const balance = await balanceRes.json();
      setBalance(balance[0]);
      // console.log(balance[0]);
    } else {
      console.log(balanceRes.status);
    }
    const accRes = await fetch(`/api/accounting/getAccViewByID`, {
      headers: {
        company: Id,
      },
    });
    const acc = await accRes.json();
    setInvoice(acc);
  }
  const handleSubmit = async () => {
    const response = await fetchPostJSON("/api/stripe/checkout_sessions", {
      amount: Math.round(balance.F_Balance * 1.03),
      name: Company.company.FName,
      id: Id,
    });
    if (response.statusCode === 500) {
      console.log("error from customer");
      console.error(response.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.id,
    });
    console.warn(error.message);
  };

  const checkoutInvoice = async (amount, name) => {
    const response = await fetchPostJSON("/api/stripe/checkout_sessions", {
      amount,
      name,
      id: Id,
    });
    if (response.statusCode === 500) {
      console.log("error from customer");
      console.error(response.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.id,
    });
    console.warn(error.message);
  };

  return (
    <Layout TOKEN={jwt.decode(Cookie.jamesworldwidetoken)} TITLE={Id}>
      {Company ? (
        <>
          <h3>{Company.company.FName}</h3>
          <div className="row my-4 text-xs">
            <div className="col-md-6">
              <div className="card border-left-primary shadow">
                <div className="card-body">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-3">
                    Location
                  </div>
                  <p className="text-xs">ADDRESS: {Company.company.Addr}</p>
                  <p className="text-xs">CITY: {Company.company.City}</p>
                  <p className="text-xs">STATE: {Company.company.State}</p>
                  <p className="text-xs">COUNTRY: {Company.company.Country}</p>
                  <p className="text-xs">ZIP: {Company.company.ZipCode}</p>
                </div>
              </div>
              <div className="card border-left-primary shadow my-2">
                <div className="card-body">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-3">
                    Contact
                  </div>
                  {Company.companycontact.length > 0 ? (
                    Company.companycontact.map((ga, i) => (
                      <div key={ga.ID}>
                        {ga.Contact && (
                          <p className="text-xs">CONTACT: {ga.Contact}</p>
                        )}
                        {ga.EMail && (
                          <a target="__blank" href={`mailto:${ga.EMail}`}>
                            <p className="text-xs">EMAIL: {ga.EMail}</p>
                          </a>
                        )}
                        {ga.Phone && (
                          <p className="text-xs">PHONE: {ga.Phone}</p>
                        )}
                        {ga.Fax && <p className="text-xs">FAX: {ga.Fax}</p>}
                        {i !== Company.companycontact.length - 1 && <hr />}
                      </div>
                    ))
                  ) : (
                    <div className="alert alert-secondary mb-0">
                      No Contact Information
                    </div>
                  )}
                </div>
              </div>
              <div className="card border-left-primary shadow my-2">
                <div className="card-body">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-3">
                    Tax Info
                  </div>
                  <p>TAX ID Type: {Company.company.IRSType}</p>
                  <p>TAX ID: {Company.company.IRSNo}</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 text-xs">
              <div className="card border-left-success shadow mb-2">
                <div className="card-body">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-3">
                    Balance
                  </div>
                  {balance && (
                    <>
                      <p>
                        Balance:{" "}
                        {balance.F_Balance !== null &&
                          formatAmountForDisplay(balance.F_Balance, "usd")}
                      </p>
                      <p>
                        CR/DR:{" "}
                        {balance.F_CrDr !== null &&
                          formatAmountForDisplay(balance.F_Balance, "usd")}
                      </p>
                      <p>
                        AR:{" "}
                        {balance.F_AR != null &&
                          formatAmountForDisplay(balance.F_AR, "usd")}
                      </p>
                      <p>
                        AP:{" "}
                        {balance.F_AP != null &&
                          formatAmountForDisplay(balance.F_AP, "usd")}
                      </p>
                      <hr />
                      <p>
                        Last Pay Amount:{" "}
                        {balance.F_LastPayAmount != null &&
                          formatAmountForDisplay(
                            balance.F_LastPayAmount,
                            "usd"
                          )}
                      </p>
                      <p>Last Pay: {balance.F_LastPayDate}</p>
                      <hr />
                      <p>
                        Last Deposit Amount:{" "}
                        {balance.F_LastDepositAmount != null &&
                          formatAmountForDisplay(
                            balance.F_LastDepositAmount,
                            "usd"
                          )}
                      </p>
                      <p>Last Deposit Date: {balance.F_LastDepositDate}</p>
                      <hr />
                      <button
                        className="btn btn-outline-success text-xs"
                        disabled={balance.F_Balance <= 0}
                        onClick={handleSubmit}
                      >
                        Credit Card Payment{" "}
                        {formatAmountForDisplay(
                          Math.round(balance.F_Balance * 1.03),
                          "usd"
                        )}
                      </button>
                      <br />
                      <span className="text-secondary">
                        Each transaction will charge transaction fee of 3%
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="card border-left-success shadow">
                <div className="card-body">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-3">
                    Pending Invoice
                  </div>
                  <ul className="list-group list-group-flush"></ul>
                  {invoice && invoice.length > 0 ? (
                    invoice.map((ga, i) => (
                      <li
                        className="list-group-item btn btn-link text-danger py-1 text-xs"
                        key={ga.F_ID + ga.F_TBName}
                        onClick={() => setOpen(i + 1)}
                      >
                        {ga.F_InvoiceNo}
                      </li>
                    ))
                  ) : (
                    <div className="alert alert-secondary mb-0">
                      No Pending Invoice
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h3>{Id} NOT FOUND</h3>
      )}
      <Comment reference={Id} uid={TOKEN.uid} main={Company.company} />
      <Dialog
        isOpen={open}
        title="Invoice Detail"
        icon="dollar"
        onClose={() => setOpen(0)}
      >
        <div className={Classes.DIALOG_BODY}>
          <div>
            {open && (
              <div>
                <h4>{invoice[open - 1].F_InvoiceNo}</h4>
                <p>
                  INVOICE AMOUNT:{" "}
                  {formatAmountForDisplay(
                    invoice[open - 1].F_InvoiceAmt,
                    "usd"
                  )}
                </p>
                <p>
                  TOTAL PAID:{" "}
                  {formatAmountForDisplay(invoice[open - 1].F_PaidAmt, "usd")}
                </p>
                <p>DUE DATE: {invoice[open - 1].F_DueDate}</p>
                <p>PERSON IN CHARGE: {invoice[open - 1].PIC}</p>
                <p className="text-warning">
                  Each transaction will charge transaction fee of 3%
                </p>
              </div>
            )}
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setOpen(0)}>Close</Button>
            <Button
              intent="primary"
              disabled={open && invoice[open - 1].F_InvoiceAmt <= 0}
              onClick={() => {
                if (open) {
                  checkoutInvoice(
                    invoice[open - 1].F_InvoiceAmt * 1.03,
                    `${invoice[open - 1].CompanyName}(${
                      invoice[open - 1].F_InvoiceNo
                    })`
                  );
                }
              }}
            >
              Checkout{" "}
              {open &&
                formatAmountForDisplay(
                  invoice[open - 1].F_InvoiceAmt * 1.03,
                  "usd"
                )}
            </Button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  var company = false;
  var accInfo = false;
  const companyContactFetch = await fetch(
    `${process.env.FS_BASEPATH}Company_CompanyContact/${query.Detail}`,
    {
      headers: { "x-api-key": process.env.JWT_KEY },
    }
  );
  if (companyContactFetch.status === 200) {
    company = await companyContactFetch.json();
  } else {
    console.log(companyContactFetch.status);
  }

  // Pass data to the page via props
  return {
    props: {
      Cookie: cookies,
      Company: company,
      Id: query.Detail,
    },
  };
}
