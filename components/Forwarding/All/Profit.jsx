import { Tag, Classes, Dialog, Button } from "@blueprintjs/core";
import moment from "moment";
import { useEffect, useState } from "react";
import axios, { post } from "axios";
import { useRouter } from "next/router";

export const Profit = ({ invoice, ap, crdr, profit, TOKEN, Reference }) => {
  const [selected, setSelected] = useState(false);
  const [file, setFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(false);
  const [selectedFile2, setSelectedFile2] = useState(false);
  const [type, setType] = useState(false);

  function usdFormat(x) {
    var num = parseFloat(x).toFixed(2);
    if (typeof x == "number") {
      return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "$" + 0;
    }
  }
  async function getFiles() {
    const file = await fetch("/api/dashboard/getFileList", {
      method: "GET",
      headers: {
        ref: Reference,
      },
    });
    if (file.status === 200) {
      const list = await file.json();
      setFile(list);
    } else {
      setFile([]);
    }
  }
  useEffect(() => {
    getFiles();
  }, [Reference]);

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
            // setFile(uploadfile.name);
            alert("UPLOAD SUCCESS");
            getFiles();
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

  const router = useRouter();
  async function postReq(body) {
    const req = await fetch("/api/requests/postRequest", {
      method: "POST",
      headers: {
        ref: Reference,
        token: JSON.stringify(TOKEN),
      },
      body: JSON.stringify({
        ...body,
        file: selectedFile,
        file2: selectedFile2,
        type: type,
        path: router.asPath,
      }),
    });
    if (req.status === 200) {
      setSelected(false);
    } else {
      alert(req.status);
    }
  }
  var arTotal = null;
  var crdrTotal = null;
  var apTotal = null;
  for (var i = 0; i < invoice.length; i++) {
    arTotal += invoice[i].F_PaidAmt;
  }
  for (var i = 0; i < crdr.length; i++) {
    crdrTotal += crdr[i].F_PaidAmt;
  }
  for (var i = 0; i < ap.length; i++) {
    apTotal += ap[i].F_PaidAmt;
  }

  return (
    <div className="card my-4 py-4 shadow">
      <div className="row px-4 py-2">
        <div className="col-12">
          <h4 className="h6">PROFIT</h4>
          {profit &&
            profit.map((ga, i) => (
              <div key={i}>
                <div className="d-flex justify-content-between">
                  <Tag
                    className={`${
                      arTotal != null && arTotal / ga.F_AR == 1
                        ? "bg-primary"
                        : "bg-gray-600"
                    } w-100 text-white mr-4 px-4 py-2`}
                    round={true}
                  >
                    <div className="d-flex justify-content-between font-weight-bold">
                      <span>AR</span>
                      <span>{usdFormat(ga.F_AR)}</span>
                    </div>
                  </Tag>
                  <Tag
                    className={`${
                      crdrTotal != null && crdrTotal / ga.F_CrDr == 1
                        ? "bg-primary"
                        : "bg-gray-600"
                    } w-100 text-white mr-4 px-4 py-2`}
                    round={true}
                  >
                    <div className="d-flex justify-content-between font-weight-bold">
                      <span>CRDR</span>
                      <span>{usdFormat(ga.F_CrDr)}</span>
                    </div>
                  </Tag>

                  <Tag
                    className={`${
                      apTotal != null && apTotal / ga.F_AP == 1
                        ? "bg-primary"
                        : "bg-gray-600"
                    } w-100 text-white mr-4 px-4 py-2`}
                    round={true}
                  >
                    <div className="d-flex justify-content-between font-weight-bold">
                      <span>AP</span>
                      <span>{usdFormat(ga.F_AP)}</span>
                    </div>
                  </Tag>

                  <Tag
                    className={`${
                      ((arTotal || 0) - (apTotal || 0) + (crdrTotal || 0)) /
                        (ga.F_HouseTotal || ga.F_MasterTotal) ==
                      1
                        ? "bg-primary"
                        : "bg-gray-600"
                    } w-100 text-white mr-4 px-4 py-2`}
                    round={true}
                  >
                    <div className="d-flex justify-content-between font-weight-bold">
                      <span>TOTAL</span>
                      <span>
                        {usdFormat(ga.F_HouseTotal || ga.F_MasterTotal)}
                      </span>
                    </div>
                  </Tag>
                </div>
              </div>
            ))}
          <hr />
          {/* {JSON.stringify(profit)} */}
        </div>

        <div className="col-12">
          <h4 className="h6">INVOICE</h4>
          {invoice &&
            invoice.map((ga) => (
              <Button
                key={ga.F_ID}
                intent={
                  ga.F_InvoiceAmt == ga.F_PaidAmt && ga.F_InvoiceAmt != 0
                    ? "success"
                    : "none"
                }
                className="mr-2"
                text={`${ga.F_InvoiceNo} (${usdFormat(ga.F_PaidAmt)})`}
                onClick={() => alert(JSON.stringify(ga))}
              />
            ))}
          {/* {JSON.stringify(invoice)} */}
          <hr />
        </div>

        <div className="col-12">
          <h4 className="h6">CRDR</h4>
          {crdr &&
            crdr.map((ga) => (
              <Button
                key={ga.F_ID}
                intent={
                  ga.F_Total == ga.F_PaidAmt && ga.F_Total != 0
                    ? "success"
                    : "none"
                }
                className="mr-2"
                text={`${ga.F_CrDbNo} (${usdFormat(ga.F_Total)})`}
                onClick={() => alert(JSON.stringify(ga))}
              />
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
                text={`${ga.F_SName} (${usdFormat(ga.F_InvoiceAmt)})`}
              />
            ))}
        </div>
      </div>
      <Dialog
        isOpen={selected}
        onClose={() => {
          setSelected(false);
          setType(false);
          setSelectedFile(false);
          setSelectedFile2(false);
          // setFile(false);
        }}
        title="Request Approval"
      >
        <div className={Classes.DIALOG_BODY}>
          <h5>Would you like to request approval?</h5>

          <label className="bp3-file-input d-flex flex-row-reverse">
            <label htmlFor="upload" className="bp3-button">
              Upload File
            </label>
            <input
              type="file"
              name="userPhoto"
              id="upload"
              onChange={uploadFile}
            ></input>
          </label>

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

                <label htmlFor="type" className="mt-2">
                  File
                </label>
                <select
                  className="form-control"
                  id="type"
                  onChange={(e) => setSelectedFile(e.target.value)}
                >
                  <option value={false}>Please select file</option>
                  {file &&
                    file.map((ga) => (
                      <option value={ga} key={ga}>
                        {ga}
                      </option>
                    ))}
                </select>

                <label htmlFor="type" className="mt-2">
                  Backup Document
                </label>
                <select
                  className="form-control"
                  id="type"
                  onChange={(e) => setSelectedFile2(e.target.value)}
                >
                  <option value={false}>Please select file</option>
                  {file &&
                    file.map((ga) => {
                      if (ga != selectedFile) {
                        return (
                          <option value={ga} key={`backup-${ga}`}>
                            {ga}
                          </option>
                        );
                      }
                    })}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <Button
            text="Confirm"
            fill={true}
            onClick={() => postReq(selected)}
            disabled={!selectedFile || type == false || type == "false"}
          />
          {/* WHEN REQUEST HAPPEN, UPLOAD TO DATABASE AND SEND THE NOTIFICATION TO IAN */}
        </div>
      </Dialog>
    </div>
  );
};
export default Profit;
