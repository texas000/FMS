import {
  Menu,
  MenuItem,
  Dialog,
  Tag,
  Button,
  Classes,
  Collapse,
  Pre,
  Card,
  FileInput,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useRouter } from "next/router";
import moment from "moment";
import { useEffect, useState } from "react";
// import "quill/dist/quill.snow.css";
import CommentList from "./CommentList";
import axios, { post } from "axios";
import { BlobProvider } from "@react-pdf/renderer";
import CheckRequestForm from "./CheckRequestForm";

export const MasterDialog = ({ refs, multi, container, token }) => {
  const router = useRouter();
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;
  const [selectedHouse, setSelectedHouse] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(false);
  const [selectedAP, setSelectedAP] = useState(false);
  const [selectedCrdr, setSelectedCrdr] = useState(false);
  const [html, setHtml] = useState("");
  // const [comments, setComment] = useState(false);
  const [profit, setProfit] = useState([]);
  const [ap, setAp] = useState([]);
  const [invoice, setInvoice] = useState([]);
  const [crdr, setCrdr] = useState([]);
  const [file, setFiles] = useState([]);
  const [comment, setComment] = useState([]);

  useEffect(() => {
    // console.log(refs);
    getProfit().then(() => {
      getAp().then(() => {
        getInvoice().then(() => {
          getCrdr().then(() => {
            getFiles().then(() => {
              getComment();
            });
          });
        });
      });
    });
  }, []);
  async function getProfit() {
    multi &&
      multi.map(async (ga) => {
        const profits = await fetch("/api/dashboard/profit", {
          headers: {
            id: ga.F_ID[1],
            table: refs.House,
            key: token.admin,
          },
        });
        if (profits.status === 200) {
          var fetchedProfit = await profits.json();
          setProfit((prev) => [...prev, fetchedProfit]);
        } else {
          console.log(`PROFIT - ${profits.status}`);
        }
      });
  }

  async function getAp() {
    const aps = await fetch("/api/dashboard/ap", {
      headers: {
        key: token.admin,
        id: refs.F_ID[1],
        table: refs.House,
      },
    }).then(async (j) => await j.json());
    // console.log(aps);
    setAp(aps);
  }

  async function getInvoice() {
    const invoices = await fetch("/api/dashboard/invoice", {
      headers: {
        key: token.admin,
        id: refs.F_ID[1],
        table: refs.House,
      },
    }).then(async (j) => await j.json());
    // console.log(invoices);
    setInvoice(invoices);
  }

  async function getCrdr() {
    const crdrs = await fetch("/api/dashboard/crdr", {
      headers: {
        key: token.admin,
        id: refs.F_ID[1],
        table: refs.House,
      },
    }).then(async (j) => await j.json());
    setCrdr(crdrs);
  }

  async function getFiles() {
    const file = await fetch("/api/dashboard/getFileList", {
      method: "GET",
      headers: {
        ref: refs.F_RefNo,
      },
    });
    if (file.status === 200) {
      const list = await file.json();
      setFiles(list);
    }
  }

  async function getComment(ref) {
    const comment = await fetch("/api/dashboard/comment", {
      headers: {
        ref: refs.F_RefNo,
      },
    }).then(async (j) => await j.json());
    setComment(comment);
  }

  async function uploadFile(e) {
    var uploadfile = document.getElementById("upload").files[0];
    // console.log(uploadfile);
    if (uploadfile) {
      const formData = new FormData();
      formData.append("userPhoto", uploadfile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          reference: refs.F_RefNo,
        },
      };
      try {
        const upload = new Promise((res, rej) => {
          try {
            res(post(`/api/dashboard/uploadFile`, formData, config));
          } catch (err) {
            console.log(err);
            res("uploaded");
          }
        });
        upload.then((ga) => {
          if (ga.status === 200) {
            alert("UPLOAD SUCCESS");
          }
        });
      } catch (err) {
        if (err.response) {
          console.log(err.response);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log(err);
        }
      }
    }
  }

  async function uploadComment(ref) {
    const data = {
      RefNo: ref.F_RefNo,
      Content: html,
      UID: token.uid,
      Link: "",
    };
    // F_RefNo, F_Content, F_UID, F_Date, F_Show, F_Link;
    const fetchPostComment = await fetch("/api/dashboard/postComment", {
      body: JSON.stringify(data),
      method: "POST",
    });

    if (fetchPostComment.status === 200) {
      const newMsg = await fetchPostComment.json();
      setComment([...comment, newMsg[0]]);
      setHtml("");
    } else {
      alert(`Error ${fetchPostComment.status}`);
    }
  }

  const RequestForm = ({ ap, aptype }) => (
    <BlobProvider
      document={
        <CheckRequestForm
          check={ap.F_CheckNo}
          type={aptype}
          payto={ap.F_SName}
          address={`${ap.F_Addr} ${ap.F_City} ${ap.F_State} ${ap.F_ZipCode}`}
          irs={`${ap.F_IRSType} ${ap.F_IRSNo}`}
          amt={Number.parseFloat(ap.F_InvoiceAmt).toFixed(2)}
          oim={refs.F_RefNo}
          customer={refs.Customer}
          inv={ap.F_InvoiceNo}
          metd={moment(refs.F_ETD).utc().format("MM/DD/YY")}
          meta={moment(refs.F_ETA).utc().format("MM/DD/YY")}
          pic={ap.F_U1ID || ""}
          today={moment().format("l")}
          desc={ap.F_Descript}
          pod={refs.F_DisCharge || refs.F_Discharge}
          comm={refs.F_mCommodity || refs.F_Commodity}
          shipper={refs.Shipper}
          consignee={refs.Consignee}
        />
      }
    >
      {({ blob, url, loading, error }) => (
        <Button
          onClick={() => window.open(url)}
          icon="dollar"
          intent="success"
          loading={loading}
          text={aptype}
          className="mb-2"
        ></Button>
      )}
    </BlobProvider>
  );

  return (
    <div className={Classes.DIALOG_BODY}>
      <div className="row">
        {/* ------------------ LEFT PANEL ------------------ */}
        <div
          className="col-9"
          style={{
            overflowY: "scroll",
            scrollbarWidth: "thin",
            maxHeight: "500px",
          }}
        >
          <p className="font-weight-bold">
            {refs.F_CustRefNo && `Customer Reference: ${refs.F_CustRefNo}`}
          </p>

          <h4>{refs.Customer}</h4>
          <div className="tag-collection">
            <Tag
              intent={refs.F_SHIPMENTID === "" ? "none" : "primary"}
              round={true}
            >
              ISF FILE
            </Tag>
            <Tag
              intent={refs.F_AMSBLNO && "primary"}
              round={true}
              className="mx-1"
            >
              AMS FILE
            </Tag>
            {/* OIM ONLY */}
            {refs.hasOwnProperty("F_ITNo") && typeof refs.F_ITNo === "object" && (
              <Tag
                intent={refs.F_ITNo[0] || refs.F_ITNo[1] ? "primary" : "none"}
                round={true}
                className="mx-1"
              >
                IT FILE
              </Tag>
            )}
            {/* AIM ONLY */}
            {refs.hasOwnProperty("F_ITNo") && typeof refs.F_ITNo === "string" && (
              <Tag
                intent={refs.F_ITNo ? "primary" : "none"}
                round={true}
                className="mx-1"
              >
                IT FILE
              </Tag>
            )}

            {/* OEX ONLY */}
            {refs.hasOwnProperty("F_MXTNNo") && (
              <Tag
                intent={refs.F_MXTNNo ? "primary" : "none"}
                round={true}
                className="mx-1"
              >
                XTN FILE
              </Tag>
            )}
            {/* OEX ONLY */}
            {refs.hasOwnProperty("F_BookingNo") && (
              <Tag
                intent={refs.F_BookingNo ? "primary" : "none"}
                round={true}
                className="mx-1"
              >
                BOOKING
              </Tag>
            )}

            {refs.F_MoveType && (
              <Tag intent="primary" round={true} className="mx-1">
                {refs.F_MoveType && refs.F_MoveType[0]}
              </Tag>
            )}

            {refs.hasOwnProperty("F_LCLFCL") &&
              typeof refs.F_ITNo === "string" && (
                <Tag intent="primary" round={true} className="mx-1">
                  {refs.F_ITNo}
                </Tag>
              )}
          </div>

          {/* <div>{refs.F_CName}</div> */}
          <hr className="my-1" />
          <div className="container-list">
            {container &&
              container.map((ga, i) => {
                return (
                  <Tag
                    intent="success"
                    round={true}
                    key={i}
                    className="my-1 mr-1"
                  >
                    {ga.F_ContainerNo}
                  </Tag>
                );
              })}
          </div>
          <hr className="my-1" />
          <div className="row">
            {multi &&
              multi.map((ga, i) => {
                return (
                  <div key={ga.F_ID[1]} className="col-12">
                    <Button
                      onClick={() => {
                        if (selectedHouse === i) {
                          setSelectedHouse(false);
                        } else {
                          setSelectedHouse(i);
                        }
                      }}
                      small={true}
                      fill={true}
                    >
                      {i + 1}: {ga.F_HBLNo || ga.F_MawbNo}
                    </Button>
                    <Collapse isOpen={selectedHouse === i}>
                      {/* <Pre>{JSON.stringify(ga)}</Pre> */}
                      <Pre>
                        {profit[i] && profit[i][0] && (
                          <span>
                            <span>
                              AR:{" "}
                              <Tag intent="success">
                                ${(profit[i][0].F_AR || 0).toFixed(2)}
                              </Tag>{" "}
                            </span>
                            <span>
                              AP:{" "}
                              <Tag intent="danger">
                                ${(profit[i][0].F_AP || 0).toFixed(2)}{" "}
                              </Tag>{" "}
                            </span>
                            <span>
                              CRDR:{" "}
                              <Tag intent="success">
                                ${(profit[i][0].F_CrDr || 0).toFixed(2)}
                              </Tag>
                            </span>{" "}
                            <span>
                              TOTAL:{" "}
                              <Tag intent="primary">
                                ${(profit[i][0].F_HouseTotal || 0).toFixed(2)}
                              </Tag>
                            </span>
                          </span>
                        )}
                      </Pre>
                    </Collapse>
                  </div>
                );
              })}
          </div>
          <hr className="my-1" />
          {/* AP REQUEST APPROVAL */}
          {ap &&
            ap.map((ga, i) => {
              return (
                <div key={i} className="mr-2">
                  <Button
                    text={`AP: ${ga.F_Descript}`}
                    small={true}
                    onClick={() => {
                      if (selectedAP === i) {
                        setSelectedAP(false);
                      } else {
                        setSelectedAP(i);
                      }
                    }}
                  ></Button>
                  <Collapse isOpen={selectedAP === i}>
                    <Pre>
                      Reference: <Tag>{ga.F_InvoiceNo}</Tag> Amount:{" "}
                      <Tag>
                        ${ga.F_InvoiceAmt} {ga.F_Currency}
                      </Tag>{" "}
                      Check #: <Tag>{ga.F_CheckNo || "NONE"}</Tag> Paid :{" "}
                      <Tag intent={ga.F_PaidAmt ? "danger" : "secondary"}>
                        ${ga.F_PaidAmt}
                      </Tag>{" "}
                      Created:{" "}
                      <Tag>
                        {moment(ga.F_U1Date).utc().format("l")} by {ga.F_U1ID}
                      </Tag>
                    </Pre>
                    <Button
                      text="REQUEST APPROVAL"
                      intent="primary"
                      icon="confirm"
                      className="mb-2"
                      disabled={ga.F_PaidAmt}
                      onClick={() =>
                        alert("PLEASE ATTACH AP DOCUMENT BEFORE REQUEST")
                      }
                    ></Button>
                    {!ga.F_PaidAmt && (
                      <>
                        <RequestForm ap={ga} aptype="CHECK" />
                        <RequestForm ap={ga} aptype="CARD" />
                        <RequestForm ap={ga} aptype="WIRE" />
                        <RequestForm ap={ga} aptype="ACH" />
                      </>
                    )}
                  </Collapse>
                </div>
              );
            })}
          <hr className="my-1" />
          {/* INVOICE REQUEST APPROVAL */}
          {invoice &&
            invoice.map((ga, i) => {
              return (
                <div key={i} className="mr-2">
                  <Button
                    text={`INVOICE: ${ga.F_InvoiceNo}`}
                    disabled={!ga.F_InvoiceAmt}
                    small={true}
                    onClick={() => {
                      if (selectedInvoice === i) {
                        setSelectedInvoice(false);
                      } else {
                        setSelectedInvoice(i);
                      }
                    }}
                  ></Button>
                  <Collapse isOpen={selectedInvoice === i}>
                    <Pre>
                      Amount:{" "}
                      <Tag>
                        ${ga.F_InvoiceAmt} {ga.F_Currency}
                      </Tag>{" "}
                      Invoice Date:{" "}
                      <Tag>{moment(ga.F_InvoiceDate).utc().format("l")}</Tag>{" "}
                      Paid :{" "}
                      <Tag intent={ga.F_PaidAmt ? "success" : "secondary"}>
                        ${ga.F_PaidAmt}
                      </Tag>{" "}
                      Created{" "}
                      <Tag>
                        {moment(ga.F_U1Date).utc().format("l")} by {ga.F_U1ID}
                      </Tag>
                    </Pre>
                    <Button
                      text="REQUEST APPROVAL"
                      intent="primary"
                      icon="confirm"
                      className="mb-2"
                      disabled={ga.F_PaidAmt}
                      onClick={() =>
                        alert("PLEASE ATTACH INVOICE DOCUMENT BEFORE REQUEST")
                      }
                    ></Button>
                  </Collapse>
                </div>
              );
            })}
          <hr className="my-1" />
          {/* INVOICE REQUEST APPROVAL */}
          {crdr &&
            crdr.map((ga, i) => {
              return (
                <div key={i} className="mr-2">
                  <Button
                    text={`CRDB: ${ga.F_CrDbNo}`}
                    disabled={!ga.F_Total}
                    small={true}
                    onClick={() => {
                      if (selectedCrdr === i) {
                        setSelectedCrdr(false);
                      } else {
                        setSelectedCrdr(i);
                      }
                    }}
                  ></Button>
                  <Collapse isOpen={selectedCrdr === i}>
                    <Pre>
                      Amount:{" "}
                      <Tag>
                        ${ga.F_Total} {ga.F_Currency}
                      </Tag>{" "}
                      Invoice Date:{" "}
                      <Tag>{moment(ga.F_InvoiceDate).utc().format("l")}</Tag>{" "}
                      Paid :{" "}
                      <Tag intent={ga.F_PaidAmt ? "success" : "secondary"}>
                        ${ga.F_PaidAmt}
                      </Tag>{" "}
                      Created{" "}
                      <Tag>
                        {moment(ga.F_U1Date).utc().format("l")} by {ga.F_U1ID}
                      </Tag>
                    </Pre>
                    <Button
                      text="REQUEST APPROVAL"
                      intent="primary"
                      icon="confirm"
                      className="mb-2"
                      disabled={ga.F_PaidAmt}
                      onClick={() =>
                        alert("PLEASE ATTACH CRDB DOCUMENT BEFORE REQUEST")
                      }
                    ></Button>
                  </Collapse>
                </div>
              );
            })}
          <br />
          {file &&
            file.map((ga, i) => (
              <Button
                key={"file" + i}
                text={ga}
                onClick={async () => {
                  window.location.assign(
                    `http://jameswgroup.com:49991/api/forwarding/${refs.F_RefNo}/${ga}`
                  );
                }}
                intent="success"
                icon="download"
                className="mt-1 mr-1"
                small={true}
              ></Button>
            ))}
          <Card className="mt-2 py-1">
            <h5 className="pt-2 text-primary">Comments</h5>
            {comment &&
              comment.map((ga) => (
                <CommentList
                  key={ga.ID}
                  last={ga.UID_LNAME}
                  first={ga.UID_FNAME}
                  content={ga.Content}
                  date={ga.Date}
                ></CommentList>
              ))}
            {ReactQuill && (
              <ReactQuill
                className="my-2"
                value={html}
                placeholder="Type here..."
                modules={{
                  toolbar: {
                    container: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      // [{ font: [] }],
                      // [{ align: [] }],
                      ["bold", "italic", "underline"],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                        {
                          color: [
                            "#000000",
                            "#e60000",
                            "#ff9900",
                            "#ffff00",
                            "#008a00",
                            "#0066cc",
                            "#9933ff",
                            "#ffffff",
                            "#facccc",
                            "#ffebcc",
                            "#ffffcc",
                            "#cce8cc",
                            "#cce0f5",
                            "#ebd6ff",
                            "#bbbbbb",
                            "#f06666",
                            "#ffc266",
                            "#ffff66",
                            "#66b966",
                            "#66a3e0",
                            "#c285ff",
                            "#888888",
                            "#a10000",
                            "#b26b00",
                            "#b2b200",
                            "#006100",
                            "#0047b2",
                            "#6b24b2",
                            "#444444",
                            "#5c0000",
                            "#663d00",
                            "#666600",
                            "#003700",
                            "#002966",
                            "#3d1466",
                            "custom-color",
                          ],
                        },
                        { background: [] },
                        "link",
                        // "image",
                      ],
                    ],
                  },
                  keyboard: {
                    bindings: {
                      // handleEnter: {
                      //   key: 13,
                      //   handler: function (e) {
                      //     setHtml("");
                      //   },
                      // },
                    },
                  },
                }}
                theme="snow"
                onChange={setHtml}
                style={{ width: "100%" }}
              />
            )}
            <Button
              text="Save"
              onClick={() => {
                uploadComment(refs);
                console.log(html);
              }}
              intent="primary"
              className="mr-2 mb-2"
            ></Button>
            <Button
              text="Cancel"
              className="mb-2"
              onClick={() => setHtml("")}
            ></Button>
          </Card>

          {/* Bill of Lading Body */}
          <div className="card mt-2">
            <div className="card-body">
              <pre className="mb-1">MBL</pre>
              <code>{refs.F_MBLNo || refs.F_MawbNo}</code>

              <pre className="mb-1 mt-1">Description</pre>
              <code>{refs.F_Description}</code>
            </div>
          </div>

          {/* {Object.keys(refs).map((ga) => (
            <p className="text-gray-300" key={ga}>
              {ga} : {refs[ga]}
            </p>
          ))} */}

          {/* {JSON.stringify(refs)} */}
        </div>
        {/* ------------------ RIGHT PANEL ------------------ */}
        <div className="col-3">
          <Popover2
            content={
              <Menu className="font-weight-bold text-uppercase">
                <MenuItem text="In Progress" className="text-success" />
                <MenuItem text="Invoiced" className="text-warning" />
                <MenuItem text="Done" className="text-danger" />
                <MenuItem text="Approved" disabled={true} />
                <MenuItem text="Closed" disabled={true} />
              </Menu>
            }
            fill={true}
          >
            {/* STATUS CHANGE -> UPDATE TO SLACK WHAT SECTION IS UPDATED */}
            {/* 0-OPEN
          3-CLOSED
          5-CLOSED (AFTER 2020-06-01)
          7-CLOSED (AFTER 2021-01-01) */}
            {refs.F_FileClosed && (
              <Button
                text={refs.F_FileClosed[0] == "0" ? "OPEN" : "CLOSED"}
                disabled={refs.F_FileClosed[0] != "0"}
                rightIcon="caret-down"
                fill={true}
              ></Button>
            )}
          </Popover2>
          <a href={`/forwarding/${refs.temp}/${refs.F_RefNo}`}>
            LINK TO {refs.F_RefNo}
          </a>
          <p className="mt-2">
            Assignee:{" "}
            <span className="text-uppercase">
              {refs.F_U2ID && refs.F_U2ID[0]}
            </span>
          </p>

          {/* <p>House Assignee: {refs.F_Operator && refs.F_Operator}</p> */}
          <p>
            Creator:{" "}
            <span className="text-uppercase">
              {refs.F_U1ID && refs.F_U1ID[0]}
            </span>
          </p>
          <hr />
          {/* {refs.F_U1Date && (
              <div>
                <p>{new Date(refs.F_U1Date[0]).toLocaleDateString()}</p>
                <p>{new Date(refs.F_U1Date[0]).toLocaleString()}</p>
              </div>
            )} */}
          <p>
            Created{" "}
            {refs.F_U1Date &&
              moment(
                moment(refs.F_U1Date[0]).utc().format("YYYY-MM-DD HH:mm:ss")
              ).fromNow()}
          </p>
          <p>
            Updated{" "}
            {refs.F_U2Date &&
              moment(
                moment(refs.F_U2Date[0]).utc().format("YYYY-MM-DD HH:mm:ss")
              ).fromNow()}
          </p>
          <p>
            Post{" "}
            {refs.F_PostDate &&
              moment(
                moment(refs.F_PostDate).utc().format("YYYY-MM-DD HH:mm:ss")
              ).fromNow()}
          </p>

          <hr />
          <div className="d-flex justify-content-between">
            <div className="font-weight-bold">Ship: </div>
            <div>
              {moment(refs.F_ETD).isValid &&
                moment(refs.F_ETD).utc().format("L")}
            </div>
          </div>
          <div className="text-right text-gray-500">{refs.F_LoadingPort}</div>
          <div className="d-flex justify-content-between my-1">
            <div className="font-weight-bold">Arrival: </div>
            <div>
              {moment(refs.F_ETA).isValid &&
                moment(refs.F_ETA).utc().format("L")}
            </div>
          </div>
          <div className="text-right text-gray-500">
            {refs.F_Discharge || refs.F_DisCharge}
          </div>
          <div className="d-flex justify-content-between my-1">
            <div className="font-weight-bold">Delivery: </div>
            <div>
              {/* IF FETA EXIST - TWO TYPE STRING, ARRAY */}
              {refs.F_FETA &&
                (typeof refs.F_FETA === "string"
                  ? moment(refs.F_FETA).isValid &&
                    moment(refs.F_FETA).utc().format("L")
                  : refs.F_FETA.length &&
                    moment(refs.F_FETA[0]).utc().format("L"))}
            </div>
          </div>
          <div className="text-right text-gray-500">{refs.F_FinalDest}</div>
          <hr />
          <label className="bp3-file-input d-block">
            <input
              type="file"
              name="userPhoto"
              onChange={(e) => uploadFile(e)}
              id="upload"
            />
            <span className="bp3-file-upload-input">Choose File</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MasterDialog;
