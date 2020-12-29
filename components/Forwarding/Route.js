import { Col, Row } from "reactstrap";
import moment from 'moment';

const Route = ({ ETD, ETA, FETA, LOADING, DISCHARGE, DEST }) => {
  const METD = moment(ETD).add(1, "days")
  const META = moment(ETA).add(1, "days")
  const MFETA = moment(FETA).add(1, "days")
  
  const ETDPrevious = METD.isSameOrBefore(moment())
  const ETAPrevious = META.isSameOrBefore(moment())
  const FETAPrevious = MFETA.isSameOrBefore(moment())

  return (
    <>
      <span>ROUTE DETAIL</span>
      <hr />
      <div>
        <div className="vr">&nbsp;</div>

        {/* LOADING */}

        <Row>
          <Col sm="2">
            <svg
              style={{ position: "absolute", top: "0.8rem", left: "1.75rem" }}
              height="5rem"
              width="2rem"
              aria-hidden="true"
              focusable="false"
              dataprefix="fas"
              dataicon="long-arrow-alt-down"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 512"
              className="svg-inline--fa fa-long-arrow-alt-down fa-w-8 fa-3x"
            >
              <path
                fill={ETDPrevious ? "#adb5bd" : "#4582ec"}
                d="M168 345.941V44c0-6.627-5.373-12-12-12h-56c-6.627 0-12 5.373-12 12v301.941H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.569 9.373 33.941 0l86.059-86.059c15.119-15.119 4.411-40.971-16.971-40.971H168z"
              ></path>
            </svg>
            <span
              className="fa-stack fa-lg"
              style={{ position: "absolute", top: "0rem", left: "1.35rem" }}
            >
              <i
                className={`fa fa-circle fa-stack-2x ${
                  ETDPrevious ? "text-secondary" : "text-primary"
                }`}
              ></i>
              <i className="fa fa-home fa-stack-1x fa-inverse"></i>
            </span>
          </Col>
          <Col className="mt-1" sm="10">
            <p className="text-center" style={{fontSize: '0.8rem'}}>
              <span>{LOADING}</span>
            </p>
            {ETD && 
            <>
            <p className="text-center" style={{fontSize: '0.8rem'}}>
              <span className="text-secondary">
                {moment(ETD).add(1, "days").format("LL")}{" "}
              </span>
            </p>
            <p className="text-center">
              <span className="text-danger">
                ({moment(ETD).add(1, "days").endOf("day").fromNow()})
              </span>
            </p>
            </>
            }
          </Col>
        </Row>
        {ETA && 
            <>
        <Row className="align-items-top mt-4">
          <Col sm="2">
            <svg
              style={{ position: "absolute", top: "0.8rem", left: "1.75rem" }}
              height="5rem"
              width="2rem"
              aria-hidden="true"
              focusable="false"
              dataprefix="fas"
              dataicon="long-arrow-alt-down"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 512"
              className="svg-inline--fa fa-long-arrow-alt-down fa-w-8 fa-3x"
            >
              <path
                fill={ETAPrevious ? "#adb5bd" : "#f0ad4e"}
                d="M168 345.941V44c0-6.627-5.373-12-12-12h-56c-6.627 0-12 5.373-12 12v301.941H41.941c-21.382 0-32.09 25.851-16.971 40.971l86.059 86.059c9.373 9.373 24.569 9.373 33.941 0l86.059-86.059c15.119-15.119 4.411-40.971-16.971-40.971H168z"
              ></path>
            </svg>
            <span
              className="fa-stack fa-lg"
              style={{ position: "absolute", top: "0rem", left: "1.35rem" }}
            >
              <i
                className={`fa fa-circle fa-stack-2x ${
                  ETAPrevious ? "text-secondary" : "text-warning"
                }`}
              ></i>
              <i className="fa fa-ship fa-stack-1x fa-inverse"></i>
            </span>
          </Col>
          <Col>
            <p className="text-center" style={{fontSize: '0.8rem'}}>
              <span>{DISCHARGE}</span>
            </p>
            
            <p className="text-center" style={{fontSize: '0.8rem'}}>
              <span className="text-secondary">
                {moment(ETA).add(1, "days").format("LL")}{" "}
              </span>
            </p>
            <p className="text-center">
              <span className="text-danger">
                ({moment(ETA).add(1, "days").endOf("day").fromNow()})
              </span>
            </p>
          </Col>
        </Row>
            </>
            }
            {DEST && (
              <Row className="align-items-top mt-4">
                <Col sm="2">
                <span
              className="fa-stack fa-lg"
              style={{ position: "absolute", top: "0rem", left: "1.35rem" }}
            >
              <i
                className={`fa fa-circle fa-stack-2x ${
                  FETAPrevious ? "text-secondary" : "text-warning"
                }`}
              ></i>
              <i className="fa fa-home fa-stack-1x fa-inverse"></i>
            </span>
                </Col>
                <Col>
                <p className="text-center" style={{fontSize: '0.8rem'}}>
              <span>{DEST}</span>
            </p>
            
            {FETA&&<p className="text-center" style={{fontSize: '0.8rem'}}>
              <span className="text-secondary">
                {moment(FETA).add(1, "days").format("LL")}{" "}
              </span>
            </p>}
            {FETA&&<p className="text-center">
              <span className="text-danger">
                ({moment(FETA).add(1, "days").endOf("day").fromNow()})
              </span>
            </p>}
                </Col>
              </Row>
            )}
      </div>
      <style jsx>
        {`
         p {
          font-family: "Roboto", sans-serif;
          font-size: 0.9rem;
         }
        `}
      </style>
    </>
  );};

export default Route;