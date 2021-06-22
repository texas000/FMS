import { Button } from "@blueprintjs/core";
import moment from "moment";

export default function ApRequest({
  req,
  body,
  token,
  setApproval,
  setReject,
}) {
  function usdFormat(x) {
    var num = parseFloat(x).toFixed(2);
    if (typeof x == "number") {
      return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return "$" + 0;
    }
  }

  const Status = ({ data }) => {
    if (data == 101) {
      return <div className="text-gray-600">Requested</div>;
    }
    if (data == 110) {
      return <div className="text-danger">Dir Rejected</div>;
    }
    if (data == 111) {
      return <div className="text-success">Dir Approved</div>;
    }
    if (data == 120) {
      return <div className="text-danger">Acc. Rejected</div>;
    }
    if (data == 121) {
      return <div className="text-success">Acc. Approved</div>;
    }
  };

  async function handleNoti() {
    const bool = confirm("Do you want to notify this request again?");
    if (bool) {
      if (req.Status == 101 || req.Status == 111) {
        const fetchNoti = await fetch("/api/requests/postSlackNotify", {
          method: "POST",
          headers: {
            token: JSON.stringify(token),
          },
          body: JSON.stringify(req),
        });
        if (fetchNoti.status == 200) {
          console.log(fetchNoti);
        }
      } else {
        alert("UNABLE TO NOTIFY WITH THIS STATUS!");
      }
    }
  }

  return (
    <tr key={req.ID}>
      <td className="text-center text-uppercase">
        <Status data={req.Status} />
      </td>
      <td>{req.Created}</td>
      <td>{moment(req.ModifyAt).utc().format("L")}</td>
      <td className="text-right font-weight-bold">
        {usdFormat(body.F_InvoiceAmt)}
      </td>
      <td className="text-uppercase text-center">{req.ApType}</td>
      <td className="text-right px-1">
        <Button
          text={req.Attachment}
          className="d-inline-block text-truncate text-center text-secondary"
          style={{ maxWidth: "80px", minWidth: "80px" }}
          small={true}
          onClick={() =>
            window.open(
              `http://jameswgroup.com:49991/api/forwarding/${req.RefNo}/${req.Attachment}`
            )
          }
        />
      </td>
      <td className="text-left px-1">
        {req.Attachment2 != null && (
          <Button
            text={req.Attachment2}
            className="d-inline-block text-truncate text-center text-secondary"
            style={{ maxWidth: "80px" }}
            small={true}
            onClick={() =>
              window.open(
                `http://jameswgroup.com:49991/api/forwarding/${req.RefNo}/${req.Attachment2}`
              )
            }
          />
        )}
      </td>
      <td className="text-center">
        <Button icon="notifications-snooze" small={true} onClick={handleNoti} />
      </td>
      <td className="text-center">
        <Button
          text="Approve"
          intent="success"
          small={true}
          disabled={
            req.Status === 101
              ? token && token.admin != 6
              : req.Status === 111
              ? token && token.admin != 9
              : true
          }
          onClick={() => setApproval(req)}
        />
        <Button
          text="Reject"
          intent="danger"
          className="ml-2"
          small={true}
          disabled={
            req.Status === 101
              ? token && token.admin != 6
              : req.Status === 111
              ? token && token.admin != 9
              : true
          }
          onClick={() => setReject(req)}
        />
      </td>
    </tr>
  );
}
