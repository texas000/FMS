import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { useRouter } from "next/router";
import { formatAmountForDisplay } from "../../components/Utils/stripe-helpers";
import { fetchPostJSON } from "../../components/Utils/api-helper";
import getStripe from "../../components/Utils/get-stripejs";
import { Comment } from "../../components/Forwarding/Comment";
import { Dialog, Classes, Button, InputGroup } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";

export default function Customer({ Cookie, Company, Id, Firebase }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [balance, setBalance] = React.useState(false);
  const [invoice, setInvoice] = React.useState(false);
  const [open, setOpen] = React.useState(0);
  const [search, setSearch] = React.useState(false);

  React.useEffect(() => {
    !TOKEN && router.push("/login");
    getBalance();
  }, []);

  function getResult() {
    if (search.length < 2) {
      alert("SEARCH QUERY MUST BE GRATER THAN 2 WORDS");
    } else {
      router.push({ pathname: `/company`, query: { search } });
    }
  }

  async function getBalance() {
    const balanceRes = await fetch(`/api/accounting/getBalance`, {
      headers: {
        customer: Id,
        key: Cookie.jamesworldwidetoken,
      },
    });
    if (balanceRes.status === 200) {
      const balance = await balanceRes.json();
      // console.log(balance);
      setBalance(balance[0]);
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
      {/* <Head>
        <script
          async
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDti1yLvLp4RYMBR2hHBDk7jltZU44xJqc"
        ></script>
      </Head> */}
      {Company ? (
        <>
          <div className="d-flex flex-sm-row justify-content-between mb-0">
            <div className="flex-column">
              <h3 className="mb-4 font-weight-light">
                {Company.company.FName}
              </h3>
            </div>
            <div className="flex-column">
              <InputGroup
                large={true}
                leftIcon="search"
                placeholder="Search company..."
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key == "Enter") getResult();
                }}
              ></InputGroup>
            </div>
          </div>
          <div className="row my-4 text-xs">
            <div className="col-md-6">
              <div className="card border-left-primary shadow">
                <div className="card-body">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-3">
                    Location
                  </div>
                  <div className="row">
                    <div className="col">
                      <p className="text-xs">ADDRESS: {Company.company.Addr}</p>
                      <p className="text-xs">CITY: {Company.company.City}</p>
                      <p className="text-xs">STATE: {Company.company.State}</p>
                      <p className="text-xs">
                        COUNTRY: {Company.company.Country}
                      </p>
                      <p className="text-xs">ZIP: {Company.company.ZipCode}</p>
                    </div>
                    <div className="col">
                      <a
                        target="_blank"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          Company.company.Addr +
                            "+" +
                            Company.company.City +
                            "+" +
                            Company.company.State +
                            "+" +
                            Company.company.ZipCode
                        )}`}
                        style={{ textDecoration: "none" }}
                      >
                        <button className="btn btn-outline-primary btn-sm text-xs">
                          <i className="fa fa-map"></i> Open with Google Maps
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card border-left-primary shadow my-2">
                <div className="card-body">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-3">
                    Contact
                  </div>
                  <div className="row">
                    {Company.companycontact.length > 0 ? (
                      Company.companycontact.map((ga, i) => (
                        <div key={ga.ID} className="col-6">
                          <div
                            className="card mb-3"
                            style={{ border: "1px solid #D3D3D3" }}
                          >
                            <div className="card-body pb-1 pt-3">
                              <div className="row align-items-center">
                                <div className="col-auto">
                                  <i className="fa fa-address-card fa-2x text-gray-300 mb-2"></i>
                                </div>
                                <div className="col ml-2">
                                  <p className="text-xs">NAME: {ga.Contact}</p>

                                  <p className="text-xs">
                                    EMAIL:{" "}
                                    <a
                                      target="__blank"
                                      href={`mailto:${ga.Email}`}
                                    >
                                      {ga.EMail}
                                    </a>
                                  </p>
                                  <p className="text-xs">PHONE: {ga.Phone}</p>
                                  <p className="text-xs">FAX: {ga.Fax}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="alert alert-secondary mb-0 col mx-2">
                        No Contact Information
                      </div>
                    )}
                  </div>
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
                      <div className="row">
                        <div className="col">
                          <p>
                            Balance:{" "}
                            {formatAmountForDisplay(
                              balance.F_Balance || 0,
                              "usd"
                            )}
                          </p>
                          <p>
                            CR/DR:{" "}
                            {formatAmountForDisplay(balance.F_CrDr || 0, "usd")}
                          </p>
                          <p>
                            AR:{" "}
                            {formatAmountForDisplay(balance.F_AR || 0, "usd")}
                          </p>
                          <p>
                            AP:{" "}
                            {formatAmountForDisplay(balance.F_AP || 0, "usd")}
                          </p>
                        </div>
                        {/* <div className="col">
                          <Doughnut
                            data={{
                              labels: ["Balance", "CRDR", "AR", "AP"],
                              datasets: [
                                {
                                  data: [
                                    parseFloat(balance.F_Balance || 0).toFixed(
                                      2
                                    ),
                                    parseFloat(balance.F_CrDr || 0).toFixed(2),
                                    parseFloat(balance.F_AR || 0).toFixed(2),
                                    parseFloat(balance.F_AP || 0).toFixed(2),
                                  ],
                                  backgroundColor: [
                                    "#4e73df",
                                    "#858796",
                                    "#4e73df",
                                    "#858796",
                                  ],
                                  hoverBackgroundColor: [
                                    "#4e73df",
                                    "#858796",
                                    "#4e73df",
                                    "#858796",
                                  ],
                                },
                              ],
                            }}
                          />
                        </div> */}
                      </div>
                      <hr />
                      <p>
                        Last Pay Amount:{" "}
                        {formatAmountForDisplay(
                          balance.F_LastPayAmount || 0,
                          "usd"
                        )}
                      </p>
                      <p>Last Pay Date: {balance.F_LastPayDate}</p>
                      <hr />
                      <p>
                        Last Deposit Amount:{" "}
                        {formatAmountForDisplay(
                          balance.F_LastDepositAmount || 0,
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
      <Comment
        reference={Id}
        uid={TOKEN.uid}
        main={Company.company}
        Firebase={Firebase}
      />
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
                  (invoice[open - 1].F_InvoiceAmt -
                    invoice[open - 1].F_PaidAmt || 0) * 1.03,
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
      Firebase: process.env.FIREBASE_API_KEY,
    },
  };
}
