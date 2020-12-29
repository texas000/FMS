import { Col, Row } from "reactstrap";
import moment from 'moment';

const ROUTE = ({ DATA }) => {
  const ETD = moment(DATA && DATA.ETD).add(1, "days")
  const ETA = moment(DATA && DATA.ETA).add(1, "days")
  const FETA = moment(DATA && DATA.HFETA).add(1, "days")

  const ETDPrevious = ETD.isSameOrBefore(moment())
  const ETAPrevious = ETA.isSameOrBefore(moment())
  const FETAPrevious = FETA.isSameOrBefore(moment())

  return (
    <>
      <h5>ROUTE DETAIL</h5>
      <hr />
      <div>
        <div className="vr">&nbsp;</div>

        {/* LOADING */}

        <Row className="align-items-center mb-1">
          <Col lg={2}> 
            <svg
              style={{ position: "absolute", top: '1.2rem', left: "1.35rem" }}
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
            <span className="fa-stack fa-lg">
              <i
                className={`fa fa-circle fa-stack-2x ${
                  ETDPrevious ? "text-secondary" : "text-primary"
                }`}
              ></i>
              <i className="fa fa-home fa-stack-1x fa-inverse"></i>
            </span>
          </Col>
          <Col lg={10}>
            <h5>{DATA && DATA.LOADING}</h5>
          </Col>
        </Row>

        <Row className="align-items-center py-0">
          <Col>
            <p className="text-center">
              <span className="text-secondary">
                {DATA &&moment(DATA.ETD).add(1, "days").format("LL")}{" "}
              </span>
              <span className="text-danger">
                ({DATA && moment(DATA.ETD).add(1, "days").endOf("day").fromNow()})
              </span>
            </p>
          </Col>
        </Row>

        <Row className="align-items-center mt-1">
          <Col lg={2}>
          <svg
              style={{ position: "absolute", top: '1.2rem', left: "1.35rem" }}
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
            <span className="fa-stack fa-lg">
              <i
                className={`fa fa-circle fa-stack-2x ${
                  ETAPrevious ? "text-secondary" : "text-warning"
                }`}
              ></i>
              <i className="fa fa-ship fa-stack-1x fa-inverse"></i>
            </span>
          </Col>
          <Col lg={10}>
            <h5>{DATA && DATA.DISCHARGE}</h5>
          </Col>
        </Row>

        <Row className="align-items-center py-0">
          <Col>
            <p className="text-center">
              <span className="text-secondary">
                {moment(DATA.ETA).add(1, "days").format("LL")}{" "}
              </span>
              <span className="text-danger">
                ({moment(DATA.ETA).add(1, "days").endOf("day").fromNow()})
              </span>
            </p>
          </Col>
        </Row>

        <Row className="align-items-center mt-2">
          <Col lg={2}>
            <span className="fa-stack fa-lg">
              <i
                className={`fa fa-circle fa-stack-2x ${
                  FETAPrevious ? "text-secondary" : "text-warning"
                }`}
              ></i>
              <i className="fa fa-flag fa-stack-1x fa-inverse"></i>
            </span>
          </Col>
          <Col lg={10}>
            <h5>{DATA && DATA.DEST}</h5>
          </Col>
        </Row>

        <Row className="align-items-center py-0">
          <Col>
            <p className="text-center">
              <span className="text-secondary">
                {moment(DATA.HFETA).add(1, "days").format("LL")}{" "}
              </span>
              <span className="text-danger">
                ({moment(DATA.HFETA).add(1, "days").endOf("day").fromNow()})
              </span>
            </p>
          </Col>
        </Row>
      </div>
      <style jsx>
        {`
           {
            /* .vr {
            width: 2px;
            background-color: gray;
            height: 226px;
            position: absolute;
            top: 62px;
            bottom: 0;
            left: 37px;
            opacity: 0.5;
          } */
          }
        `}
      </style>
    </>
  );};

export default ROUTE;