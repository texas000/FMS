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
          <ul className="list-unstyled">
            <li className="media mb-2">
              {/* HOUSE IN CIRCLE */}
              <svg
                height="4rem"
                width="2.3rem"
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
                    ETDPrevious ? "text-secondary" : "text-info"
                  }`}
                ></i>
                <i className="fa fa-home fa-stack-1x fa-inverse"></i>
              </span>
              <div className="media-body">
                {/* LOADING PORT */}
                <h1 className="mt-0 mb-1 text-primary font-weight-bold text-center text-xs">
                  LOADING
                </h1>
                <h1 className="mt-0 mb-1 font-weight-bold text-center text-xs">
                  {LOADING || "NOT SPECIFIED"}
                </h1>

                {/* WHEN ETD TIME IS AVAILABLE, DISPLAY WITH TWO DIFFERENT FORMATS */}
                <div className="text-secondary text-center text-xs">
                  {ETD === null
                    ? "EXPECTED DEPARTURE"
                    : moment(ETD).utc().format("LL")}
                </div>
                <div className="text-danger text-capitalize text-center text-xs">
                  {ETD === null
                    ? "NOT SPECIFIED"
                    : moment(ETD).utc().endOf("day").fromNow()}
                </div>
              </div>
            </li>
            <li className="media my-4">
              {/* HOUSE IN CIRCLE */}
              <svg
                height="4rem"
                width="2.3rem"
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
                <i className="fa fa-home fa-stack-1x fa-inverse"></i>
              </span>
              <div className="media-body">
                {/* LOADING PORT */}
                <h1 className="mt-0 mb-1 text-primary font-weight-bold text-center text-xs">
                  DISCHARGE
                </h1>
                <h1 className="mt-0 mb-1 font-weight-bold text-center text-xs">
                  {DISCHARGE || "NOT SPECIFIED"}
                </h1>

                {/* WHEN ETD TIME IS AVAILABLE, DISPLAY WITH TWO DIFFERENT FORMATS */}

                <div className="text-secondary text-center text-xs">
                  {ETA === null
                    ? "EXPECTED ARRIVAL"
                    : moment(ETA).utc().endOf("day").format("LL")}
                </div>
                <div className="text-danger text-capitalize text-center text-xs">
                  {ETA === null
                    ? "NOT SPECIFIED"
                    : moment(ETA).utc().endOf("day").fromNow()}
                </div>
              </div>
            </li>
            <li className="media mt-4">
              {/* HOUSE IN CIRCLE */}
              <span className="fa-stack fa-lg">
                <i
                  className={`fa fa-circle fa-stack-2x ${
                    FETAPrevious ? "text-secondary" : "text-warning"
                  }`}
                ></i>
                <i className="fa fa-home fa-stack-1x fa-inverse"></i>
              </span>
              <div className="media-body">
                {/* LOADING PORT */}
                <h1 className="mt-0 mb-1 text-primary font-weight-bold text-center text-xs">
                  DESTINATION
                </h1>
                <h1 className="mt-0 mb-1 font-weight-bold text-center text-xs">
                  {DEST || "NOT SPECIFIED"}
                </h1>

                {/* WHEN ETD TIME IS AVAILABLE, DISPLAY WITH TWO DIFFERENT FORMATS */}
                {FETA && (
                  <>
                    <div className="text-secondary text-center text-xs">
                      {moment(FETA).utc().endOf("day").format("LL")}
                    </div>
                    <div className="text-danger text-capitalize text-center text-xs">
                      {moment(FETA).utc().endOf("day").fromNow()}
                    </div>
                  </>
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Route;
