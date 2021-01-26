import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Col,
  Collapse,
  Input,
  Row,
  Table,
} from "reactstrap";
import moment from "moment";

// PDF DOWNLOAD
import { BlobProvider } from "@react-pdf/renderer";
//MANLLIA FOLDER COVER
import { CoverForm } from "./CoverForm";
//
import { MyCover } from "./MyCover";
//AP
import { CheckRequestForm } from "./CheckRequestForm";
//Acitivity
import { Activity } from "./Activity";

import { Status } from "./Status";
import { Comment } from "./Comment";

const Main = ({ OTHER, Master, House, Containers, AP, FILES, USER, EXTRA }) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(0);
  const [APType, setAPType] = useState("CHECK");
  useEffect(() => {
    setIsClient(true);
  });

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const MASTER1 = [
    { title: "MBL", data: Master.F_MBLNo },
    { title: "AGENT", data: Master.AGENT || "" },
    { title: "CARRIER", data: Master.CARRIER || "" },
  ];
  var MASTER2 = [
    { title: "CONTAINER LOAD", data: Master.F_LCLFCL == "F" ? "FCL" : "LCL" },
    { title: "TYPE", data: Master.F_MoveType },
    {
      title: "VESSEL",
      data: (
        <a
          target="_blank"
          href={`http://www.google.com/search?q=marinetraffic+${Master.F_Vessel} ${Master.F_Voyage}`}
        >{`${Master.F_Vessel} ${Master.F_Voyage}`}</a>
      ),
    },
    { title: "LOADING", data: Master.F_LoadingPort },
    { title: "DISCHARGE", data: Master.F_DisCharge },
    { title: "FINAL DEST", data: Master.F_FinalDest },
  ];
  //   Containers.map((ga, i) =>
  //     MASTER2.push({ title: `CONTAINER ${i + 1}`, data: ga.F_ContainerNo })
  //   );

  const [isHouseOpen, setIsHouseOpen] = useState(false);
  const houseToggle = () => setIsHouseOpen(!isHouseOpen);
  return (
    <Row>
      <Col lg={6}>
        {/* MASTER */}
        <div className="card border-left-success shadow">
          <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
            <div className="text-s font-weight-bold text-success text-uppercase">
              <span className="fa-stack">
                <i className="fa fa-circle fa-stack-2x text-success"></i>
                <i className="fa fa-ship fa-stack-1x fa-inverse"></i>
              </span>
              master
            </div>
          </div>
          <div className="card-body">
            <Table className="table-borderless mt-2 table-sm text-xs">
              <tbody>
                {MASTER1.map((ga) => (
                  <tr key={ga.title}>
                    <th className="text-success">{ga.title}</th>
                    <th className="text-secondary">{ga.data}</th>
                  </tr>
                ))}
              </tbody>
            </Table>

            <hr />
            <Table className="table-borderless mt-2 table-sm text-xs">
              <tbody>
                {MASTER2.map((ga) => (
                  <tr key={ga.title}>
                    <th className="text-success">{ga.title}</th>
                    <th className="text-secondary">{ga.data}</th>
                  </tr>
                ))}
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
                    <span className="fa-stack">
                      <i className="fa fa-circle fa-stack-2x text-primary"></i>
                      <i className="fa fa-home fa-stack-1x fa-inverse"></i>
                    </span>
                    House {i + 1}
                  </div>
                </div>
                <div
                  className={`collapse ${selectedHouse === i + 1 && "show"}`}
                >
                  <div className="card-body">
                    <Table className="table-borderless mt-2 table-sm text-xs">
                      <tbody>
                        <tr>
                          <th className="text-primary">HBL</th>
                          <th className="text-gray-800">{ga.F_HBLNo}</th>
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
                          <th className="text-gray-800">{ga.F_MarkPkg}</th>
                        </tr>
                        <tr>
                          <th className="text-primary">KGS</th>
                          <th className="text-gray-800">
                            {numberWithCommas(ga.F_KGS)}
                          </th>
                        </tr>
                        <tr>
                          <th className="text-primary">CBM</th>
                          <th className="text-gray-800">
                            {numberWithCommas(ga.F_CBM)}
                          </th>
                        </tr>
                        <tr>
                          <th className="text-primary">REFERENCE</th>
                          <th className="text-gray-800">
                            {ga.F_CustRefNo || "NO REFERENCE"}
                          </th>
                        </tr>
                        {Containers.map((ele, i) => {
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

      <Col lg={6}>
        {/* FORMS */}
        <div className="card border-left-info shadow">
          <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
            <div className="text-s font-weight-bold text-info text-uppercase">
              <span className="fa-stack">
                <i className="fa fa-circle fa-stack-2x text-info"></i>
                <i className="fa fa-print fa-stack-1x fa-inverse"></i>
              </span>
              forms
            </div>
            {/* FOLDER TEMPLATE PRINT */}
            {isClient && (
              <ButtonGroup>
                <BlobProvider
                  document={
                    <MyCover
                      master={Master}
                      house={House}
                      containers={Containers}
                    />
                  }
                >
                  {({ url }) => (
                    <a href={url} target="_blank">
                      <Button
                        size="sm"
                        className="text-xs"
                        outline
                        color="info"
                        disabled={!isClient}
                      >
                        <i className="fa fa-print mr-1"></i>COVER
                      </Button>
                    </a>
                  )}
                </BlobProvider>
              </ButtonGroup>
            )}
          </div>
          <div className="card-body py-3">
            <div className="text-xs text-secondary">Please select AP type</div>
            <ButtonGroup className="text-xs" aria-label="radio">
              <Button
                size="sm"
                className="text-xs"
                outline={APType !== "CHECK"}
                color="info"
                onClick={() => setAPType("CHECK")}
              >
                Check
              </Button>
              <Button
                size="sm"
                className="text-xs"
                outline={APType !== "CARD"}
                color="info"
                onClick={() => setAPType("CARD")}
              >
                Card
              </Button>
              <Button
                size="sm"
                className="text-xs"
                outline={APType !== "WIRE"}
                color="info"
                onClick={() => setAPType("WIRE")}
              >
                Wire
              </Button>
              <Button
                size="sm"
                className="text-xs"
                outline={APType !== "ACH"}
                color="info"
                onClick={() => setAPType("ACH")}
              >
                ACH
              </Button>
            </ButtonGroup>
            <br />
            {isClient && AP.length ? (
              AP.map((ga, i) => (
                <>
                  <BlobProvider
                    key={ga.F_Descript}
                    document={
                      <CheckRequestForm
                        type={APType}
                        vendor={ga.PAY}
                        amt={numberWithCommas(
                          Number.parseFloat(ga.F_InvoiceAmt).toFixed(2)
                        )}
                        oim={Master.F_RefNo}
                        customer={House[0].CUSTOMER || OTHER.CUSTOMER || ""}
                        inv={ga.F_InvoiceNo}
                        metd={moment(Master.F_ETD)
                          .add(1, "days")
                          .format("MM/DD/YY")}
                        meta={moment(Master.F_ETA)
                          .add(1, "days")
                          .format("MM/DD/YY")}
                        pic={ga.F_U1ID}
                        today={moment().format("l")}
                        desc={ga.F_Descript}
                      />
                    }
                  >
                    {({ url }) => (
                      <a
                        href={url}
                        target="_blank"
                        className="btn btn-info btn-sm text-xs text-wrap my-1"
                      >
                        <i className="fa fa-file"></i>
                        <span className="ml-2">{ga.F_Descript}</span>
                      </a>
                    )}
                  </BlobProvider>
                  <br />
                </>
              ))
            ) : (
              <div className="text-info text-xs mt-2">No AP Found</div>
            )}
          </div>
        </div>

        <Status Data={EXTRA.S} Ref={Master.F_RefNo} />
      </Col>
    </Row>
  );
};

export default Main;
