import { useEffect, useState } from "react";
import {useDropzone} from 'react-dropzone'
import axios, { post } from 'axios'
import { Alert, Badge, Button, ButtonGroup, Card, CardHeader, Col, CustomInput, FormGroup, Input, Label, Row, Table } from "reactstrap";
//AP
import moment from "moment";
import { CheckRequestForm } from "./CheckRequestForm";
import { BlobProvider } from "@react-pdf/renderer";

//COVER
import { CoverForm } from "./CoverForm";

//ADD INFO
import BootstrapTable from 'react-bootstrap-table-next';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

const MAIN = ({ DATA, ADD }) => {
    const [isClient, setIsClient] = useState(false);
    const [EmailText, setEmailText] = useState('');
    const [TypeSelected, setTypeSelected] = useState(false);
    
    const [invoice, setInvoice] = useState(false);
    
    const onFileSubmit = () => {
      if(invoice) {
        console.log(invoice)
      } else {
        alert("PLEASE UPLOAD INVOICE FILE")
      }
    }

    const onDrop = React.useCallback(acceptedFiles => {
      console.log("DROPPED")
      // const formData = new FormData()
      // formData.append('file', acceptedFiles[0])
      // const config = {
      //   headers: {
      //     'content-type': 'multipart/form-data'
      //   }
      // }
      // console.log("UPLOAD START")
      // const upload = new Promise((res, rej)=>res(post(`${process.env.BASE_URL}api/file/upload`, formData, config)))
      // upload.then(ga=> console.log(ga))
    }, [])

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      acceptedFiles
    } = useDropzone({onDrop});

    const files = acceptedFiles.map(file => <a href={URL.createObjectURL(file)} key={file.path} target="__blank"><Badge className="mr-2" color="primary"><i className="fa fa-file"></i>{file.path}</Badge></a>);

    const style = React.useMemo(() => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }), [
      isDragActive,
      isDragReject,
      isDragAccept
    ]);

    useEffect(() => {
        setIsClient(true)
    })

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const MASTER = (DATA && DATA.OCEAN.length) && DATA.OCEAN[0]

    const Volume = encodeURIComponent(MASTER.VOL).replace("%0D%0A", "%20")
    const Gross = encodeURIComponent(MASTER.GROSS).replace("%0D%0A", "%20")
    const mailTo = 'it@jamesworldwide.com'
    const mailCC = 'it@jamesworldwide.com'
    const mailSubject = `[JW] ${MASTER.ACCOUNT} MBL# ${MASTER.MBL} HBL# ${MASTER.HBL} CNTR# ${DATA.CONTAINER && DATA.CONTAINER.map(ga=>`${ga.F_ContainerNo}`)}ETD ${moment(MASTER.ETD).add(1, "days").format('l')} ETA ${moment(MASTER.ETA).add(1, "days").format('l')} // ${MASTER.REF}`
    const mailBody= `Dear ${MASTER.ACCOUNT}
    \nPlease note that there is an OCEAN SHIPMENT for ${MASTER.ACCOUNT} scheduled to depart on ${moment(MASTER.ETA).add(1, "days").format('LL')}.\n${EmailText && `\n${EmailText}`}
    \nPlease refer to the pre-alert below\n
    ROUTE:  ${MASTER.LOADING} - ${MASTER.DISCHARGE}
    MBL:  ${MASTER.MBL}
    HBL:  ${MASTER.HBL}
    DETAIL:  ${MASTER.ITEM}
    CARRIER:  ${MASTER.VESSEL}
    VOYAGE:  ${MASTER.VOYAGE}
    PORT OF LOADING:  ${MASTER.LOADING}
    PORT OF DISCHARGE:  ${MASTER.DISCHARGE}
    ETD:  ${moment(MASTER.ETD).add(1, "days").format('LL')}
    ETA:  ${moment(MASTER.ETA).add(1, "days").format('LL')}
    SHIPPER:  ${MASTER.SHIPPER}
    CONTAINER: ${DATA.CONTAINER ? DATA.CONTAINER.map(ga=>`${ga.F_ContainerNo}`) : ""}
    VOLUME:  ${decodeURIComponent(Volume)}
    WEIGHT:  ${decodeURIComponent(Gross)}`
    var emailHref = `mailto:${mailTo}?cc=${mailCC}&subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

    const mailSubjectWH = `[JW] WAREHOUSE ASN FOR ${MASTER.ACCOUNT} / CNTR# ${DATA.CONTAINER && DATA.CONTAINER.map(ga=>`${ga.F_ContainerNo} `)} ETA ${moment(MASTER.ETA).add(1, "days").format('l')} // ${MASTER.REF}`
    const mailBodyWH = `Dear Warehouse Manager,
    \nPlease note that there is an upcoming schedule for container arrival at 2301 Raymer Avenue, Fullerton CA 92833.
    \nPlease refer to the ASN below\n
    JW REF: ${MASTER.REF}
    CONTAINER: ${DATA.CONTAINER ? DATA.CONTAINER.map((ga, i)=>`\n      ${i+1}. ${ga.F_ContainerNo}(${ga.F_ConType})(${ga.F_KGS} KGS)(${ga.F_PKGS} PKGS)`) : ""}
    TOTAL VOLUME:  ${decodeURIComponent(Volume)}
    TOTAL WEIGHT:  ${decodeURIComponent(Gross)}
    PRODUCT DETAIL: ${MASTER.ITEM}
    PORT ETA:  ${moment(MASTER.ETA).add(1, "days").format('LL')}
    DELIVERY ETA:
    CARRIER INFORMATION:
    PALLET CODES:
    NOTE: ${EmailText}
    `
    const WHmailTO = ``
    const WHmailCC = `JW WAREHOUSE <whs@jamesworldwide.com>`
    var emailHrefWH = `mailto:${WHmailTO}?cc=${encodeURIComponent(WHmailCC)}&subject=${encodeURIComponent(mailSubjectWH)}&body=${encodeURIComponent(mailBodyWH)}`

    const columns = [
      {
        dataField: "F_OF",
        text: "OF",
        sort: true,
        align: 'center', 
        headerStyle: {width: '10%', textAlign: 'center'},
      },
      {
        dataField: "F_DO",
        text: "DO",
        sort: true,
        align: 'center', 
        headerStyle: {width: '10%', textAlign: 'center'},
      },
      {
        dataField: "F_AN",
        text: "AN",
        sort: true,
        align: 'center', 
        headerStyle: {width: '10%', textAlign: 'center'},
      },
      {
        dataField: "F_CB",
        text: "CB",
        sort: true,
        align: 'center', 
        headerStyle: {width: '10%', textAlign: 'center'},
      },
      {
        dataField: "F_ARRIVAL",
        text: "ARRIVAL",
        sort: true,
        align: 'center', 
        headerStyle: {width: '10%', textAlign: 'center'},
      },
      {
        dataField: "F_STATUS",
        text: "STATUS",
        sort: true,
        align: 'center', 
        headerStyle: {textAlign: 'center'},
      },
    ]

    const defaultSorted = [{
      dataField: 'F_REF',
      order: 'desc',
    }];

    return (
      <>
        <Row>
          <Col lg={8}>
            <span className="text-primary">CUSTOMER</span>
            <span> {MASTER.ACCOUNT}</span>
            <br />
            <span className="text-primary">SHIPPER</span>
            <span> {MASTER.SHIPPER}</span>
            <br />
            <span className="text-primary">MBL</span>
            <span className="text-secondary"> {MASTER.MBL}</span>
            <br />
            <span className="text-primary">AMSBLNO</span>
            <span className="text-secondary"> {MASTER.AMSBLNO}</span>
            <br />
            <span className="text-primary">ITEM</span>
            <span className="text-secondary"> {MASTER.ITEM}</span>
            <br />
            <span className="text-primary">TYPES</span>
            <span className="text-secondary"> {MASTER.TYPES}</span>
            <br />
            <span className="text-primary">VESSEL</span>
            <span className="text-secondary"> {MASTER.VESSEL}</span>
            <br />
            <span className="text-primary">VOYAGE</span>
            <span className="text-secondary"> {MASTER.VOYAGE}</span>

            <hr />
            <Row>
              <Col lg="12">
                <h5 className="text-success">
                  <span className="fa-stack">
                    <i className="fa fa-circle fa-stack-2x text-success"></i>
                    <i className="fa fa-print fa-stack-1x fa-inverse"></i>
                  </span>
                  PRINT TOOL
                </h5>
                <ButtonGroup>
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => setTypeSelected("CHECK")}
                    active={TypeSelected === "CHECK"}
                    style={{ borderRadius: 0 }}
                    disabled={!isClient || !DATA.AP}
                  >
                    Check
                  </Button>
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => setTypeSelected("CREDIT")}
                    active={TypeSelected === "CREDIT"}
                    style={{ borderRadius: 0 }}
                    disabled={!isClient || !DATA.AP}
                  >
                    Credit Card
                  </Button>
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => setTypeSelected("WIRE")}
                    active={TypeSelected === "WIRE"}
                    style={{ borderRadius: 0 }}
                    disabled={!isClient || !DATA.AP}
                  >
                    Wire
                  </Button>
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => setTypeSelected("ACH")}
                    active={TypeSelected === "ACH"}
                    style={{ borderRadius: 0 }}
                    disabled={!isClient || !DATA.AP}
                  >
                    ACH
                  </Button>
                </ButtonGroup>
                {isClient && (
                  <BlobProvider
                    document={
                      <CoverForm
                        hbl={MASTER.HBL}
                        ams={MASTER.AMSBLNO}
                        pkg={MASTER.PKG + " " + MASTER.UNIT}
                        vessel={MASTER.VESSEL}
                        loading={MASTER.LOADING}
                        discharge={MASTER.DISCHARGE}
                        dest={MASTER.DEST}
                        oimref={MASTER.REF}
                        acc={MASTER.ACCOUNT}
                        etd={MASTER.ETD}
                        eta={MASTER.ETA}
                        mbl={MASTER.MBL}
                        container={DATA.CONTAINER}
                        consignee={MASTER.CONSIGNEE}
                      />
                    }
                  >
                    {({ url }) => (
                      <a href={url} target="_blank">
                        <Button
                          size="sm"
                          className="ml-4"
                          color="primary"
                          style={{ borderRadius: 0 }}
                          disabled={!isClient}
                        >
                          <i className="fa fa-folder"></i> Folder Cover
                        </Button>
                      </a>
                    )}
                  </BlobProvider>
                )}
              </Col>
              <Col lg="12">
                {/* IF (PAGE IS LOADED) AND (DATA IS EXIST) AND (TYPE IS SELECTED) DISPLAY AP BUTTONS */}
                {isClient &&
                  TypeSelected &&
                  DATA.AP &&
                  DATA.AP.map((ga) => (
                    <BlobProvider
                      key={ga.F_ID}
                      document={
                        <CheckRequestForm
                          type={TypeSelected}
                          vendor={ga.PAY}
                          amt={numberWithCommas(
                            Number.parseFloat(ga.F_InvoiceAmt).toFixed(2)
                          )}
                          oim={MASTER.REF}
                          customer={MASTER.ACCOUNT}
                          inv={ga.F_InvoiceNo}
                          metd={moment(MASTER.ETD)
                            .add(1, "days")
                            .format("MM/DD/YY")}
                          meta={moment(MASTER.ETA)
                            .add(1, "days")
                            .format("MM/DD/YY")}
                          pic={ga.F_U1ID}
                          today={moment().format("l")}
                          desc={ga.F_Descript}
                        />
                      }
                    >
                      {({ url }) => (
                        <a href={url} target="_blank">
                          <Badge
                            color="success"
                            className="mt-2 mr-2"
                            style={{ borderRadius: 0 }}
                          >
                            <i className="fa fa-file"></i> {ga.PAY}
                          </Badge>
                        </a>
                      )}
                    </BlobProvider>
                  ))}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col>
                <Row>
                  <Col sm="8">
                    <h5 className="text-success">
                      <span className="fa-stack">
                        <i className="fa fa-circle fa-stack-2x text-success"></i>
                        <i className="fa fa-envelope fa-stack-1x fa-inverse"></i>
                      </span>
                      MAIL TOOL
                    </h5>
                  </Col>
                  <Col sm="4" className="d-flex flex-row-reverse">
                    <a
                      href={emailHrefWH}
                      target="__blank"
                      style={{ color: "white" }}
                    >
                      <Button
                        color="primary"
                        size="sm"
                        style={{ borderRadius: 0 }}
                      >
                        <i className="fa fa-envelope"></i> ASN
                      </Button>
                    </a>
                    <a
                      href={emailHref}
                      target="__blank"
                      style={{ color: "white" }}
                    >
                      <Button
                        className="mr-2"
                        color="primary"
                        size="sm"
                        style={{ borderRadius: 0 }}
                      >
                        <i className="fa fa-envelope"></i> PRE-ALERT
                      </Button>
                    </a>
                  </Col>
                  <Col>
                    <Input
                      className="my-3 mx-2"
                      type="textarea"
                      onChange={(e) => setEmailText(e.target.value)}
                      placeholder="TYPE HERE FOR EMAIL"
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col sm="8" className="col-auto mr-auto">
              <h5 className="text-success">
                      <span className="fa-stack">
                        <i className="fa fa-circle fa-stack-2x text-success"></i>
                        <i className="fa fa-file fa-stack-1x fa-inverse"></i>
                      </span>
                      UPLOAD TOOL
              </h5>
              </Col>
              <Col sm="4" className="d-flex flex-row-reverse">
                <Button size="sm" style={{borderRadius: 0}} color="success" onClick={onFileSubmit}>SUBMIT</Button>
              </Col>
              {/* <Col>
              <FormGroup>
                <Label for="invoice" style={{fontSize: '0.9rem'}}>
                  INVOICE {invoice&&<a href={URL.createObjectURL(invoice)} target="__blank">FILE</a>}
                </Label>
                <CustomInput
                  type="file"
                  id="invoice"
                  name="customFile"
                  label="INVOICE"
                  onChange={e=>setInvoice(e.target.files[0])}
                />
              </FormGroup>
              </Col> */}
                  <Col sm="3" className="mt-3">
                  <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>INVOICE</p>
              </div>
                  </Col>
                
                  <Col sm="3" className="mt-3">
              <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>O/F</p>
              </div>
              <aside className="mt-3">
                <ul>{files}</ul>
              </aside>
                  </Col>

                  <Col sm="3" className="mt-3">
                  <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>CUSTOMS</p>
              </div>
                  </Col>

                  <Col sm="3" className="mt-3">
                  <div {...getRootProps({ style })}>
                <input {...getInputProps()} />
                <p>B/L</p>
              </div>
                  </Col>

            </Row>
            <Row>
              <Col>
                {ADD.status && (
                  <BootstrapTable
                    data={[ADD]}
                    keyField="F_HBL"
                    columns={columns}
                    defaultSorted={defaultSorted}
                  />
                )}
              </Col>
            </Row>
          </Col>
          <Col lg={4}>
            {DATA.OCEAN.map((ga) => (
              <Card
                key={ga.HBL}
                style={{ borderRadius: 0 }}
                className="px-3 mb-2 pt-2"
              >
                <CardHeader
                  style={{ backgroundColor: "#fff", fontWeight: "1000" }}
                  className="text-success py-1"
                >
                  HOUSE
                </CardHeader>
                <Table className="table-borderless mt-2 table-sm">
                  <tbody>
                    <tr>
                      <th>
                        <span className="text-success">HBL</span>
                      </th>
                      <th>{ga.HBL}</th>
                    </tr>
                    <tr>
                      <th>
                        <span className="text-success">REFERENCE</span>
                      </th>
                      <th>{ga.CUSTREF || "NO DATA"}</th>
                    </tr>
                    <tr>
                      <th>
                        <span className="text-success">GROSS</span>
                      </th>
                      <th>{ga.GROSS || "NO DATA"}</th>
                    </tr>
                    <tr>
                      <th>
                        <span className="text-success">MARKPKG</span>
                      </th>
                      <th>
                        {ga.PKG} {ga.UNIT}
                      </th>
                    </tr>
                    <tr>
                      <th>
                        <span className="text-success">VOL</span>
                      </th>
                      <th>{ga.VOL || "NO DATA"}</th>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            ))}
            {DATA.CONTAINER &&
              DATA.CONTAINER.map((ga) => (
                <Card
                  key={ga.F_ContainerNo}
                  style={{ borderRadius: 0 }}
                  className="py-2 px-3 mb-2"
                >
                  <CardHeader
                    style={{ backgroundColor: "#fff", fontWeight: "1000" }}
                    className="text-warning py-1"
                  >
                    CONTAINER
                  </CardHeader>
                  <Table className="table-borderless mt-2 table-sm">
                    <tbody>
                      <tr>
                        <th>
                          <span className="text-warning">CNTR</span>
                        </th>
                        <th>{ga.F_ContainerNo || "NO DATA"}</th>
                      </tr>
                      <tr>
                        <th>
                          <span className="text-warning">TYPE</span>
                        </th>
                        <th>{ga.F_ConType || "NO DATA"}</th>
                      </tr>
                      <tr>
                        <th>
                          <span className="text-warning">SEAL</span>
                        </th>
                        <th>{ga.F_SealNo || "NO DATA"}</th>
                      </tr>
                      <tr>
                        <th>
                          <span className="text-warning">TOTAL</span>
                        </th>
                        <th>{ga.F_PKGS || "NO DATA"}</th>
                      </tr>
                      <tr>
                        <th>
                          <span className="text-warning">WEIGHT</span>
                        </th>
                        <th>{ga.F_KGS || "NO DATA"}</th>
                      </tr>
                    </tbody>
                  </Table>
                </Card>
              ))}
          </Col>
        </Row>
        <style global jsx>
          {`
            .alert button {
              padding-top: "1rem" !important;
              padding-bottom: "1rem";
            }
            .custom-file-label {
              font-size: 0.9rem;
            }
          `}
        </style>
      </>
    );};

export default MAIN;