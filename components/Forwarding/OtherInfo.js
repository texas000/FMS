import { Col, Table } from "reactstrap";

export const Info = ({ Master }) => {
  function numberWithCommas(x) {
    var num = parseInt(x);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <Col lg={6}>
      {/* MASTER */}
      <div className="card border-left-success shadow mb-4">
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
                <th className="text-secondary">{Master.Mblno}</th>
              </tr>
              <tr>
                <th className="text-success">CUSTOMER</th>
                <th className="text-gray-800 btn-link">
                  <a href={`/company/${Master.Customer}`} target="_blank">
                    {Master.Customer_SName}
                  </a>
                </th>
              </tr>
            </tbody>
          </Table>

          <hr />
          <Table className="table-borderless mt-2 table-sm text-xs">
            <tbody>
              <tr>
                <th className="text-success text-uppercase">commodity</th>
                <th className="text-secondary">{Master.Commodity}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">Package</th>
                <th className="text-secondary">{Master.Pkgs}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">Unit</th>
                <th className="text-secondary">{Master.Punit}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">i memo</th>
                <th className="text-secondary">{Master.IMemo}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">p memo</th>
                <th className="text-secondary">{Master.PMemo}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">type</th>
                <th className="text-secondary">{Master.Type}</th>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      {/* HOUSE */}
    </Col>
  );
};

export default Info;
