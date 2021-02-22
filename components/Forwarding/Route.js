import { Col, Row } from "reactstrap";
import moment from "moment";

const Route = ({ ETD, ETA, FETA, LOADING, DISCHARGE, DEST }) => {
  const METD = moment(ETD).add(1, "days");
  const META = moment(ETA).add(1, "days");
  const MFETA = moment(FETA).add(1, "days");

  const ETDPrevious = METD.isSameOrBefore(moment());
  const ETAPrevious = META.isSameOrBefore(moment());
  const FETAPrevious = MFETA.isSameOrBefore(moment());

  return (
    <>
      <div className="card h-100 border-left-warning shadow">
        <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
          <div className="text-s font-weight-bold text-warning text-uppercase">
            <span className="fa-stack d-print-none">
              <i className="fa fa-circle fa-stack-2x text-warning"></i>
              <i className="fa fa-truck fa-stack-1x fa-inverse"></i>
            </span>
            ROUTE
          </div>
        </div>
        <div className="card-body">
          <Row className="align-items-top">
            <Col sm="2" className="d-print-none">
              {/* POINTER FROM TOP TO BOTTOM */}
              <svg
                height="4rem"
                width="2.6rem"
                aria-hidden="true"
                focusable="false"
                dataprefix="fas"
                dataicon="long-arrow-alt-down"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 512"
                className="fa-long-arrow-alt-down text-center position-absolute mt-3"
              >
                <path
                  fill="#d3d3d3"
                  d="M168 345.941V44c0-6.627-5.373-12-12-12h-56c-6.627 0-12 5.373-12 12v301.941H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.569 9.373 33.941 0l86.059-86.059c15.119-15.119 4.411-40.971-16.971-40.971H168z"
                ></path>
              </svg>
              {/* HOUSE IN CIRCLE */}
              <span className="fa-stack fa-lg">
                <i
                  className={`fa fa-circle fa-stack-2x ${
                    ETDPrevious ? "text-secondary" : "text-info"
                  }`}
                ></i>
                <i className="fa fa-home fa-stack-1x fa-inverse"></i>
              </span>
            </Col>
            <Col className="mt-1">
              <div className="text-break text-center text-xs">{LOADING}</div>

              {ETD && (
                <>
                  <div className="text-secondary text-center text-xs">
                    {moment(ETD).utc().format("LL")}
                  </div>
                  <div className="text-danger text-center text-s">
                    ({moment(ETD).utc().endOf("day").fromNow()})
                  </div>
                </>
              )}
            </Col>
          </Row>
          {ETA && (
            <>
              <Row className="align-items-top my-4">
                <Col sm="2" className="d-print-none">
                  <svg
                    height="4rem"
                    width="2.6rem"
                    aria-hidden="true"
                    focusable="false"
                    dataprefix="fas"
                    dataicon="long-arrow-alt-down"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 512"
                    className="fa-long-arrow-alt-down text-center position-absolute mt-3"
                  >
                    <path
                      fill="#d3d3d3"
                      d="M168 345.941V44c0-6.627-5.373-12-12-12h-56c-6.627 0-12 5.373-12 12v301.941H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.569 9.373 33.941 0l86.059-86.059c15.119-15.119 4.411-40.971-16.971-40.971H168z"
                    ></path>
                  </svg>
                  <span className="fa-stack fa-lg">
                    <i
                      className={`fa fa-circle fa-stack-2x ${
                        ETAPrevious ? "text-secondary" : "text-warning"
                      }`}
                    ></i>
                    <i className="fa fa-ship fa-stack-1x fa-inverse"></i>
                  </span>
                </Col>
                <Col>
                  <div className="text-break text-center text-xs">
                    {DISCHARGE}
                  </div>

                  {ETA && (
                    <>
                      <div className="text-secondary text-center text-xs">
                        {moment(ETA).utc().format("LL")}
                      </div>
                      <div className="text-danger text-center text-s">
                        ({moment(ETA).utc().endOf("day").fromNow()})
                      </div>
                    </>
                  )}
                </Col>
              </Row>
            </>
          )}
          {DEST && (
            <Row className="align-items-top mt-4">
              <Col sm="2" className="d-print-none">
                <span className="fa-stack fa-lg">
                  <i
                    className={`fa fa-circle fa-stack-2x ${
                      FETAPrevious ? "text-secondary" : "text-warning"
                    }`}
                  ></i>
                  <i className="fa fa-flag fa-stack-1x fa-inverse"></i>
                </span>
              </Col>
              <Col>
                <div className="text-center text-xs">{DEST}</div>

                {FETA && (
                  <>
                    <div className="text-secondary text-center text-xs">
                      {moment(FETA).utc().format("LL")}
                    </div>
                    <div className="text-danger text-center text-s">
                      ({moment(FETA).utc().endOf("day").fromNow()})
                    </div>
                  </>
                )}
              </Col>
            </Row>
          )}
        </div>
      </div>
    </>
  );
};

export default Route;
