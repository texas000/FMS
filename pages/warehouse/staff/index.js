import cookie from 'cookie';
import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import { Button, Card, Col, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, {CSVExport} from 'react-bootstrap-table2-toolkit';

// NEED THE EXPORT FUNCTION BATCH

const Index = ({Cookie, Staff, Work}) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [value, onChange] = React.useState(new Date());

  //    Add Staff
  const [StaffName, setStaffName] = React.useState(false);
  const [StaffAgency, setStaffAgency] = React.useState(false);

  //    Add Time Card
  const [Clock, setClock] = React.useState([]);

  //   GET WORK CLOCK LIST
  const [Works, SetWorks] = React.useState(Work);

  const [modal, setModal] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const toggle = () => setModal(!modal);
  const toggle2 = () => setModal2(!modal2);

  const StaffData = Staff.map((staff) => ({
    ...staff,
    START: "08:00",
    END: "16:30",
    LSTART: "12:00",
    LEND: "12:30",
  }));

  // Add Staff to the server and save [MODAL 1]
  const addStaff = async () => {
    const qry = `N'${StaffName}', GETDATE(), '${StaffAgency}'`;
    const Fetch = await fetch("/api/warehouse/addStaff", {
      body: qry,
      method: "POST",
    });
    if (Fetch.status == 200) {
      router.reload();
      toggle();
      setStaffName(false);
      setStaffAgency(false);
    }
  };

  // FIRE WHEN USER CLICK CANENDAR - GET TIME SHEETS FOR SPECIFIC DATE
  const getWork = async (e) => {
    const Fetch = await fetch("/api/warehouse/getWork", {
      headers: { time: moment(e).format("YYYY-MM-DD") },
    });
    if (Fetch.status == 200) {
      const Result = await Fetch.json();
      SetWorks(Result);
    } else {
      SetWorks(false);
    }
  };

  // SAVE TIME FOR WORKS
  const save = async () => {
    if (Clock.length) {
      const VALUES = Clock.map(
        (clock) =>
          `('${clock.S_ID}', '${moment(value).format("YYYY-MM-DD")}', '${
            clock.START
          }', '${clock.END}', '${clock.LSTART}', '${clock.LEND}')`
      );
      const Fetch = await fetch("/api/warehouse/addWork", {
        body: VALUES.toString(),
        method: "POST",
      });
      Fetch.json().then((ga) => {
        if (ga === true) {
          alert("SUCCESSFULLY SAVED");
          setClock([]);
          // SetWorks(Clock)
          router.reload();
        } else {
          if (ga === false) {
            alert("ERROR");
            setClock([]);
          } else {
            if (ga.number == 2627) {
              alert(`DATA CAN'T BE DUPLICATED`);
            } else {
              alert(JSON.stringify(ga));
            }
          }
        }
      });
    } else {
      alert("PLEASE SELECT STAFF AND TIME");
    }
  };

  //SELECT STAFF TO ADD TIME CLOCK [MODAL 2]
  const handleOnSelectAll = (isSelect) => {
    if (isSelect) {
      setClock([...StaffData]);
    } else {
      setClock([]);
    }
  };
  //SELECT ALL STAFF TO ADD TIME CLOCK [MODAL 2]
  const handleOnSelect = (row, isSelect) => {
    if (isSelect) {
      //   CHECK IF ELEMENT IS EXIST IN THE CLOCK ARRAY
      const bools = (element) => element.S_ID == row.S_ID;

      //   SAVE IF ELEMENT IS NOT EXIST
      if (!Clock.some(bools)) {
        setClock((prev) => [...prev, row]);
      }
    } else {
      setClock(Clock.filter((x) => x.S_ID !== row.S_ID));
    }
  };

  //TABEL EXPORT BUTTON
  const { ExportCSVButton } = CSVExport;

  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <Row className="py-2">
        <Col className="text-right">
          <Button
            outline
            color="success"
            style={{ borderRadius: 0 }}
            onClick={handleClick}
          >
            Export
          </Button>
        </Col>
      </Row>
    );
  };

  useEffect(() => {
    !TOKEN && router.push("/login");
    console.log(Work);
  }, []);

  if (TOKEN && TOKEN.group) {
    return (
      <>
        <Layout TOKEN={TOKEN} TITLE="STAFF">
          {/* TOP HEADER */}
          <h3 style={{ fontFamily: "Roboto, sans-serif", fontWeight: "700" }}>
           Warehouse <span className="text-secondary">Staff Management</span>
         </h3>
          <Button
            outline
            style={{
              borderRadius: 0,
              position: "fixed",
              top: "0.5rem",
              right: "2rem",
            }}
            onClick={() => setModal(true)}
          >
            <i className="fa fa-user"></i> Upload Staff
          </Button>
          <Row className="py-4 justify-content-between">
            <Col lg="9" className="col-auto mt-4">
              <Card>
                {/* TIME CLOCK - ADD / SAVE BUTTONS */}
                <Row className="my-4 mx-4 justify-content-between">
                  <Col className="col-auto">
                    <h4>Add Time Clock</h4>
                  </Col>
                  <Col className="col-auto">
                    <Button
                      onClick={() => setModal2(true)}
                      style={{ borderRadius: "0" }}
                      outline
                      color="primary"
                    >
                      <i className="fa fa-plus"></i> Add
                    </Button>
                    <Button
                      style={{ borderRadius: "0" }}
                      color="danger"
                      className="mx-4"
                      outline
                      onClick={save}
                    >
                      <i className="fa fa-save"></i> Save
                    </Button>
                  </Col>
                </Row>
                {/* ADDED TIME CLOCK LIST */}
                <Row className="my-4 mx-4">
                  <Col sm="12" className="mt-4">
                    {Clock.length > 0 &&
                      Clock.map((ga, i) => (
                        <Row className="mt-4" key={i}>
                          <Col sm="2">
                            <p style={{ marginBottom: "0" }}>{ga.S_NAME}</p>
                            <span
                              className="text-secondary"
                              style={{ fontSize: "0.8rem" }}
                            >
                              {ga.S_AGENCY}
                            </span>
                          </Col>
                          <Col>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText
                                  style={{
                                    borderRadius: "0",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  IN
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="time"
                                defaultValue={ga.START}
                                style={{
                                  borderRadius: "0",
                                  fontSize: "0.9rem",
                                }}
                                onChange={(e) =>
                                  (Clock[i].START = e.target.value)
                                }
                              />
                            </InputGroup>
                          </Col>

                          <Col>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText
                                  style={{
                                    borderRadius: "0",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  OUT
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="time"
                                defaultValue={ga.END}
                                style={{
                                  borderRadius: "0",
                                  fontSize: "0.9rem",
                                }}
                                onChange={(e) =>
                                  (Clock[i].END = e.target.value)
                                }
                              />
                            </InputGroup>
                          </Col>

                          <Col>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText
                                  style={{
                                    borderRadius: "0",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  L IN
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="time"
                                defaultValue={ga.LSTART}
                                style={{
                                  borderRadius: "0",
                                  fontSize: "0.9rem",
                                }}
                                onChange={(e) =>
                                  (Clock[i].LSTART = e.target.value)
                                }
                              />
                            </InputGroup>
                          </Col>
                          <Col>
                            <InputGroup>
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText
                                  style={{
                                    borderRadius: "0",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  L OUT
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="time"
                                defaultValue={ga.LEND}
                                style={{
                                  borderRadius: "0",
                                  fontSize: "0.9rem",
                                }}
                                onChange={(e) =>
                                  (Clock[i].LEND = e.target.value)
                                }
                              />
                            </InputGroup>
                          </Col>
                        </Row>
                      ))}
                  </Col>
                </Row>
              </Card>
            </Col>
            {/* MAIN CALENDAR */}
            <Col className="col-auto mt-4">
              <Calendar
                onChange={onChange}
                value={value}
                onClickDay={(e) => getWork(e)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              {Works ? (
                <ToolkitProvider
                  data={Works}
                  columns={[
                    {
                      dataField: "STAFFING_NAME",
                      text: "NAME",
                      headerStyle: { fontFamily: "NEXON Lv2 Gothic" },
                      headerAlign: "center",
                    },
                    {
                      dataField: "STAFFING_AGENCY",
                      text: "AGENCY",
                      headerStyle: { fontFamily: "NEXON Lv2 Gothic" },
                      headerAlign: "center",
                    },
                    {
                      dataField: "WORK_DATE",
                      text: "DATE",
                      headerStyle: { fontFamily: "NEXON Lv2 Gothic" },
                      headerAlign: "center",
                      formatter: (cell) => moment.utc(cell).format("LL"),
                      csvFormatter: (cell) => moment.utc(cell).format("LL"),
                    },
                    {
                      dataField: "WORK_START",
                      text: "START",
                      headerAlign: "center",
                      headerStyle: {
                        width: "6%",
                        fontFamily: "NEXON Lv2 Gothic",
                      },
                      formatter: (cell) => moment.utc(cell).format("LT"),
                      csvFormatter: (cell) => moment.utc(cell).format("LT"),
                    },
                    {
                      dataField: "WORK_END",
                      text: "END",
                      headerAlign: "center",
                      headerStyle: {
                        width: "7%",
                        fontFamily: "NEXON Lv2 Gothic",
                      },
                      formatter: (cell) => moment.utc(cell).format("LT"),
                      csvFormatter: (cell) => moment.utc(cell).format("LT"),
                    },
                    {
                      dataField: "WORK_LUNCH_START",
                      text: "LUNCH START",
                      headerAlign: "center",
                      headerStyle: {
                        width: "7%",
                        fontFamily: "NEXON Lv2 Gothic",
                        fontSize: "11px",
                        paddingBottom: "1rem",
                      },
                      formatter: (cell) => moment.utc(cell).format("LT"),
                      csvFormatter: (cell) => moment.utc(cell).format("LT"),
                    },
                    {
                      dataField: "WORK_LUNCH_END",
                      text: "LUNCH END",
                      headerAlign: "center",
                      headerStyle: {
                        width: "6%",
                        fontFamily: "NEXON Lv2 Gothic",
                        fontSize: "11px",
                        paddingBottom: "1rem",
                      },
                      formatter: (cell) => moment.utc(cell).format("LT"),
                      csvFormatter: (cell) => moment.utc(cell).format("LT"),
                    },
                    {
                      dataField: "WORK_TOTAL_MINUTE",
                      headerAlign: "center",
                      text: "TIME",
                      headerStyle: {
                        width: "6%",
                        fontFamily: "NEXON Lv2 Gothic",
                      },
                      formatter: (cell) =>
                        `${Math.floor(cell / 60)}H ${cell % 60}M`,
                    },
                  ]}
                  keyField="WORKLOG_ID"
                  exportCSV={{ fileName: "STAFF_LOG.csv" }}
                >
                  {(props) => (
                    <div>
                      <MyExportCSV {...props.csvProps}>Export</MyExportCSV>
                      <BootstrapTable {...props.baseProps} />
                    </div>
                  )}
                </ToolkitProvider>
              ) : (
                <h4 className="text-danger text-center">
                  No Data on {moment(value).format("LL")}
                </h4>
              )}
            </Col>
          </Row>
          {/* {value && JSON.stringify(value)} */}
          {/* {JSON.stringify(Clock)} */}

          <Modal isOpen={modal} toggle={toggle} size="lg">
            <ModalHeader toggle={toggle} className="pl-4">
              ADD STAFF
            </ModalHeader>
            <ModalBody className="pt-4 px-4">
              <InputGroup className="mb-2">
                <Input
                  placeholder="STAFF NAME"
                  onChange={(e) => setStaffName(e.target.value)}
                />
              </InputGroup>
            </ModalBody>
            <ModalBody className="px-4">
              <InputGroup className="mb-2">
                <select
                  onChange={(e) => setStaffAgency(e.target.value)}
                  className="form-control"
                >
                  <option value={false}>Select Agency</option>
                  <option>Consolidated Staffing Solution</option>
                  <option>InstaWork</option>
                  <option>Pro Logistix</option>
                  <option>James Worldwide Staff</option>
                </select>
              </InputGroup>
            </ModalBody>
            <Button className="mx-4 my-4" color="success" onClick={addStaff}>
              SUBMIT
            </Button>
          </Modal>

          <Modal isOpen={modal2} toggle={toggle2} size="lg">
            <ModalHeader toggle={toggle2} className="pl-4">
              SELECT STAFF TO ADD
            </ModalHeader>
            <ModalBody className="pt-4 px-4">
              <BootstrapTable
                data={StaffData}
                bordered={false}
                columns={[
                  {
                    dataField: "S_NAME",
                    text: "NAME",
                    headerStyle: { fontFamily: "NEXON Lv2 Gothic" },
                  },
                  { dataField: "S_AGENCY", text: "AGENCY" },
                ]}
                selectRow={{
                  mode: "checkbox",
                  clickToSelect: true,
                  headerColumnStyle: {
                    width: "39px",
                    textAlign: "center",
                    headerStyle: { fontFamily: "NEXON Lv2 Gothic" },
                  },
                  onSelectAll: handleOnSelectAll,
                  onSelect: handleOnSelect,
                }}
                keyField="S_ID"
              />
            </ModalBody>
          </Modal>
          <style jsx>
            {`
              @font-face {
                font-family: "NEXON Lv2 Gothic";
                src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                  format("woff");
                font-weight: normal;
                font-style: normal;
              }
              h1,
              h2,
              h3,
              h4,
              h5,
              p,
              span {
                font-family: "NEXON Lv2 Gothic";
              }
            `}
          </style>
        </Layout>
      </>
    );
  } else {
    return <p>Redirecting...</p>;
  }
}

export async function getServerSideProps({req}) {
    const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)

    const Fetch = await fetch(`${process.env.BASE_URL}api/warehouse/getStaff`)
    const Data = await Fetch.json()

    const Fetch1 = await fetch(`${process.env.BASE_URL}api/warehouse/getWork`)
    var Data1;
    if(Fetch1.status==200) {
        Data1 = await Fetch1.json()
    } else {
        Data1 = false
    }

    console.log(jwt.decode(cookies.jamesworldwidetoken).username+' loaded warehouse/staff')
    // Pass data to the page via props
    return { props: { Cookie: cookies, Staff: Data, Work: Data1 } };
  }

export default Index;

