import {
  Menu,
  MenuItem,
  Dialog,
  Tag,
  Button,
  Classes,
  Collapse,
  Pre,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { useRouter } from "next/router";
import moment from "moment";
import { useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import CommentList from "./CommentList";
import axios, { post } from "axios";
export const MasterDialog = ({
  refs,
  multi,
  container,
  ap,
  invoice,
  comment,
  file,
  token,
}) => {
  const router = useRouter();
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;
  const [selectedHouse, setSelectedHouse] = useState(false);
  const [html, setHtml] = useState("");
  const [comments, setComment] = useState(false);

  async function uploadFile(e) {
    var uploadfile = document.getElementById("gggg").files[0];

    // console.log(uploadfile);
    if (uploadfile) {
      const formData = new FormData();
      formData.append("userPhoto", uploadfile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      try {
        const upload = new Promise((res, rej) => {
          try {
            res(
              post(
                `http://jameswgroup.com:49991/api/upload/${refs.F_RefNo}`,
                formData,
                config
              )
            );
          } catch (err) {
            console.log(err);
            res("uploaded");
          }
        });
        upload.then((ga) => console.log(ga));
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
      UID: 14,
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
      // console.log(newMsg);
    } else {
      alert(`Error ${fetchPostComment.status}`);
    }
  }
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

            {/* {JSON.stringify(token)} */}
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

          {/* <p>MBL: {refs.F_MBLNo || refs.F_MawbNo}</p>
            <p>HBL: {refs.F_HBLNo || refs.F_HAWBNo || refs.F_HawbNo}</p> */}

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
                  <div key={ga.F_ID[1]} className="col-6">
                    <Button
                      onClick={() => {
                        if (selectedHouse === i) {
                          setSelectedHouse(false);
                        } else {
                          setSelectedHouse(i);
                        }
                      }}
                      small={true}
                    >
                      {i + 1}: {ga.F_HBLNo || ga.F_MawbNo}
                    </Button>
                    <Collapse isOpen={selectedHouse === i}>
                      <Pre>{JSON.stringify(ga)}</Pre>
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
                <div key={i}>
                  <Button
                    text={`AP: ${ga.F_Descript}`}
                    small={true}
                    onClick={() => console.log(ga)}
                  ></Button>
                  <hr className="my-1" />
                  {/* {JSON.stringify(ga)} */}
                </div>
              );
            })}

          {/* INVOICE REQUEST APPROVAL */}
          {invoice &&
            invoice.map((ga, i) => {
              return (
                <div key={i}>
                  <Button
                    text={`INVOICE: ${ga.F_InvoiceNo}`}
                    disabled={!ga.F_InvoiceAmt}
                    small={true}
                    onClick={() => console.log(ga)}
                  ></Button>
                  <hr className="my-1" />
                  {/* {JSON.stringify(ga)} */}
                </div>
              );
            })}
          <br />
          {file &&
            file.map((ga, i) => (
              <Button
                key={"file" + i}
                text={ga}
                onClick={() =>
                  window.open(
                    `http://jameswgroup.com:49991/api/forwarding/${refs.F_RefNo}/${ga}`
                  )
                }
                intent="success"
                icon="document"
              ></Button>
            ))}
          {/* <p>{JSON.stringify(comment)}</p> */}
          {comments
            ? comments.map((ga) => (
                <CommentList
                  key={ga.ID}
                  last={ga.UID_LNAME}
                  first={ga.UID_FNAME}
                  content={ga.Content}
                  date={ga.Date}
                ></CommentList>
              ))
            : comment.map((ga) => (
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
            className="mr-2"
          ></Button>
          <Button text="Cancel" onClick={() => setHtml("")}></Button>

          {/* Bill of Lading Body */}
          <div className="card mt-2">
            <div className="card-body">
              <pre>Description</pre>
              <code>{refs.F_Description}</code>
            </div>
          </div>

          {Object.keys(refs).map((ga) => (
            <p className="text-gray-300" key={ga}>
              {ga} : {refs[ga]}
            </p>
          ))}

          <input
            type="file"
            name="userPhoto"
            onChange={(e) => uploadFile(e)}
            id="gggg"
          />

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
            <Button text="Open" rightIcon="caret-down" fill={true}></Button>
          </Popover2>

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
          {/* <p>Closed {refs.F_FileClosed && refs.F_FileClosed}</p> */}

          <hr />
          <div className="d-flex justify-content-between">
            <div className="font-weight-bold">Ship: </div>
            <div>
              {moment(refs.F_ETD).isValid &&
                moment(refs.F_ETD).utc().format("L")}
            </div>
          </div>
          <div className="d-flex justify-content-between my-1">
            <div className="font-weight-bold">Arrival: </div>
            <div>
              {moment(refs.F_ETA).isValid &&
                moment(refs.F_ETA).utc().format("L")}
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default MasterDialog;
