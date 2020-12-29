/*

MAIN - TYPE(3) - OCEAN / AIR / OTHER

*/
import { useEffect, useState, useCallback } from "react";
import { Alert, Badge, Button, ButtonGroup, Card, CardHeader, Col, Collapse, Input, Row, Table } from "reactstrap";
import moment from 'moment'

// PDF DOWNLOAD
import { BlobProvider } from "@react-pdf/renderer";

//COVER
import { CoverForm } from "./CoverForm";
//AP
import { CheckRequestForm } from "./CheckRequestForm";
//FILES
import { Files } from "./Files";
//Acitivity
import { Activity } from "./Activity";


const Main = ({ TYPE, OTHER, Master, House, Containers, AP, FILES, USER, EXTRA }) => {
    
    const [isClient, setIsClient] = useState(false);
    const [APType, setAPType] = useState("CHECK");
    useEffect(() => {
        setIsClient(true)
    })

    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

    const Print = ({House, Master}) => (
      <>
      <hr />
        <Row>
          <Col sm="3">
            <span className="text-primary">
              <span className="fa-stack">
                <i className="fa fa-circle fa-stack-2x text-primary"></i>
                <i className="fa fa-print fa-stack-1x fa-inverse"></i>
              </span>
              FORMS
            </span>
          </Col>
          {TYPE=="OCEAN" ?
          <Col sm="9" className="pt-1">
            <ButtonGroup className="pr-3">
                <Button size="sm" outline color="primary" onClick={()=>setAPType("CHECK")}>Check</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("CARD")}>Card</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("WIRE")}>Wire</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("ACH")}>ACH</Button>
            </ButtonGroup>
            {/* ACCOUNT + CONSIGNEE TO BE FIXED */}
            {isClient && (
            <ButtonGroup>
              <BlobProvider
              document={
                <CoverForm
                  hbl={House[0].F_HBLNo}
                  ams={House[0].F_AMSBLNO}
                  pkg={House[0].F_MarkPkg||Master.F_Pkgs}
                  vessel={`${Master.F_Vessel||Master.F_FLTno||Master.F_FLTNo}`}
                  loading={Master.F_LoadingPort}
                  discharge={Master.F_DisCharge||Master.F_Discharge}
                  dest={Master.F_FinalDest}
                  oimref={Master.F_RefNo}
                  acc={House[0].CUSTOMER||""}
                  etd={Master.F_ETD}
                  eta={Master.F_ETA}
                  mbl={Master.F_MBLNo||Master.F_MawbNo}
                  container={Containers}
                  consignee={House[0].SHIPPER||""}
                  type="ocean"
                />
              }
            >{({ url }) => (
              <a href={url} target="_blank">
              <Button size="sm" outline color="primary" className="mr-1" disabled={!isClient}>COVER A</Button>
              </a>
            )}</BlobProvider>
              <BlobProvider
              document={
                <CoverForm
                  hbl={House[0].F_HBLNo}
                  ams={House[0].F_AMSBLNO}
                  pkg={House[0].F_MarkPkg||Master.F_Pkgs}
                  vessel={`${Master.F_Vessel||Master.F_FLTno||Master.F_FLTNo}`}
                  loading={Master.F_LoadingPort}
                  discharge={Master.F_DisCharge||Master.F_Discharge}
                  dest={Master.F_FinalDest}
                  oimref={Master.F_RefNo}
                  acc={House[0].CUSTOMER||""}
                  etd={Master.F_ETD}
                  eta={Master.F_ETA}
                  mbl={Master.F_MBLNo||Master.F_MawbNo}
                  container={Containers}
                  consignee={House[0].CONSIGNEE||""}
                  type="ocean"
                />
              }
            >{({ url }) => (
              <a href={url} target="_blank">
              <Button size="sm" outline color="primary" disabled={!isClient}>COVER B</Button>
              </a>
            )}</BlobProvider>
            </ButtonGroup>
            )}
          </Col>
          :
          TYPE=="AIR" ? 
          <Col sm="9" className="pt-1">
            <ButtonGroup className="pr-3">
                <Button size="sm" outline color="primary" onClick={()=>setAPType("CHECK")}>Check</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("CARD")}>Card</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("WIRE")}>Wire</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("ACH")}>ACH</Button>
            </ButtonGroup>
            {isClient && (
              <BlobProvider
              document={
                <CoverForm
                  mawb={Master.F_MawbNo}
                  hawb={House[0].F_HAWBNo}
                  pkg={Master.F_Pkgs}
                  flight={`${Master.F_FLTno||Master.F_FLTNo}`}
                  loading={Master.F_LoadingPort}
                  discharge={Master.F_DisCharge||Master.F_Discharge}
                  dest={Master.F_FinalDest}
                  oimref={Master.F_RefNo}
                  acc={House[0].CUSTOMER||""}
                  etd={Master.F_ETD}
                  eta={Master.F_ETA}
                  container={Containers}
                  consignee={House[0].SHIPPER||""}
                  type="air"
                />
              }
            >{({ url }) => (
              <a href={url} target="_blank">
              <Button size="sm" outline color="primary" className="mr-1" disabled={!isClient}>COVER A</Button>
              </a>
            )}</BlobProvider>
            )}
            </Col>:<Col sm="9" className="pt-1"></Col>
          }
          <Col>
          {/* CUSTOMER + TYPE TO BE FIXED */}
          {isClient&&AP&&
            AP.map(ga=>(
              <BlobProvider
              key={ga.F_ID}
              document={
                <CheckRequestForm
                  type={APType}
                  vendor={ga.PAY}
                  amt={numberWithCommas(
                    Number.parseFloat(ga.F_InvoiceAmt).toFixed(2)
                  )}
                  oim={Master.F_RefNo}
                  customer={House[0].CUSTOMER||OTHER.CUSTOMER||""}
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
            >{({ url }) => (
              <a href={url} target="_blank">
                <Badge
                  className="mt-2 mr-2 text-white text-wrap" style={{fontSize: '0.7rem'}}
                >
                  <i className="fa fa-file"></i><span className="ml-2">AP_{ga.PAY}</span>
                </Badge>
              </a>
            )}</BlobProvider>
            ))
            }
          </Col>
        </Row>
      </>
    );

    if(TYPE=="OCEAN") {
      const MASTER1 = [
        { title: "MBL", data: Master.F_MBLNo },
        { title: "AGENT", data: Master.AGENT || "" },
        { title: "CARRIER", data: Master.CARRIER || "" }
      ]
      var MASTER2 = [
        { title: "CONTAINER LOAD", data: Master.F_LCLFCL=='F' ? "FCL" : "LCL"},
        { title: "TYPE", data: Master.F_MoveType },
        { title: "VESSEL", data: <a target='_blank' href={`http://www.google.com/search?q=marinetraffic+${Master.F_Vessel} ${Master.F_Voyage}`}>{`${Master.F_Vessel} ${Master.F_Voyage}`}</a> },
        { title: "LOADING", data: Master.F_LoadingPort },
        { title: "DISCHARGE", data: Master.F_DisCharge },
        { title: "FINAL DEST", data: Master.F_FinalDest },
      ]
      Containers.map((ga, i)=>MASTER2.push({title: `CONTAINER ${i+1}`, data: ga.F_ContainerNo}))

      const [isHouseOpen, setIsHouseOpen] = useState(false);
      const houseToggle=()=>setIsHouseOpen(!isHouseOpen);
      return (
        <Row className="mb-4">
          {/* MASTER */}
          <Col lg={6}>
            <Row>
              <Col sm="12">
                <Table className="table-borderless mt-2 table-sm" style={{fontSize: '0.85rem'}}>
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
                <Table className="table-borderless mt-2 table-sm" style={{fontSize: '0.85rem'}}>
                  <tbody>
                    {MASTER2.map((ga) => (
                      <tr key={ga.title}>
                        <th className="text-success">{ga.title}</th>
                        <th className="text-secondary">{ga.data}</th>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
              <Col sm="12">
                <Print House={House} Master={Master} />
                {/* <Mail /> */}
                <Files FilePath={Master.F_RefNo} FILE={FILES} />
              </Col>
            </Row>
          </Col>

          {/* HOUSE */}
          <Col lg={6}>
            {House &&
              House.map((ga, i) => {
                if (i < 2) {
                  return (
                    <Card
                      key={ga.F_ID}
                      style={{ borderRadius: 0 }}
                      className="px-3 mb-2 pt-2"
                    >
                      <CardHeader
                        style={{ backgroundColor: "#fff" }}
                        className="text-success py-1"
                      >
                        <Row className="py-0">
                          <Col sm="9">House</Col>
                          <Col>
                            {House.length > 2 && i === 0 && (
                              <Button
                                color="success mt-0 mb-1"
                                size="sm"
                                onClick={houseToggle}
                                style={{ borderRadius: "0" }}
                                outline
                              >
                                Show More
                              </Button>
                            )}
                          </Col>
                        </Row>
                      </CardHeader>
                      <Table className="table-borderless mt-2 table-sm" style={{fontSize: '0.8rem'}}>
                        <tbody>
                          <tr>
                            <th className="text-success">HBL</th>
                            <th className="text-secondary">{ga.F_HBLNo}</th>
                          </tr>
                          <tr>
                            <th className="text-success">CUSTOMER</th>
                            <th className="text-secondary">{ga.CUSTOMER}</th>
                          </tr>
                          <tr>
                            <th className="text-success">SHIPPER</th>
                            <th className="text-secondary">{ga.SHIPPER}</th>
                          </tr>
                          <tr>
                            <th className="text-success">CONSIGNEE</th>
                            <th className="text-secondary">{ga.CONSIGNEE}</th>
                          </tr>
                          <tr>
                            <th className="text-success">NOTIFY</th>
                            <th className="text-secondary">{ga.NOTIFY}</th>
                          </tr>
                          <tr>
                            <th className="text-success">COMMODITY</th>
                            <th className="text-secondary">{ga.F_Commodity}</th>
                          </tr>
                          <tr>
                            <th className="text-success">PKG</th>
                            <th className="text-secondary">{ga.F_MarkPkg}</th>
                          </tr>
                          <tr>
                            <th className="text-success">KGS</th>
                            <th className="text-secondary">{numberWithCommas(ga.F_KGS)}</th>
                          </tr>
                          <tr>
                            <th className="text-success">CBM</th>
                            <th className="text-secondary">{numberWithCommas(ga.F_CBM)}</th>
                          </tr>
                          <tr>
                            <th className="text-success">REFERENCE</th>
                            <th className="text-secondary">
                              {ga.F_CustRefNo || "NO REFERENCE"}
                            </th>
                          </tr>
                          {Containers.map(ele=>{
                                if(ele.F_OIHBLID==ga.F_ID)
                                  return(
                                    <React.Fragment key={ga.F_ID+ele.F_ID}>
                                    <tr>
                                      <th className="text-primary">CONTAINER</th>
                                      <th className="text-secondary">{ele.F_ContainerNo}</th> 
                                    </tr>
                                    <tr>
                                      <th className="text-primary">TYPE</th>
                                      <th className="text-secondary">{ele.F_ConType}</th> 
                                    </tr>
                                    <tr>
                                      <th className="text-primary">KGS</th>
                                      <th className="text-secondary">{numberWithCommas(ele.F_KGS)}</th> 
                                    </tr>
                                    <tr>
                                      <th className="text-primary">PKG</th>
                                      <th className="text-secondary">{numberWithCommas(ga.F_PKGS) || numberWithCommas(ga.F_Pkgs)}</th> 
                                    </tr>
                                    </React.Fragment>
                                  )
                          })}
                        </tbody>
                      </Table>
                    </Card>
                  );
                } else {
                  return (
                    <Collapse isOpen={isHouseOpen}>
                      <Card
                        key={ga.F_ID}
                        style={{ borderRadius: 0 }}
                        className="px-3 mb-2 pt-2"
                      >
                        <CardHeader
                          style={{ backgroundColor: "#fff" }}
                          className="text-success py-1"
                        >
                          <Row>
                            <Col sm="9">House {ga.F_ID}</Col>
                          </Row>
                        </CardHeader>
                        <Table className="table-borderless mt-2 table-sm" style={{fontSize: '0.8rem'}}>
                          <tbody>
                            <tr>
                              <th className="text-success">HBL</th>
                              <th className="text-secondary">{ga.F_HBLNo}</th>
                            </tr>
                            <tr>
                              <th className="text-success">CUSTOMER</th>
                              <th className="text-secondary">{ga.CUSTOMER}</th>
                            </tr>
                            <tr>
                              <th className="text-success">SHIPPER</th>
                              <th className="text-secondary">{ga.SHIPPER}</th>
                            </tr>
                            <tr>
                              <th className="text-success">CONSIGNEE</th>
                              <th className="text-secondary">{ga.CONSIGNEE}</th>
                            </tr>
                            <tr>
                              <th className="text-success">NOTIFY</th>
                              <th className="text-secondary">{ga.NOTIFY}</th>
                            </tr>
                            <tr>
                              <th className="text-success">COMMODITY</th>
                              <th className="text-secondary">
                                {ga.F_Commodity}
                              </th>
                            </tr>
                            <tr>
                              <th className="text-success">PKG</th>
                              <th className="text-secondary">{ga.F_MarkPkg}</th>
                            </tr>
                            <tr>
                              <th className="text-success">KGS</th>
                              <th className="text-secondary">{ga.F_KGS}</th>
                            </tr>
                            <tr>
                              <th className="text-success">CBM</th>
                              <th className="text-secondary">{ga.F_CBM}</th>
                            </tr>
                            <tr>
                              <th className="text-success">REFERENCE</th>
                              <th className="text-secondary">
                                {ga.F_CustRefNo || "NO REFERENCE"}
                              </th>
                            </tr>
                            {Containers.map(ele=>{
                                if(ele.F_OIHBLID==ga.F_ID) 
                                  return(
                                    <>
                                    <React.Fragment key={ele.F_ID+ele.F_OIHBLID}>
                                    <tr>
                                      <th className="text-primary">CONTAINER</th>
                                      <th className="text-secondary">{ele.F_ContainerNo}</th> 
                                    </tr>
                                    <tr>
                                      <th className="text-primary">TYPE</th>
                                      <th className="text-secondary">{ele.F_ConType}</th> 
                                    </tr>
                                    <tr>
                                      <th className="text-primary">KGS</th>
                                      <th className="text-secondary">{numberWithCommas(ele.F_KGS)}</th> 
                                    </tr>
                                    <tr>
                                      <th className="text-primary">PKG</th>
                                      <th className="text-secondary">{numberWithCommas(ga.F_PKGS) || numberWithCommas(ga.F_Pkgs)}</th> 
                                    </tr>
                                    </React.Fragment>
                                    </>
                                  )
                          })}
                          </tbody>
                        </Table>
                      </Card>
                    </Collapse>
                  );
                }
              })}
            {/* CONTAINER */}
            {/* {Containers &&
              Containers[0].F_ContainerNo &&
              Containers.map((ga) => (
                <Card
                  key={ga.F_ID}
                  style={{ borderRadius: 0 }}
                  className="px-3 mb-2 pt-2"
                >
                  <CardHeader
                    style={{ backgroundColor: "#fff" }}
                    className="text-warning py-1"
                  >
                    Container
                  </CardHeader>
                  <Table className="table-borderless mt-2 table-sm" style={{fontSize: '0.8rem'}}>
                    <tbody>
                      <tr>
                        <th className="text-warning">CONTAINER</th>
                        <th className="text-secondary">{ga.F_ContainerNo}</th>
                      </tr>
                      <tr>
                        <th className="text-warning">TYPE</th>
                        <th className="text-secondary">{ga.F_ConType}</th>
                      </tr>
                      <tr>
                        <th className="text-warning">KGS</th>
                        <th className="text-secondary">{ga.F_KGS}</th>
                      </tr>
                      <tr>
                        <th className="text-warning">PKG</th>
                        <th className="text-secondary">
                          {ga.F_PKGS || ga.F_Pkgs}
                        </th>
                      </tr>
                      <tr>
                        <th className="text-warning">F_OIHBLID</th>
                        <th className="text-secondary">
                          {ga.F_OIHBLID}
                        </th>
                      </tr>
                    </tbody>
                  </Table>
                </Card>
              ))} */}
          </Col>
          <Col sm="12">
            <Activity REF={Master.F_RefNo} USER={USER} EXTRA={EXTRA} />
          </Col>

          <style global jsx>
            {`
              @font-face {
                font-family: "NEXON Lv2 Gothic";
                src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                  format("woff");
                font-weight: normal;
                font-style: normal;
              }
              * {
                font-family: "NEXON Lv2 Gothic";
              }
              .alert button {
                padding-top: "1rem" !important;
                padding-bottom: "1rem";
              }
              table > th {
                font-weight: 1000;
              }
            `}
          </style>
        </Row>
      );
    } else {
      if(TYPE=="AIR") {
        // MASTER
        const AIR_M_SCH = [
          { title: "CUSTOMER", data: House[0].CUSTOMER },
          { title: "MAWB", data: Master.F_MawbNo },
          { title: "FLIGHT", data: <a target='_blank' href={`http://www.google.com/search?q=${Master.F_FLTno||Master.F_FLTNo}`}>{Master.F_FLTno||Master.F_FLTNo}</a> },
          { title: "WEIGHT", data: Master.F_GrossWeight },
          { title: "PKGS", data: `${Master.F_Pkgs}` },
          { title: "UPDATE", data: moment(Master.F_U1Date).utc().format("lll") },
        ]
        return (
          <Row className="mb-4">
            {/* MASTER */}
            <Col lg={6}>
              <Row>
                <Col sm="12">
                  <Table className="table-borderless mt-2 table-sm">
                    <tbody>
                      {AIR_M_SCH.map((ga) => (
                        <tr key={ga.title}>
                          <th className="text-success">{ga.title}</th>
                          <th className="text-secondary">{ga.data}</th>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
                <Col sm="12">
                  <Print House={House} Master={Master} />
                  {/* <Mail /> */}
                  <Files FilePath={Master.F_RefNo} FILE={FILES} />
                </Col>
              </Row>
            </Col>
            {/* HOUSE */}
            <Col lg={6}>
              {House &&
                House.map((ga) => (
                  <Card
                    key={ga.F_ID}
                    style={{ borderRadius: 0 }}
                    className="px-3 mb-2 pt-2"
                  >
                    <CardHeader
                      style={{ backgroundColor: "#fff" }}
                      className="text-success py-1"
                    >
                      HOUSE
                    </CardHeader>
                    <Table className="table-borderless mt-2 table-sm">
                      <tbody>
                        <tr>
                          <th className="text-success">HAWB</th>
                          <th className="text-secondary">{ga.F_HawbNo||ga.F_HAWBNo}</th>
                        </tr>
                        <tr>
                          <th className="text-success">ITEM</th>
                          <th className="text-secondary">{ga.F_Description}</th>
                        </tr>
                        <tr>
                          <th className="text-success">CUSTOMER</th>
                          <th
                            className="text-secondary"
                            style={{
                              width: "300px",
                              display: "inline-block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ga.F_CName}
                          </th>
                        </tr>
                        <tr>
                          <th className="text-success">NOTIFY</th>
                          <th
                            className="text-secondary"
                            style={{
                              width: "300px",
                              display: "inline-block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ga.F_NName}
                          </th>
                        </tr>
                        <tr>
                          <th className="text-success">SHIPPER</th>
                          <th
                            className="text-secondary"
                            style={{
                              width: "300px",
                              display: "inline-block",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ga.F_SName}
                          </th>
                        </tr>
                        <tr>
                          <th className="text-success">WEIGHT</th>
                          <th className="text-secondary">{ga.F_GrossWeight}</th>
                        </tr>
                        <tr>
                          <th className="text-success">PKGS</th>
                          <th className="text-secondary">
                            {ga.F_Pkgs}{ga.F_PUnit}
                          </th>
                        </tr>
                      </tbody>
                    </Table>
                  </Card>
                ))}
            </Col>
            <Col sm="12">
            <Activity REF={Master.F_RefNo} USER={USER} EXTRA={EXTRA}/>
            </Col>
            <style global jsx>
              {`
                  @font-face {
                  font-family: "NEXON Lv2 Gothic";
                  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                    format("woff");
                  font-weight: normal;
                  font-style: normal;
                }
                * {
                  font-family: 'NEXON Lv2 Gothic';
                }
                .alert button {
                  padding-top: "1rem" !important;
                  padding-bottom: "1rem";
                }
                table > th {
                  font-weight: 1000;
                }
              `}
            </style>
          </Row>
        );
      } else {
        const OTHER_SCH = [
          { title: "CUSTOMER", data: OTHER.CUSTOMER },
          { title: "MASTER", data: OTHER.F_Mblno || "NONE" },
          { title: "HOUSE", data: OTHER.F_Hblno || "NONE" },
          { title: "TYPE", data: OTHER.F_Type },
          { title: "CBM", data: OTHER.F_CBM },
          { title: "KGS", data: OTHER.F_Kgs },
          { title: "PKGS", data: `${OTHER.F_Pkgs} ${OTHER.F_Punit}` },
          { title: "PIC", data: OTHER.F_U1ID.toUpperCase() },
          { title: "UPDATE", data: moment(OTHER.F_U1Date).utc().format("lll") },
          { title: "MEMO", data: OTHER.F_IMemo },
        ];
        return (
          <Row className="mb-4">
            {/* MASTER */}
            <Col lg={6}>
              <Table className="table-borderless mt-2 table-sm">
                <tbody>
                  {OTHER_SCH.map((ga) => (
                    <tr key={ga.title}>
                      <th className="text-success">{ga.title}</th>
                      <th className="text-secondary">{ga.data}</th>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
            {/* HOUSE */}
            <Col lg={6}>
              <Row>
                <Col sm="3">
                  <span className="text-primary">
                    <span className="fa-stack">
                      <i className="fa fa-circle fa-stack-2x text-primary"></i>
                      <i className="fa fa-print fa-stack-1x fa-inverse"></i>
                    </span>
                    FORMS
                  </span>
                </Col>
                <Col>
                <ButtonGroup className="pr-3">
                <Button size="sm" outline color="primary" onClick={()=>setAPType("CHECK")}>Check</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("CARD")}>Card</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("WIRE")}>Wire</Button>
                <Button size="sm" outline color="primary" onClick={()=>setAPType("ACH")}>ACH</Button>
                </ButtonGroup>
                {isClient &&
                  AP &&
                  AP.map((ga) => (
                    <BlobProvider
                      key={ga.F_ID}
                      document={
                        <CheckRequestForm
                          type={APType}
                          vendor={ga.PAY}
                          amt={numberWithCommas(
                            Number.parseFloat(ga.F_InvoiceAmt).toFixed(2)
                          )}
                          oim={OTHER.F_RefNo}
                          customer={OTHER.CUSTOMER || ""}
                          inv={ga.F_InvoiceNo}
                          metd={moment(OTHER.F_ETD).utc().format("MM/DD/YY")}
                          meta={moment(OTHER.F_ETA).utc().format("MM/DD/YY")}
                          pic={ga.F_U1ID}
                          today={moment().format("l")}
                          desc={ga.F_Descript}
                        />
                      }
                    >
                      {({ url }) => (
                        <a href={url} target="_blank">
                          <Badge
                            className="mt-2 mr-2 text-white text-wrap" style={{fontSize: '0.7rem'}}
                          >
                            <i className="fa fa-file"></i>
                            <span className="ml-2">AP_{ga.PAY}</span>
                          </Badge>
                        </a>
                      )}
                    </BlobProvider>
                  ))}
                </Col>
              </Row>
              {/* <Mail /> */}
              <Files FilePath={OTHER.F_RefNo} FILE={FILES} />
            </Col>
            <Col sm="12">
              <Activity REF={OTHER.F_RefNo} USER={USER} EXTRA={EXTRA}/>
            </Col>
            <style global jsx>
              {`
                  @font-face {
                  font-family: "NEXON Lv2 Gothic";
                  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                    format("woff");
                  font-weight: normal;
                  font-style: normal;
                }
                * {
                  font-family: 'NEXON Lv2 Gothic';
                }
                .alert button {
                  padding-top: "1rem" !important;
                  padding-bottom: "1rem";
                }
                table > th {
                  font-weight: 1000;
                }
              `}
            </style>
          </Row>
        );
      }
    }
};

export default Main;