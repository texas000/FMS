import { Button, Toaster, Toast } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import moment from "moment";

export const AutomateNoti = () => {
  const [show, setShow] = useState(false);
  const AlertDeletedNoti = () => {
    if (show) {
      return (
        <Toaster position="top">
          <Toast
            message="NOTIFICATION DELETED SUCCESSFULLY"
            intent="success"
            onDismiss={() => setShow(false)}
          ></Toast>
        </Toaster>
      );
    } else {
      return <React.Fragment></React.Fragment>;
    }
  };

  async function getNotiData() {
    const fetchNoti = await fetch(`/api/admin/getAutomateNoti`);
    if (fetchNoti.status === 200) {
      const noti = await fetchNoti.json();
      setNotiList(noti);
    }
  }

  async function deleteNoti(id) {
    const fetchDelete = await fetch("/api/admin/deleteAutomateNoti", {
      method: "POST",
      body: id,
    });
    if (fetchDelete.status === 200) {
      setShow(true);
      getNotiData();
    } else {
      alert(`ERROR ${fetchDelete.status}`);
    }
  }

  const [notiList, setNotiList] = useState([]);

  useEffect(() => {
    getNotiData();
  }, []);

  return (
    <div className="row my-3">
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-header font-weight-bold">Work Anniversary</div>
          <div className="card-body">
            <ul className="list-group text-xs">
              {notiList &&
                notiList.map((ga) => (
                  <li
                    className="list-group-item d-flex justify-content-between align-items-center"
                    key={ga.F_ID}
                  >
                    <div className="text-left">
                      <span className="text-primary">{ga.F_SUBJECT} EMAIL</span>{" "}
                      SCHEDULED AT{" "}
                      <span className="text-danger">
                        {moment(ga.F_TARGET).utc().format("LL")}
                      </span>
                    </div>
                    <Button small={true} onClick={() => deleteNoti(ga.F_ID)}>
                      Delete
                    </Button>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="card shadow">
          <div className="card-header font-weight-bold">Information</div>
          <div className="card-body">
            <div className="text-secondary">
              Anniversary Email will be sent out automatically at 7:00
            </div>
          </div>
        </div>
      </div>
      <AlertDeletedNoti />
    </div>
  );
};
export default AutomateNoti;
