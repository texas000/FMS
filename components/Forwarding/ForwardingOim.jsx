import { Col, Table } from "reactstrap";
export const Master = ({ Master, House }) => {
  const [selectedHouse, setSelectedHouse] = React.useState(0);
  function numberWithCommas(x) {
    var num = parseInt(x);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div className="row">
      <p className="d-none d-print-block">
        Printed at {new Date().toLocaleDateString()}
      </p>
      <div className="col-md-10">
        <div className="row">
          <div className="col-md-6">
            {/* MASTER */}
            {/* CARD START */}
            <div className="card border-left-success shadow mt-3">
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
                      <th className="text-secondary">{Master.MBLNo}</th>
                    </tr>
                    <tr>
                      <th className="text-success">AGENT</th>
                      <th className="text-secondary btn-link">
                        <a href={`/company/${Master.Agent}`} target="_blank">
                          {Master.Agent_SName}
                        </a>
                      </th>
                    </tr>
                    <tr>
                      <th className="text-success">CARRIER</th>
                      <th className="text-secondary btn-link">
                        <a href={`/company/${Master.Carrier}`} target="_blank">
                          {Master.Carrier_SName}
                        </a>
                      </th>
                    </tr>
                  </tbody>
                </Table>
                {/* MASTER TABLE 2 */}
              </div>
            </div>
            {/* CARD END */}

            <div className="accordion my-4" id="accordionExample">
              {House ? (
                House.map((ga, i) => (
                  <div className="card border-left-primary shadow" key={ga.ID}>
                    <div
                      className="card-header py-1 d-flex flex-row align-items-center justify-content-between"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        selectedHouse === i + 1
                          ? setSelectedHouse(0)
                          : setSelectedHouse(i + 1)
                      }
                    >
                      <div className="text-s font-weight-bold text-primary text-uppercase btn-links py-1 pl-0">
                        <span className="fa-stack d-print-none">
                          <i className="fa fa-circle fa-stack-2x text-primary"></i>
                          <i className="fa fa-home fa-stack-1x fa-inverse"></i>
                        </span>
                        House {i + 1}
                      </div>
                      <div className="dropdown">
                        {selectedHouse === i + 1 ? (
                          <i className="fa fa-chevron-down text-primary" />
                        ) : (
                          <i className="fa fa-chevron-left text-secondary" />
                        )}
                      </div>
                    </div>
                    <div
                      className={`collapse ${
                        selectedHouse === i + 1 && "show"
                      }`}
                    >
                      <div className="card-body">
                        <Table className="table-borderless mt-2 table-sm text-xs">
                          <tbody>
                            <tr>
                              <th className="text-primary">HBL</th>
                              <th className="text-gray-800">{ga.HBLNo}</th>
                            </tr>
                            <tr>
                              <th className="text-primary">CUSTOMER</th>
                              <th className="text-gray-800 btn-link">
                                <a
                                  href={`/company/${ga.Customer}`}
                                  target="_blank"
                                >
                                  {ga.Customer_SName}
                                </a>
                              </th>
                            </tr>
                            <tr>
                              <th className="text-primary">SHIPPER</th>
                              <th className="text-gray-800 btn-link">
                                <a
                                  href={`/company/${ga.Shipper}`}
                                  target="_blank"
                                >
                                  {ga.Shipper_SName}
                                </a>
                              </th>
                            </tr>
                            <tr>
                              <th className="text-primary">CONSIGNEE</th>
                              <th className="text-gray-800 btn-link">
                                <a
                                  href={`/company/${ga.Consignee}`}
                                  target="_blank"
                                >
                                  {ga.Consignee_SName}
                                </a>
                              </th>
                            </tr>
                            <tr>
                              <th className="text-primary">NOTIFY</th>
                              <th className="text-gray-800 btn-link">
                                <a
                                  href={`/company/${ga.Notify}`}
                                  target="_blank"
                                >
                                  {ga.Notify_SName}
                                </a>
                              </th>
                            </tr>
                            <tr>
                              <th className="text-primary">COMMODITY</th>
                              <th className="text-gray-800">{ga.Commodity}</th>
                            </tr>
                            <tr>
                              <th className="text-primary">PKG</th>
                              <th className="text-gray-800">{ga.MarkPkg}</th>
                            </tr>
                            <tr>
                              <th className="text-primary">KGS</th>
                              <th className="text-gray-800">
                                {numberWithCommas(ga.KGS)}
                              </th>
                            </tr>
                            <tr>
                              <th className="text-primary">CBM</th>
                              <th className="text-gray-800">
                                {numberWithCommas(ga.CBM)}
                              </th>
                            </tr>
                            <tr>
                              <th className="text-primary">REFERENCE</th>
                              <th className="text-gray-800">
                                {ga.CustRefNo || "NO REFERENCE"}
                              </th>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card border-left-danger shadow">
                  <div className="card-header py-1 d-flex flex-row align-items-center justify-content-between">
                    <div className="text-s font-weight-bold text-danger text-uppercase py-1 pl-0">
                      <span className="fa-stack d-print-none">
                        <i className="fa fa-circle fa-stack-2x text-danger"></i>
                        <i className="fa fa-times fa-stack-1x fa-inverse"></i>
                      </span>
                      No House
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-2">ROUTE</div>
    </div>
  );
};

export default Master;
