import { Col, Table } from "reactstrap";

export const Info = ({ Master, House, Containers }) => {
  const [selectedHouse, setSelectedHouse] = React.useState(0);

  function numberWithCommas(x) {
    var num = parseInt(x);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

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
          <Table className="table-borderless mt-2 table-sm text-xs">
            <tbody>
              <tr>
                <th className="text-success">MBL</th>
                <th className="text-secondary">{Master.F_MawbNo}</th>
              </tr>
              <tr>
                <th className="text-success">AGENT</th>
                <th className="text-secondary">{Master.AGENT}</th>
              </tr>
            </tbody>
          </Table>

          <hr />
          <Table className="table-borderless mt-2 table-sm text-xs">
            <tbody>
              {Master.CYLOC && (
                <tr>
                  <th className="text-success text-uppercase">location</th>
                  <th className="text-secondary">{Master.CYLOC}</th>
                </tr>
              )}
              <tr>
                <th className="text-success text-uppercase">flight number</th>
                <th className="text-secondary">{Master.F_FLTno}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">LOADING</th>
                <th className="text-secondary">{Master.F_LoadingPort}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">DISCHARGE</th>
                <th className="text-secondary">{Master.F_Discharge}</th>
              </tr>
              {Master.F_FinalDest && (
                <tr>
                  <th className="text-success text-uppercase">FINAL DEST</th>
                  <th className="text-secondary">{Master.F_FinalDest}</th>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* HOUSE */}
      <div className="accordion mt-4" id="accordionExample">
        {House.length != 0 ? (
          House.map((ga, i) => (
            <div className="card border-left-primary shadow" key={ga.F_ID}>
              <div className="card-header py-1 d-flex flex-row align-items-center justify-content-between">
                <div
                  className="text-s font-weight-bold text-primary text-uppercase btn btn-links py-1 pl-0"
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
                        <th className="text-gray-800">
                          {ga.F_HawbNo || ga.F_HAWBNo}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-primary">CUSTOMER</th>
                        <th className="text-gray-800">{ga.CUSTOMER}</th>
                      </tr>
                      <tr>
                        <th className="text-primary">SHIPPER</th>
                        <th className="text-gray-800">{ga.SHIPPER}</th>
                      </tr>
                      <tr>
                        <th className="text-primary">CONSIGNEE</th>
                        <th className="text-gray-800">{ga.CONSIGNEE}</th>
                      </tr>
                      <tr>
                        <th className="text-primary">NOTIFY</th>
                        <th className="text-gray-800">{ga.NOTIFY}</th>
                      </tr>
                      <tr>
                        <th className="text-primary">COMMODITY</th>
                        <th className="text-gray-800">{ga.F_Commodity}</th>
                      </tr>
                      <tr>
                        <th className="text-primary">PKG</th>
                        <th className="text-gray-800">{ga.F_Pkgs}</th>
                      </tr>
                      <tr>
                        <th className="text-primary">GROSS WEIGHT</th>
                        <th className="text-gray-800">
                          {numberWithCommas(ga.F_LGrossWeight)}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-primary">CHARGE WEIGHT</th>
                        <th className="text-gray-800">
                          {numberWithCommas(ga.F_ChgWeight)}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-primary">REFERENCE</th>
                        <th className="text-gray-800">
                          {ga.F_CustRefNo || "NO REFERENCE"}
                        </th>
                      </tr>
                      {Containers &&
                        Containers.map((ele, i) => {
                          if (ele.F_OIHBLID == ga.F_ID)
                            return (
                              <React.Fragment key={i + ele.F_ID}>
                                <tr>
                                  <th className="text-primary">CONTAINER</th>
                                  <th className="text-gray-800">
                                    {ele.F_ContainerNo} {ele.F_ConType}
                                  </th>
                                </tr>
                                {/* <tr>
                              <th className="text-primary">KGS</th>
                              <th className="text-secondary">
                                {numberWithCommas(ele.F_KGS)}
                              </th>
                            </tr>
                            <tr>
                              <th className="text-primary">PKG</th>
                              <th className="text-secondary">
                                {numberWithCommas(ga.F_PKGS) ||
                                  numberWithCommas(ga.F_Pkgs)}
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
