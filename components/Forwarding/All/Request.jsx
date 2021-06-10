import { Button, Classes, Dialog, Tag } from "@blueprintjs/core";
import moment from "moment";
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
      setRequest(list);
    } else {
      setRequest([]);
    }
  }
  useEffect(() => {
    getRequest();
    // console.log(TOKEN);
  }, [Reference]);

  async function handleApproval(ga) {
    // ADMIN = 6 (IAN) THEN UPDATE STATUS 111
    if (approve) {
      if (TOKEN.admin === 6) {
        const req = await fetch("/api/requests/updateRequest", {
          method: "POST",
          headers: {
            ref: Reference,
            token: JSON.stringify(TOKEN),
          },
          body: JSON.stringify({ ...ga, newstatus: 111, message: message }),
        });
        if (req.status == 200) {
          setApproval(false);
          setMessage("");
          getRequest();
        }
      }
      if (TOKEN.admin > 6) {
        const req = await fetch("/api/requests/updateRequest", {
          method: "POST",
          headers: {
            ref: Reference,
            token: JSON.stringify(TOKEN),
          },
          body: JSON.stringify({ ...ga, newstatus: 121, message: message }),
        });
        if (req.status == 200) {
          setApproval(false);
          setMessage("");
          getRequest();
        }
      }
    }
    if (reject) {
      if (TOKEN.admin === 6) {
        const req = await fetch("/api/requests/updateRequest", {
          method: "POST",
          headers: {
            ref: Reference,
            token: JSON.stringify(TOKEN),
          },
          body: JSON.stringify({ ...ga, newstatus: 110, message: message }),
        });
        if (req.status == 200) {
          setReject(false);
          setMessage("");
          getRequest();
        }
      }
      if (TOKEN.admin > 6) {
        const req = await fetch("/api/requests/updateRequest", {
          method: "POST",
          headers: {
            ref: Reference,
            token: JSON.stringify(TOKEN),
          },
          body: JSON.stringify({ ...ga, newstatus: 120, message: message }),
        });
        if (req.status == 200) {
          setApproval(false);
          setMessage("");
          getRequest();
        }
      }
    }
  }

  const Status = ({ data }) => {
    if (data == 101) {
      return <Tag intent="primary">Created</Tag>;
    }
    if (data == 110) {
      return <Tag intent="danger">Director Rejected</Tag>;
    }
    if (data == 111) {
      return <Tag intent="success">Director Approved</Tag>;
    }
    if (data == 120) {
      return <Tag intent="danger">Accounting Rejected</Tag>;
    }
    if (data == 121) {
      return <Tag intent="success">Accounting Approved</Tag>;
    }
  };

  return (
    <div className="card my-4 py-4 shadow">
      <div className="row px-4 py-2">
        <div className="col-12">
          <h4 className="h6">Request</h4>
          {request.length ? (
            <div className="list-group">
              {request.map((ga) => {
                const body = JSON.parse(ga.Body);
                return (
                  <div className="list-group-item" key={ga.ID}>
                    <div className="d-flex justify-content-between">
                      <Status data={ga.Status} />
                      <h5>
                        {`[${ga.Created}]`} {ga.Title} {` TO ${body.F_SName}`}{" "}
                        <mark>
                          $ {body.F_InvoiceAmt} {body.F_Currency}
                        </mark>{" "}
                      </h5>
                      <small>
                        <Button
                          icon="folder-shared-open"
                          text={ga.Attachment}
                          onClick={() =>
                            window.open(
                              `http://jameswgroup.com:49991/api/forwarding/${Reference}/${ga.Attachment}`
                            )
                          }
                        />
                        <Button
                          text="Approve"
                          intent="success"
                          disabled={
                            ga.Status === 101
                              ? TOKEN.admin != 6
                              : ga.Status === 111
                              ? TOKEN.admin != 9
                              : true
                          }
                          onClick={() => setApproval(true)}
                          className="ml-4"
                        />
                        <Button
                          text="Reject"
                          intent="danger"
                          className="ml-4"
                          disabled={
                            ga.Status === 101
                              ? TOKEN.admin != 6
                              : ga.Status === 111
                              ? TOKEN.admin != 9
                              : true
                          }
                          onClick={() => setReject(true)}
                        />
                        {/* Requested by {ga.Created} at{" "}
                        {moment(ga.CreateAt).format("lll")} */}
                      </small>
                    </div>
                    {/* {body && (
                      <div className="card">
                        <div className="card-header font-weight-bold">
                          {body.F_InvoiceNo}
                        </div>
                        <div className="card-body">
                          <p>Description: {body.F_Descript}</p>
                          <p>
                            Amount: ${body.F_InvoiceAmt} {body.F_Currency}
                          </p>
                          <p>Check Number: {body.F_CheckNo}</p>
                          <p>Payable To: {body.F_SName}</p>
                          <p>
                            Address: {body.F_Addr} {body.F_City} {body.F_State}{" "}
                            {body.F_ZipCode}
                          </p>
                          <p>Due: {body.F_DueDate}</p>
                          <h5>REJECT REASON</h5>
                        </div>
                      </div>
                    )} */}
                    {/* {JSON.stringify(AP)} */}
                    <div className="d-flex justify-content-between">
                      {/* <Button
                        text="Approve"
                        intent="success"
                        disabled={!ga.Status || TOKEN.admin < 6}
                        onClick={() => setApproval(true)}
                      /> */}
                      {/* Approval Comment need to be specified */}
                      {/* 100 - Created */}
                      {/* 101 - Requested  (SEND EMAIL TO IAN) */}
                      {/* 110 - Approval Rejected - IAN (SEND EMAIL TO ACC, REPORTER ) */}
                      {/* 111 - Approval Accepted - IAN */}
                      {/* 120 - Approval Rejected - ACC (SEND EMAIL TO ACC, REPORTER ) */}
                      {/* 121 - Approval Accepted - ACC - CASE FINAL APPROVED */}
                      {/* <Button
                        text="Reject"
                        intent="danger"
                        disabled={!ga.Status || TOKEN.admin < 6}
                        onClick={() => setReject(true)}
                      /> */}
                      {/* Reject Comment need to be specified */}
                    </div>
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
                        <Button
                          text="Confirm"
                          fill={true}
                          onClick={() => handleApproval(ga)}
                        />
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
                        <Button
                          text="Confirm"
                          fill={true}
                          onClick={() => handleApproval(ga)}
                        />
                      </div>
                    </Dialog>
                  </div>
                );
              })}
            </div>
          ) : (
            <p>NO REQUEST FOR {Reference}</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default Request;
