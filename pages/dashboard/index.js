import Layout from "../../components/Layout";
import cookie from "cookie";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import fetch from "node-fetch";
import moment from "moment";
import { Button, ButtonGroup, Dialog } from "@blueprintjs/core";
import { ContextMenu2 } from "@blueprintjs/popover2";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import React, { useState, useEffect } from "react";
import MasterMenu from "../../components/Dashboard/MasterMenu";
import MasterDialog from "../../components/Dashboard/MasterDialog";

export default function dashboard({ Cookie, Board }) {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [OimList, setOimList] = useState([]);
  const [OomList, setOomList] = useState([]);
  const [AimList, setAimList] = useState([]);
  const [AomList, setAomList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [MultiSelected, setMultipleSelected] = useState(false);
  const [containers, setContainers] = useState(false);
  const [comments, setComments] = useState(false);
  const [files, setFiles] = useState(false);

  useEffect(() => {
    !TOKEN && router.push("/login");
    getOIM();
    getOOM();
    getAIM();
    getAOM();
    if (typeof window !== "undefined") {
      localStorage.setItem("notification", JSON.stringify(OimList));
      localStorage.setItem("board", JSON.stringify(Board));
    }
  }, []);

  async function getOIM() {
    const oims = await fetch("/api/dashboard/oim", {
      headers: {
        key: Cookie.jamesworldwidetoken,
      },
    }).then(async (j) => await j.json());
    // console.log(oims);
    setOimList(oims);
  }
  async function getOOM() {
    const ooms = await fetch("/api/dashboard/oom", {
      headers: {
        key: Cookie.jamesworldwidetoken,
      },
    }).then(async (j) => await j.json());
    // console.log(ooms);
    setOomList(ooms);
  }
  async function getAIM() {
    const aims = await fetch("/api/dashboard/aim", {
      headers: {
        key: Cookie.jamesworldwidetoken,
      },
    }).then(async (j) => await j.json());
    // console.log(aims);
    setAimList(aims);
  }
  async function getAOM() {
    const aoms = await fetch("/api/dashboard/aom", {
      headers: {
        key: Cookie.jamesworldwidetoken,
      },
    }).then(async (j) => await j.json());
    // console.log(aoms);
    setAomList(aoms);
  }

  async function getContainer(id, tbname, field) {
    const container = await fetch("/api/dashboard/container", {
      headers: {
        key: Cookie.jamesworldwidetoken,
        id: id,
        table: tbname,
        col: field,
      },
    }).then(async (j) => await j.json());
    setContainers(container);
  }

  if (TOKEN != null) {
    return (
      <Layout TOKEN={TOKEN} TITLE="Dashboard">
        <div className="d-sm-flex align-items-center justify-content-between mb-4 w-100">
          <h3 className="h3 mb-0 font-weight-light">Dashboard</h3>
        </div>
        <Dialog
          isOpen={isOpen}
          title={selected.F_RefNo}
          onClose={() => setIsOpen(false)}
          className="bg-white w-75"
          // When user click on the button, width 50 to 100 and height 50 to 100
        >
          <MasterDialog
            refs={selected}
            multi={MultiSelected}
            container={containers}
            token={TOKEN}
          />
        </Dialog>

        <div className="row">
          {/*  ------------------- OIM ------------------------  */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body px-2">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-2">
                      ocean import
                    </div>
                    <ListGroup>
                      {OimList && OimList.length ? (
                        OimList.map((ga) => {
                          if (ga.HouseCount == 1) {
                            return (
                              <ContextMenu2
                                content={<MasterMenu data={ga} type="oim" />}
                                className="px-2 ml-1 py-1 my-0"
                                key={ga.F_ID[0]}
                              >
                                <ListGroupItem
                                  action
                                  className="d-flex justify-content-between align-items-center text-xs btn btn-link reference"
                                  onClick={() => {
                                    var AllOim = OimList.filter(
                                      (element) =>
                                        element.F_ID[0] === ga.F_ID[0]
                                    );
                                    setMultipleSelected(AllOim);
                                    setComments([]);
                                    setFiles([]);
                                    setSelected({
                                      ...ga,
                                      Master: "T_OIMMAIN",
                                      House: "T_OIHMAIN",
                                      temp: "oim",
                                    });
                                    setIsOpen(1);
                                    getContainer(
                                      ga.F_ID[0],
                                      "T_OIMCONTAINER",
                                      "F_OIMBLID"
                                    );
                                  }}
                                >
                                  <span className="font-weight-bold">
                                    {ga.F_RefNo}
                                  </span>
                                  <span
                                    className="text-gray-800"
                                    style={{
                                      maxWidth: "100px",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {ga.Customer || "NO CUSTOMER"}
                                  </span>
                                  <span
                                    className={`font-weight-bold ${
                                      moment()
                                        .startOf("day")
                                        .diff(moment(ga.F_ETA).utc(), "days") <
                                      0
                                        ? "text-danger"
                                        : "text-primary"
                                    }`}
                                  >
                                    {moment()
                                      .startOf("day")
                                      .diff(moment(ga.F_ETA).utc(), "days")}
                                  </span>
                                  {/* <span>
                                    <ButtonGroup minimal={true}>
                                      <Popover2
                                        content={
                                          <MasterMenu data={ga} type="oim" />
                                        }
                                      >
                                        <Button icon="more"></Button>
                                      </Popover2>
                                    </ButtonGroup>
                                  </span> */}
                                </ListGroupItem>
                              </ContextMenu2>
                            );
                          }
                        })
                      ) : (
                        <div className="mt-2 text-danger text-xs">
                          No Result
                        </div>
                      )}
                    </ListGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  ------------------- OEX ------------------------  */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body px-2">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-2">
                      ocean export
                    </div>
                    <ListGroup>
                      {OomList && OomList.length ? (
                        OomList.map((ga) => {
                          if (ga.HouseCount == 1) {
                            return (
                              <ContextMenu2
                                content={<MasterMenu data={ga} type="oex" />}
                                className="px-2 ml-1 py-1 my-0"
                                key={"OOM" + ga.F_ID[0]}
                              >
                                <ListGroupItem
                                  href="#"
                                  action
                                  className="d-flex justify-content-between align-items-center text-xs btn btn-link reference"
                                  onClick={() => {
                                    var AllOom = OomList.filter(
                                      (element) =>
                                        element.F_ID[0] === ga.F_ID[0]
                                    );
                                    setMultipleSelected(AllOom);
                                    setComments([]);
                                    setFiles([]);
                                    setSelected({
                                      ...ga,
                                      Master: "T_OOMMAIN",
                                      House: "T_OOHMAIN",
                                      temp: "oex",
                                    });
                                    setIsOpen(1);
                                    getContainer(
                                      ga.F_ID[0],
                                      "T_OOMCONTAINER",
                                      "F_OOMBLID"
                                    );
                                  }}
                                >
                                  <span className="font-weight-bold">
                                    {ga.F_RefNo}
                                  </span>
                                  <span
                                    className="text-gray-800"
                                    style={{
                                      maxWidth: "100px",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {ga.Customer || "NO CUSTOMER"}
                                  </span>
                                  <span
                                    className={`font-weight-bold ${
                                      moment()
                                        .startOf("day")
                                        .diff(moment(ga.F_ETA).utc(), "days") <
                                      0
                                        ? "text-danger"
                                        : "text-primary"
                                    }`}
                                  >
                                    {moment()
                                      .startOf("day")
                                      .diff(moment(ga.F_ETA).utc(), "days")}
                                  </span>
                                  {/* <span>
                                  <ButtonGroup minimal={true}>
                                    <Popover2
                                      content={
                                        <MasterMenu data={ga} type="oex" />
                                      }
                                    >
                                      <Button icon="more"></Button>
                                    </Popover2>
                                  </ButtonGroup>
                                </span> */}
                                </ListGroupItem>
                              </ContextMenu2>
                            );
                          }
                        })
                      ) : (
                        <div className="mt-2 text-danger text-xs">
                          No Result
                        </div>
                      )}
                    </ListGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  ------------------- AIM ------------------------  */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body px-2">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-2">
                      air import
                    </div>
                    <ListGroup>
                      {AimList && AimList.length ? (
                        AimList.map((ga) => {
                          if (ga.HouseCount == 1) {
                            return (
                              <ContextMenu2
                                content={<MasterMenu data={ga} type="aim" />}
                                className="px-2 ml-1 py-1 my-0"
                                key={"AIM" + ga.F_ID[0]}
                              >
                                <ListGroupItem
                                  href="#"
                                  action
                                  className="d-flex justify-content-between align-items-center text-xs btn btn-link reference"
                                  onClick={() => {
                                    var AllAim = AimList.filter(
                                      (element) =>
                                        element.F_ID[0] === ga.F_ID[0]
                                    );
                                    setMultipleSelected(AllAim);
                                    setComments([]);
                                    setFiles([]);
                                    setSelected({
                                      ...ga,
                                      Master: "T_AIMMAIN",
                                      House: "T_AIHMAIN",
                                      temp: "aim",
                                    });
                                    setIsOpen(1);
                                    setContainers([]);
                                  }}
                                >
                                  <span className="font-weight-bold">
                                    {ga.F_RefNo}
                                  </span>
                                  <span
                                    className="text-gray-800"
                                    style={{
                                      maxWidth: "100px",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {ga.Customer || "NO CUSTOMER"}
                                  </span>
                                  <span
                                    className={`font-weight-bold ${
                                      moment()
                                        .startOf("day")
                                        .diff(moment(ga.F_ETA).utc(), "days") <
                                      0
                                        ? "text-danger"
                                        : "text-primary"
                                    }`}
                                  >
                                    {moment()
                                      .startOf("day")
                                      .diff(moment(ga.F_ETA).utc(), "days")}
                                  </span>
                                  {/* <span>
                                  <ButtonGroup minimal={true}>
                                    <Popover2
                                      content={
                                        <MasterMenu data={ga} type="aim" />
                                      }
                                    >
                                      <Button icon="more"></Button>
                                    </Popover2>
                                  </ButtonGroup>
                                </span> */}
                                </ListGroupItem>
                              </ContextMenu2>
                            );
                          }
                        })
                      ) : (
                        <div className="mt-2 text-danger text-xs">
                          No Result
                        </div>
                      )}
                    </ListGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*  ------------------- AOM ------------------------  */}
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-warning shadow h-100 py-2">
              <div className="card-body px-2">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-2">
                      air export
                    </div>
                    <ListGroup>
                      {AomList && AomList.length ? (
                        AomList.map((ga) => {
                          if (ga.HouseCount == 1) {
                            return (
                              <ContextMenu2
                                content={<MasterMenu data={ga} type="aex" />}
                                className="px-2 ml-1 py-1 my-0"
                                key={"AOM" + ga.F_ID[0]}
                              >
                                <ListGroupItem
                                  href="#"
                                  action
                                  className="d-flex justify-content-between align-items-center text-xs btn btn-link"
                                  onClick={() => {
                                    var AllAom = AomList.filter(
                                      (element) =>
                                        element.F_ID[0] === ga.F_ID[0]
                                    );
                                    setMultipleSelected(AllAom);
                                    setComments([]);
                                    setFiles([]);
                                    setSelected({
                                      ...ga,
                                      Master: "T_AOMMAIN",
                                      House: "T_AOHMAIN",
                                      temp: "aex",
                                    });
                                    setIsOpen(1);
                                    setContainers([]);
                                  }}
                                >
                                  <span className="font-weight-bold reference">
                                    {ga.F_RefNo}
                                  </span>
                                  <span
                                    className="text-gray-800"
                                    style={{
                                      maxWidth: "100px",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {ga.Customer || "NO CUSTOMER"}
                                  </span>
                                  <span
                                    className={`font-weight-bold ${
                                      moment()
                                        .startOf("day")
                                        .diff(moment(ga.F_ETA).utc(), "days") <
                                      0
                                        ? "text-danger"
                                        : "text-primary"
                                    }`}
                                  >
                                    {moment()
                                      .startOf("day")
                                      .diff(moment(ga.F_ETA).utc(), "days")}
                                  </span>
                                  {/* <span>
                                  <ButtonGroup minimal={true}>
                                    <Popover2
                                      content={
                                        <MasterMenu data={ga} type="aex" />
                                      }
                                    >
                                      <Button icon="more"></Button>
                                    </Popover2>
                                  </ButtonGroup>
                                </span> */}
                                </ListGroupItem>
                              </ContextMenu2>
                            );
                          }
                        })
                      ) : (
                        <div className="mt-2 text-danger text-xs">
                          No Result
                        </div>
                      )}
                    </ListGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explain Row */}
        <div className="row">
          <div className="col-lg-3 mb-4">
            <div className="card bg-primary text-white shadow">
              <div className="card-body d-flex justify-content-between">
                <div>
                  Ocean Import
                  <div className="text-white-50 small">
                    Total of {OimList && OimList.length}
                    <br />
                    based on ETA from 2 weeks
                  </div>
                </div>
                <a href="#" onClick={() => router.push("/forwarding/oim")}>
                  <div className="d-flex align-items-center">
                    <span className="fa-stack fa-2x">
                      <i className="fa fa-circle fa-stack-2x text-gray-100"></i>
                      <i className="fa fa-anchor fa-stack-1x text-primary"></i>
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card bg-success text-white shadow">
              <div className="card-body d-flex justify-content-between">
                <div>
                  Ocean Export
                  <div className="text-white-50 small">
                    Total of {OomList && OomList.length}
                    <br />
                    based on ETD from 2 weeks
                  </div>
                </div>
                <a href="#" onClick={() => router.push("/forwarding/oex")}>
                  <div className="d-flex align-items-center">
                    <span className="fa-stack fa-2x">
                      <i className="fa fa-circle fa-stack-2x text-gray-100"></i>
                      <i className="fa fa-anchor fa-flip-vertical fa-stack-1x text-success"></i>
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card bg-info text-white shadow">
              <div className="card-body d-flex justify-content-between">
                <div>
                  Air Import
                  <div className="text-white-50 small">
                    Total of {AimList && AimList.length}
                    <br />
                    based on ETA from 2 weeks
                  </div>
                </div>
                <a href="#" onClick={() => router.push("/forwarding/aim")}>
                  <div className="d-flex align-items-center">
                    <span className="fa-stack fa-2x">
                      <i className="fa fa-circle fa-stack-2x text-gray-100"></i>
                      <i className="fa fa-plane fa-stack-1x text-info"></i>
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-3 mb-4">
            <div className="card bg-warning text-white shadow">
              <div className="card-body d-flex justify-content-between">
                <div>
                  Air Export
                  <div className="text-white-50 small">
                    Total of {AomList && AomList.length}
                    <br />
                    based on ETD from 2 weeks
                  </div>
                </div>
                <a href="#" onClick={() => router.push("/forwarding/aex")}>
                  <div className="d-flex align-items-center">
                    <span className="fa-stack fa-2x">
                      <i className="fa fa-circle fa-stack-2x text-gray-100"></i>
                      <i className="fa fa-plane fa-flip-vertical fa-stack-1x text-warning"></i>
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* <p>
          <b>Authentication</b>
        </p>
        <p>
          Admin View - Most Recent 100 Cases based on arrival time later than a
          month ago
        </p>
        <p>
          Operator View - Most Recent 100 Cases with either you created or
          modified based on arrival time later than a month ago
        </p>

        <p>
          <b>Added Feature</b>
        </p>
        <p>Right Click on the reference to see the menu</p>
        <p>Click on the reference to see the detail panel</p> */}
        <style jsx>
          {`
            .reference::before {
              transform: scaleX(0);
              transform-origin: bottom right;
            }

            .reference:hover::before {
              transform: scaleX(1);
              transform-origin: bottom left;
            }
            .reference::before {
              content: " ";
              display: block;
              position: absolute;
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              inset: 0 0 0 0;
              background: hsl(200 100% 80%);
              z-index: -1;
              transition: transform 0.3s ease;
            }
             {
              /* .reference:hover {
              opacity: 0.1;
              background-color: "blue";
            } */
            }
          `}
        </style>
      </Layout>
    );
  } else {
    return <p>Redirecting...</p>;
  }
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || "");
  if (jwt.decode(cookies.jamesworldwidetoken) !== null) {
    const { fsid } = jwt.decode(cookies.jamesworldwidetoken);

    // Pass data to the page via props
    // const from = moment().subtract(30, "days").calendar();

    // var dataOim = [];
    // var dataOom = [];
    // var dataAim = [];
    // var dataAom = [];
    // const resOim = await fetch(
    //   `${process.env.FS_BASEPATH}oimmain?PIC=${fsid}&etaFrom=${from}&etaTo=&etdFrom=&etdTo=&casestatus=open`,
    //   {
    //     headers: { "x-api-key": process.env.JWT_KEY },
    //   }
    // );
    // if (resOim.status == 200) {
    //   dataOim = await resOim.json();
    //   if (dataOim.length) {
    //     dataOim.map(async (ga, i) => {
    //       const resOih = await fetch(
    //         `${process.env.FS_BASEPATH}oihmain?oimblid=${ga.ID}`,
    //         {
    //           headers: { "x-api-key": process.env.JWT_KEY },
    //         }
    //       );
    //       if (resOih.status == 200) {
    //         var OIH = await resOih.json();
    //         dataOim[i].Customer = OIH[0].Customer_SName;
    //       } else {
    //         dataOim[i].Customer = "NO CUSTOMER";
    //       }
    //     });
    //   }
    // }

    // const resOom = await fetch(
    //   `${process.env.FS_BASEPATH}oommain?PIC=${fsid}&etaFrom=&etaTo=&etdFrom=${from}&etdTo=&casestatus=open`,
    //   {
    //     headers: { "x-api-key": process.env.JWT_KEY },
    //   }
    // );

    // if (resOom.status == 200) {
    //   dataOom = await resOom.json();
    //   if (dataOom.length) {
    //     dataOom.map(async (ga, i) => {
    //       const resOoh = await fetch(
    //         `${process.env.FS_BASEPATH}oohmain?oomblid=${ga.ID}`,
    //         {
    //           headers: { "x-api-key": process.env.JWT_KEY },
    //         }
    //       );
    //       if (resOoh.status == 200) {
    //         var OOH = await resOoh.json();
    //         dataOom[i].Customer = OOH[0].Customer_SName;
    //       } else {
    //         dataOom[i].Customer = "NO CUSTOMER";
    //       }
    //     });
    //   }
    // }

    // const resAim = await fetch(
    //   `${process.env.FS_BASEPATH}aimmain?PIC=${fsid}&etaFrom=${from}&etaTo=&etdFrom=&etdTo=&casestatus=open`,
    //   {
    //     headers: { "x-api-key": process.env.JWT_KEY },
    //   }
    // );

    // if (resAim.status == 200) {
    //   dataAim = await resAim.json();
    //   if (dataAim.length) {
    //     dataAim.map(async (ga, i) => {
    //       const resAih = await fetch(
    //         `${process.env.FS_BASEPATH}aihmain?aimblid=${ga.ID}`,
    //         {
    //           headers: { "x-api-key": process.env.JWT_KEY },
    //         }
    //       );
    //       if (resAih.status == 200) {
    //         var AIH = await resAih.json();
    //         dataAim[i].Customer = AIH[0].Customer_SName;
    //       } else {
    //         dataAim[i].Customer = "NO CUSTOMER";
    //       }
    //     });
    //   }
    // }

    // const resAom = await fetch(
    //   `${process.env.FS_BASEPATH}aommain?PIC=${fsid}&etaFrom=&etaTo=&etdFrom=${from}&etdTo=&casestatus=open`,
    //   {
    //     headers: { "x-api-key": process.env.JWT_KEY },
    //   }
    // );

    // if (resAom.status == 200) {
    //   dataAom = await resAom.json();
    //   if (dataAom.length) {
    //     dataAom.map(async (ga, i) => {
    //       const resAoh = await fetch(
    //         `${process.env.FS_BASEPATH}aohmain?aomblid=${ga.ID}`,
    //         {
    //           headers: { "x-api-key": process.env.JWT_KEY },
    //         }
    //       );
    //       if (resAoh.status == 200) {
    //         var AOH = await resAoh.json();
    //         dataAom[i].Customer = AOH[0].Customer_SName;
    //       } else {
    //         dataAom[i].Customer = "NO CUSTOMER";
    //       }
    //     });
    //   }
    // }

    // const resBoard = await fetch(
    //   `${process.env.BASE_URL}api/board/getPostFive`
    // );
    // const dataBoard = await resBoard.json();
  }
  return {
    props: {
      Cookie: cookies,
    },
  };
}
