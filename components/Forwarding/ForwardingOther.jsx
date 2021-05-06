import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { useEffect } from "react";
import { Table } from "reactstrap";
import OtherCover from "./OtherCover";
import CheckRequestForm from "./CheckRequestForm";
import moment from "moment";
export const Other = ({ Master }) => {
  const [isClient, setIsClient] = React.useState(false);
  const [ap, setAp] = React.useState([]);
  useEffect(() => {
    // console.log(Master);
    setIsClient(true);
    getAccountPayable();
  }, []);

  // Get Account Payable
  var tempAccountPayable = [];
  async function getAccountPayable() {
    const fetchAP = await fetch(`/api/dev/getAphd`, {
      headers: { table: "T_GENMAIN", tbid: Master.ID },
    });
    if (fetchAP.status === 200) {
      const accountPayable = await fetchAP.json();
      tempAccountPayable = accountPayable;
      if (accountPayable.length > 0) {
        // If AP data is exist, then fetch account payable contact
        accountPayable.map((ga, i) => {
          getAccountPayableContact(ga.PayTo, i);
        });
      } else {
        setAp(accountPayable);
      }
    }
  }
  // Get Account Payable Company Contact
  async function getAccountPayableContact(payto, i) {
    const CompanyContactFetch = await fetch(`/api/dev/getCompanyContact`, {
      headers: { payto: payto },
    });
    if (CompanyContactFetch.status === 200) {
      const contact = await CompanyContactFetch.json();
      tempAccountPayable[i] = {
        ...tempAccountPayable[i],
        PayToCustomer: contact,
      };
      console.log(tempAccountPayable);
      setAp(tempAccountPayable);
    }
  }

  function numberWithCommas(x) {
    var num = parseFloat(x).toFixed(2);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const CoverFormDownload = () => (
    <PDFDownloadLink
      document={<OtherCover master={Master} />}
      fileName={Master.RefNo}
      className="py-0 my-0"
    >
      {({ blob, url, loading, error }) => (
        <Button
          loading={loading}
          text="COVER DOWNLOAD"
          icon="download"
          intent="primary"
          className="mx-1"
          small={true}
          style={{ fontSize: "0.7rem" }}
        ></Button>
      )}
    </PDFDownloadLink>
  );
  const CoverFormView = () => (
    <>
      <BlobProvider document={<OtherCover master={Master} />}>
        {({ blob, url, loading, error }) => (
          <>
            <a href={url} target="__blank">
              <Button
                loading={loading}
                text="OPEN COVER"
                icon="document-open"
                intent="primary"
                className="mx-1"
                small={true}
                style={{ fontSize: "0.7rem" }}
              ></Button>
            </a>
          </>
        )}
      </BlobProvider>
    </>
  );
  const ApFormView = () =>
    ap.map((ga, i) => (
      <BlobProvider
        key={i + ga.ID}
        document={
          <CheckRequestForm
            type="CARD"
            vendor={ga.PayTo_SName}
            payTo={ga.PayToCustomer}
            amt={numberWithCommas(Number.parseFloat(ga.InvoiceAmt).toFixed(2))}
            oim={Master.RefNo}
            customer={Master.Customer_SName}
            inv={ga.InvoiceNo}
            metd={
              moment(Master.ETD).isValid()
                ? moment(Master.ETD).utc().format("MM/DD/YY")
                : ""
            }
            meta={
              moment(Master.ETA).isValid()
                ? moment(Master.ETA).utc().format("MM/DD/YY")
                : ""
            }
            pic={ga.U1ID}
            today={moment().format("l")}
            desc={ga.Descript}
            pod={Master.DisCharge}
            comm={Master.Commodity}
          />
        }
      >
        {({ blob, url, loading, error }) => (
          <a href={url} target="__blank" style={{ textDecoration: "none" }}>
            <Button
              icon="dollar"
              intent="success"
              className="mx-1 my-1"
              loading={loading}
              small={true}
              style={{ fontSize: "0.7rem" }}
              text={ga.PayTo_SName}
            ></Button>
          </a>
        )}
      </BlobProvider>
    ));

  return (
    <div className="row">
      <p className="d-none d-print-block">
        Printed at {new Date().toLocaleDateString()}
      </p>
      <div className="col-md-10">
        <div className="row mt-3">
          {/* OTHER MASTER TABLE */}
          <div className="col-md-6">
            <div className="card border-left-primary shadow">
              <div className="card-header py-2 px-1">
                <div className="text-s font-weight-bold text-primary text-uppercase">
                  <span className="fa-stack d-print-none mr-1">
                    <i className="fa fa-circle fa-stack-2x text-primary"></i>
                    <i className="fa fa-ship fa-stack-1x fa-inverse"></i>
                  </span>
                  master
                </div>
              </div>
              <div className="card-body py-0">
                <Table className="table-borderless mt-2 table-sm text-xs">
                  <tbody>
                    <tr>
                      <th className="text-primary">MBL</th>
                      <th className="text-secondary">
                        {Master.Mblno || "NO MBL"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-primary">CUSTOMER</th>
                      <th className="text-gray-800 btn-link">
                        <a href={`/company/${Master.Customer}`} target="_blank">
                          {Master.Customer_SName || "NO CUSTOMER"}
                        </a>
                      </th>
                    </tr>
                    <tr>
                      <th className="text-primary text-uppercase">commodity</th>
                      <th className="text-secondary">
                        {Master.Commodity || "NO COMMODITY"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-primary text-uppercase">Package</th>
                      <th className="text-secondary">
                        {Master.Pkgs || "NO PACKAGE"} {Master.Punit}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-primary text-uppercase">Kgs</th>
                      <th className="text-secondary">
                        {Master.Kgs || "NO KGS"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-primary text-uppercase">Lbs</th>
                      <th className="text-secondary">
                        {Master.Lbs || "NO LBS"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-primary text-uppercase">i memo</th>
                      <th className="text-secondary">
                        {Master.IMemo || "NO MEMO"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-primary text-uppercase">p memo</th>
                      <th className="text-secondary">
                        {Master.PMemo || "NO MEMO"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-primary text-uppercase">type</th>
                      <th className="text-secondary">
                        {Master.Type || "NO TYPE"}
                      </th>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
          {/* OTHER FORMS */}
          <div className="col-md-6">
            <div className="card h-100 border-left-primary shadow d-print-none">
              <div className="card-header py-2 px-1">
                <div className="text-s font-weight-bold text-primary text-uppercase">
                  <span className="fa-stack mr-1">
                    <i className="fa fa-circle fa-stack-2x text-primary"></i>
                    <i className="fa fa-print fa-stack-1x fa-inverse"></i>
                  </span>
                  forms
                </div>
                {/* FOLDER TEMPLATE PRINT */}
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                {isClient && (
                  <div>
                    <CoverFormDownload />
                    <CoverFormView />
                    <hr />
                    <ApFormView />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-2 mt-3">
        <div className="card h-100 border-left-primary shadow">
          <div className="card-header py-2 px-1">
            <div className="text-s font-weight-bold text-primary text-uppercase">
              <span className="fa-stack d-print-none mr-1">
                <i className="fa fa-circle fa-stack-2x text-primary"></i>
                <i className="fa fa-truck fa-stack-1x fa-inverse"></i>
              </span>
              ROUTE
            </div>
          </div>
          <div className="card-body d-flex flex-column justify-content-center">
            <div className="media d-flex align-items-center">
              <span className="fa-stack">
                <i className="fa fa-circle fa-stack-2x text-primary"></i>
                <i className="fa fa-home fa-stack-1x fa-inverse"></i>
              </span>
              <div className="media-body text-xs text-center">
                <div className="font-weight-bold text-primary">LOADING</div>
                <div className="text-secondary">
                  {Master.LoadingPort || "NO LOADING PORT"}
                </div>
                <div>{Master.ETD || "NO ETD"}</div>
              </div>
            </div>

            <div className="media d-flex align-items-center mt-3">
              <span className="fa-stack">
                <i className="fa fa-circle fa-stack-2x text-primary"></i>
                <i className="fa fa-anchor fa-stack-1x fa-inverse"></i>
              </span>
              <div className="media-body text-xs text-center">
                <div className="font-weight-bold text-primary">DISCHARGE</div>
                <div className="text-secondary">
                  {Master.DisCharge || "NO DISCHARGE PORT"}
                </div>
                <div>{Master.ETA || "NO ETA"}</div>
              </div>
            </div>

            <div className="media d-flex align-items-center mt-3">
              <span className="fa-stack">
                <i className="fa fa-circle fa-stack-2x text-primary"></i>
                <i className="fa fa-anchor fa-stack-1x fa-inverse"></i>
              </span>
              <div className="media-body text-xs text-center">
                <div className="font-weight-bold text-primary">DESTINATION</div>
                <div className="text-secondary">
                  {Master.FinalDest || "NO FINAL LOCATION"}
                </div>
                <div>{Master.FETA || "NO FINAL ETA"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Other;
