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
                <th className="text-secondary">{Master.F_Mblno}</th>
              </tr>
              <tr>
                <th className="text-success">CUSTOMER</th>
                <th className="text-secondary">{Master.CUSTOMER}</th>
              </tr>
            </tbody>
          </Table>

          <hr />
          <Table className="table-borderless mt-2 table-sm text-xs">
            <tbody>
              <tr>
                <th className="text-success text-uppercase">commodity</th>
                <th className="text-secondary">{Master.F_Commodity}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">Package</th>
                <th className="text-secondary">
                  {Master.F_Pkgs} {Master.F_Punit}
                </th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">i memo</th>
                <th className="text-secondary">{Master.F_IMemo}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">p memo</th>
                <th className="text-secondary">{Master.F_PMemo}</th>
              </tr>
              <tr>
                <th className="text-success text-uppercase">type</th>
                <th className="text-secondary">{Master.F_Type}</th>
              </tr>
              {Master.F_RefNo && (
                <tr>
                  <th className="text-success text-uppercase">Ref</th>
                  <th className="text-secondary">{Master.F_RefNo}</th>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>

      {/* HOUSE */}
    </Col>
  );
};

export default Info;
