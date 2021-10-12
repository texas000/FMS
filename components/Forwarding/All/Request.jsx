import { Button, Classes, Dialog, Tag } from "@blueprintjs/core";
import moment from "moment";
import React from "react";
import { useEffect, useState } from "react";
import { Input } from "reactstrap";

export const Request = ({ Reference, ap, TOKEN }) => {
  const [request, setRequest] = useState([]);
  const [approve, setApproval] = useState(false);
  const [message, setMessage] = useState("");
  const [reject, setReject] = useState(false);

  async function getRequest() {
    const req = await fetch("/api/requests/getRequest", {
      method: "GET",
      headers: {
        ref: Reference,
      },
    });
    if (req.status === 200) {
      const list = await req.json();
      // console.log(list);
      setRequest(list);
    } else {
      setRequest([]);
    }
  }
  useEffect(() => {
    getRequest();
    // console.log(TOKEN);
  }, [Reference]);

  async function handleApproval() {
    if (approve) {
      //DIRECTOR
      if (TOKEN.admin === 6) {
        const req = await fetch("/api/requests/updateRequest", {
          method: "POST",
          headers: {
            ref: Reference,
            token: JSON.stringify(TOKEN),
          },
          body: JSON.stringify({
            ...approve,
            newstatus: 111,
            message: message,
          }),
        });
        if (req.status == 200) {
          setApproval(false);
          setMessage("");
          getRequest();
        }
      }
      //ACCOUNTING
      if (TOKEN.admin > 6) {
        const req = await fetch("/api/requests/updateRequest", {
          method: "POST",
          headers: {
            ref: Reference,
            token: JSON.stringify(TOKEN),
          },
          body: JSON.stringify({
            ...approve,
            newstatus: 121,
            message: message,
          }),
        });
        if (req.status == 200) {
          setApproval(false);
          setMessage("");
          getRequest();
        }
      }
    }
    if (reject) {
      // DIRECTOR
      if (TOKEN.admin === 6) {
        const req = await fetch("/api/requests/updateRequest", {
          method: "POST",
          headers: {
            ref: Reference,
            token: JSON.stringify(TOKEN),
          },
          body: JSON.stringify({ ...reject, newstatus: 110, message: message }),
        });
        if (req.status == 200) {
          setReject(false);
          setMessage("");
          getRequest();
        }
      }
      // ACCOUNTING
      if (TOKEN.admin > 6) {
        const req = await fetch("/api/requests/updateRequest", {
          method: "POST",
          headers: {
            ref: Reference,
            token: JSON.stringify(TOKEN),
          },
          body: JSON.stringify({ ...reject, newstatus: 120, message: message }),
        });
        if (req.status == 200) {
          setApproval(false);
          setMessage("");
          getRequest();
        }
      }
    }
  }

  return (
    <div className="card my-4 py-4 shadow">
      <div className="row px-4 py-2">
        <div className="col-12">
          <h4 className="h6">Request</h4>
          {JSON.stringify(request)}
          {/* <table className="table">
            <thead>
              <tr>
                <th className="text-center">STATUS</th>
                <th>PIC</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th className="text-center">TYPE</th>
                <th colSpan={2} className="text-center">
                  FILE
                </th>
                <th className="text-center">NOTI</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {ap.map((ga) => (
                <React.Fragment key={ga.F_ID}>
                  <tr>
                    <td
                      colSpan="9"
                      className="text-white font-weight-bold bg-gray-600 py-1"
                    >
                      [{ga.F_InvoiceNo}] {ga.F_SName}
                    </td>
                  </tr>
                  {request.map((req) => {
                    const body = JSON.parse(req.Body);
                    if (ga.F_InvoiceNo == body.F_InvoiceNo) {
                      return (
                        <ApRequest
                          req={req}
                          body={body}
                          token={TOKEN}
                          setApproval={setApproval}
                          setReject={setReject}
                        />
                      );
                    }
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table> */}
          <div>
            <Dialog
              isOpen={approve}
              onClose={() => setApproval(false)}
              title="Approve"
            >
              <div className={Classes.DIALOG_BODY}>
                <Input
                  placeholder="Note"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <Button text="Confirm" fill={true} onClick={handleApproval} />
              </div>
            </Dialog>
            <Dialog
              isOpen={reject}
              onClose={() => setReject(false)}
              title="Reject"
            >
              <div className={Classes.DIALOG_BODY}>
                <Input
                  placeholder="Note"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className={Classes.DIALOG_FOOTER}>
                <Button text="Confirm" fill={true} onClick={handleApproval} />
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Request;
