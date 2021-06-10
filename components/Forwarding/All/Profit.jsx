import { Tag, Classes, Dialog, Button } from "@blueprintjs/core";
import moment from "moment";
import { useState } from "react";
import axios, { post } from "axios";

export const Profit = ({ invoice, ap, crdr, profit, TOKEN, Reference }) => {
  const [selected, setSelected] = useState(false);
  const [file, setFile] = useState(false);
  const [type, setType] = useState(false);

  async function uploadFile() {
    var uploadfile = document.getElementById("upload").files[0];
    if (uploadfile) {
      const formData = new FormData();
      formData.append("userPhoto", uploadfile);
      const config = {
        headers: {
          "content-type": "multipart/form-data",
          reference: Reference,
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
            console.log(ga);
            setFile(uploadfile.name);
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

  async function postReq(body) {
    const req = await fetch("/api/requests/postRequest", {
      method: "POST",
      headers: {
        ref: Reference,
        token: JSON.stringify(TOKEN),
      },
      body: JSON.stringify({ ...body, file: file, type: type }),
    });
    if (req.status === 200) {
      setSelected(false);
    } else {
      alert(req.status);
    }
    console.log(await req.json());
  }
  return (
    <div className="card my-4 py-4 shadow">
      <div className="row px-4 py-2">
        <div className="col-12">
          <h4 className="h6">PROFIT</h4>
          {profit &&
            profit.map((ga, i) => (
              <div key={i}>
                <Tag>AR: {ga.F_AR}</Tag> <Tag>AP: {ga.F_AP}</Tag>{" "}
                <Tag>CRDR: {ga.F_CrDr}</Tag> <Tag>TOTAL: {ga.F_HouseTotal}</Tag>
              </div>
            ))}
          <hr />
          {/* {master.P && JSON.stringify(profit)} */}
        </div>

        <div className="col-12">
          <h4 className="h6">INVOICE</h4>
          {invoice &&
            invoice.map((ga) => (
              <span key={ga.F_ID}>
                <Tag
                  intent={
                    ga.F_InvoiceAmt == ga.F_PaidAmt && ga.F_InvoiceAmt != 0
                      ? "success"
                      : "none"
                  }
                  className="mr-2"
                >
                  {ga.F_InvoiceNo}
                </Tag>
              </span>
            ))}
          {/* {JSON.stringify(invoice)} */}
          <hr />
        </div>

        <div className="col-12">
          <h4 className="h6">CRDR</h4>
          {crdr &&
            crdr.map((ga) => (
              <span key={ga.F_ID}>
                <Tag
                  intent={
                    ga.F_Total == ga.F_PaidAmt && ga.F_Total != 0
                      ? "success"
                      : "none"
                  }
                  className="mr-2"
                >
                  {ga.F_CrDbNo}
                </Tag>
              </span>
            ))}
          {/* {JSON.stringify(crdr)} */}
          <hr />
        </div>

        <div className="col-12">
          <h4 className="h6">AP</h4>
          {ap &&
            ap.map((ga) => (
              <Button
                key={ga.F_ID}
                onClick={() => setSelected(ga)}
                intent={
                  ga.F_InvoiceAmt == ga.F_PaidAmt && ga.F_InvoiceAmt != 0
                    ? "success"
                    : "none"
                }
                className="mr-2"
                text={ga.F_SName}
              >
                {/* <Tag */}
                {/* </Tag> */}
              </Button>
            ))}
        </div>
      </div>
      <Dialog
        isOpen={selected}
        onClose={() => {
          setSelected(false);
          setType(false);
          setFile(false);
        }}
        title="Request Approval"
      >
        <div className={Classes.DIALOG_BODY}>
          <h5>Would you like to request approval?</h5>
          <div className="card">
            <div className="card-header font-weight-bold">
              <div className="d-flex justify-content-between">
                <span>INVOICE {selected.F_InvoiceNo}</span>
                <span>DUE: {moment(selected.F_DueDate).utc().format("l")}</span>
              </div>
            </div>
            <div className="card-body">
              <p className="font-weight-bold">
                Payable To: <mark>{selected.F_SName}</mark>
              </p>
              <p>
                Address: {selected.F_Addr} {selected.F_City} {selected.F_State}{" "}
                {selected.F_ZipCode}
              </p>
              <p>Description: {selected.F_Descript}</p>
              <p className="font-weight-bold h5">
                Amount:{" "}
                <mark>
                  ${selected.F_InvoiceAmt} {selected.F_Currency}
                </mark>
              </p>
              <hr />
              <div className="form-group mb-4">
                <label htmlFor="type">AP Type</label>
                <select
                  className="form-control"
                  id="type"
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value={false}>Please select type</option>
                  <option value="check">Check</option>
                  <option value="card">Card</option>
                  <option value="ach">ACH</option>
                  <option value="wire">Wire</option>
                </select>

                <label className="bp3-file-input d-block mt-2">
                  <label htmlFor="upload">FILE</label>
                  <input
                    type="file"
                    name="userPhoto"
                    id="upload"
                    onChange={uploadFile}
                  />
                  <span className="form-control">
                    {file ? file : "Choose File"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button
            text="Confirm"
            fill={true}
            onClick={() => postReq(selected)}
            disabled={!file || type == "false"}
          />
          {/* WHEN REQUEST HAPPEN, UPLOAD TO DATABASE AND SEND THE NOTIFICATION TO IAN */}
        </div>
      </Dialog>
    </div>
  );
};
export default Profit;
