import { Col, Table } from "reactstrap";
export const Info = ({ Master, House, Containers, Profit }) => {
  const [selectedHouse, setSelectedHouse] = React.useState(0);

  function numberWithCommas(x) {
    var num = parseInt(x);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var MASTER2 = [
    { title: "CONTAINER LOAD", data: Master.LCLFCL == "F" ? "FCL" : "LCL" },
    { title: "TYPE", data: Master.MoveType },
    {
      title: "VESSEL",
      data: (
        <a
          target="_blank"
          href={`http://www.google.com/search?q=marinetraffic+${Master.Vessel} ${Master.Voyage}`}
        >{`${Master.Vessel} ${Master.Voyage}`}</a>
      ),
    },
    { title: "LOADING", data: Master.LoadingPort },
    { title: "DISCHARGE", data: Master.DisCharge },
    { title: "FINAL DEST", data: Master.FinalDest },
  ];
  return (
    <Col lg={6}>
      {/* MASTER */}
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
          {/* MASTER TABLE 1 */}
          <Table className="table-borderless mt-2 table-sm text-xs">
            <tbody>
              <tr>
                <th className="text-success">MBL</th>
                <th className="text-secondary">{Master.MBLNo}</th>
              </tr>
              <tr>
                <th className="text-success">AGENT</th>
                <th className="text-secondary btn-link">
                  <a href={`/customer/${Master.Agent}`} target="_blank">
                    {Master.Agent_SName}
                  </a>
                </th>
              </tr>
              <tr>
                <th className="text-success">CARRIER</th>
                <th className="text-secondary btn-link">
                  <a href={`/customer/${Master.Carrier}`} target="_blank">
                    {Master.Carrier_SName}
                  </a>
                </th>
              </tr>
            </tbody>
          </Table>
          <hr />
          {/* MASTER TABLE 2 */}
          <Table className="table-borderless mt-2 table-sm text-xs">
            <tbody>
              <tr>
                <th className="text-success text-uppercase">container load</th>
                <th className="text-secondary">{Master.LCLFCL}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">type</th>
                <th className="text-secondary">{Master.MoveType}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">vessel</th>
                <th className="text-secondary">
                  {Master.Vessel} {Master.Voyage}
                </th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">LOADING</th>
                <th className="text-secondary">{Master.LoadingPort}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">DISCHARGE</th>
                <th className="text-secondary">{Master.DisCharge}</th>
              </tr>
              {Master.FinalDest && (
                <tr>
                  <th className="text-success text-uppercase">FINAL DEST</th>
                  <th className="text-secondary">{Master.FinalDest}</th>
                </tr>
              )}
              {Containers && (
                <tr>
                  <th className="text-success text-uppercase">
                    # of Container
                  </th>
                  <th className="text-secondary">{Containers.length}</th>
                </tr>
              )}
              {/* {Profit.length != 0 && (
                <tr>
                  <th className="text-danger text-uppercase">
                    {Profit.length} Error
                  </th>
                  <th className="text-danger text-uppercase">
                    AP/AR must be typed at house level
                  </th>
                </tr>
              )} */}
            </tbody>
          </Table>
        </div>
      </div>

      {/* HOUSE TABLE */}
      <div className="accordion my-4" id="accordionExample">
        {House.length != 0 ? (
          House.map((ga, i) => (
            <div className="card border-left-primary shadow" key={ga.ID}>
              <div className="card-header py-1 d-flex flex-row align-items-center justify-content-between">
                <div
                  className="text-s font-weight-bold text-primary text-uppercase btn-links py-1 pl-0"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    selectedHouse === i + 1
                      ? setSelectedHouse(0)
                      : setSelectedHouse(i + 1)
                  }
                >
                  <span className="fa-stack d-print-none">
                    <i className="fa fa-circle fa-stack-2x text-primary"></i>
                    <i className="fa fa-home fa-stack-1x fa-inverse"></i>
                  </span>
                  House {i + 1}
                </div>
              </div>
              <div className={`collapse ${selectedHouse === i + 1 && "show"}`}>
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
                          <a href={`/customer/${ga.Customer}`} target="_blank">
                            {ga.Customer_SName}
                          </a>
                        </th>
                      </tr>
                      <tr>
                        <th className="text-primary">SHIPPER</th>
                        <th className="text-gray-800 btn-link">
                          <a href={`/customer/${ga.Shipper}`} target="_blank">
                            {ga.Shipper_SName}
                          </a>
                        </th>
                      </tr>
                      <tr>
                        <th className="text-primary">CONSIGNEE</th>
                        <th className="text-gray-800 btn-link">
                          <a href={`/customer/${ga.Consignee}`} target="_blank">
                            {ga.Consignee_SName}
                          </a>
                        </th>
                      </tr>
                      <tr>
                        <th className="text-primary">NOTIFY</th>
                        <th className="text-gray-800 btn-link">
                          <a href={`/customer/${ga.Notify}`} target="_blank">
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
                      {Containers &&
                        Containers.map((ele, i) => {
                          if (ele.OIHBLID == ga.ID || ele.OOHBLID == ga.ID)
                            return (
                              <React.Fragment key={i + ele.ID}>
                                <tr>
                                  <th className="text-primary">CONTAINER</th>
                                  <th className="text-gray-800">
                                    {ele.ContainerNo} {ele.ConType}
                                  </th>
                                </tr>
                                {/* <tr>
                              <th className="text-primary">KGS</th>
                              <th className="text-secondary">
                                {numberWithCommas(ele.KGS)}
                              </th>
                            </tr>
                            <tr>
                              <th className="text-primary">PKG</th>
                              <th className="text-secondary">
                                {numberWithCommas(ga.PKGS) ||
                                  numberWithCommas(ga.Pkgs)}
                              </th>
                            </tr> */}
                              </React.Fragment>
                            );
                        })}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card border-left-danger shadow">
            <div className="card-header py-1 d-flex flex-row align-items-center justify-content-between">
              <div className="text-s font-weight-bold text-danger text-uppercase btn btn-links py-1 pl-0">
                No House
              </div>
            </div>
          </div>
        )}
      </div>
    </Col>
  );
};

export default Info;
