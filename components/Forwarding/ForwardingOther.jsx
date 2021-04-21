import { Button, Menu, MenuItem } from "@blueprintjs/core";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { useEffect } from "react";
import { Table } from "reactstrap";
import OtherCover from "./OtherCover";
import moment from "moment";
export const Other = ({ Master }) => {
  const [isClient, setIsClient] = React.useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
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
          className="mr-1"
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
                style={{ fontSize: "0.7rem" }}
              ></Button>
            </a>
          </>
        )}
      </BlobProvider>
    </>
  );

  return (
    <div className="row">
      <p className="d-none d-print-block">
        Printed at {new Date().toLocaleDateString()}
      </p>
      <div className="col-md-10">
        <div className="row mt-3">
          {/* OTHER MASTER TABLE */}
          <div className="col-md-6">
            <div className="card border-left-success shadow">
              <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
                <div className="text-s font-weight-bold text-success text-uppercase">
                  <span className="fa-stack d-print-none">
                    <i className="fa fa-circle fa-stack-2x text-success"></i>
                    <i className="fa fa-ship fa-stack-1x fa-inverse"></i>
                  </span>
                  master
                </div>
              </div>
              <div className="card-body">
                <Table className="table-borderless mt-2 table-sm text-xs">
                  <tbody>
                    <tr>
                      <th className="text-success">MBL</th>
                      <th className="text-secondary">
                        {Master.Mblno || "NO MBL"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success">CUSTOMER</th>
                      <th className="text-gray-800 btn-link">
                        <a href={`/company/${Master.Customer}`} target="_blank">
                          {Master.Customer_SName || "NO CUSTOMER"}
                        </a>
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success text-uppercase">commodity</th>
                      <th className="text-secondary">
                        {Master.Commodity || "NO COMMODITY"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success text-uppercase">Package</th>
                      <th className="text-secondary">
                        {Master.Pkgs || "NO PACKAGE"} {Master.Punit}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success text-uppercase">Kgs</th>
                      <th className="text-secondary">
                        {Master.Kgs || "NO KGS"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success text-uppercase">Lbs</th>
                      <th className="text-secondary">
                        {Master.Lbs || "NO LBS"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success text-uppercase">i memo</th>
                      <th className="text-secondary">
                        {Master.IMemo || "NO MEMO"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success text-uppercase">p memo</th>
                      <th className="text-secondary">
                        {Master.PMemo || "NO MEMO"}
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success text-uppercase">type</th>
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
            <div className="card border-left-info shadow d-print-none">
              <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
                <div className="text-s font-weight-bold text-info text-uppercase">
                  <span className="fa-stack">
                    <i className="fa fa-circle fa-stack-2x text-info"></i>
                    <i className="fa fa-print fa-stack-1x fa-inverse"></i>
                  </span>
                  forms
                </div>
                {/* FOLDER TEMPLATE PRINT */}
              </div>
              <div className="card-body py-3">
                {isClient && (
                  <div>
                    <CoverFormDownload />
                    <CoverFormView />
                    <hr />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-2">ROUTE</div>
    </div>
  );
};

export default Other;
