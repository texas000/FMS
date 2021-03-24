import { Col, Row } from "reactstrap";
import { Tag, Toast, Toaster } from "@blueprintjs/core";
import { useRouter } from "next/router";
import moment from "moment";
import "@blueprintjs/core/lib/css/blueprint.css";

const Head = ({ REF, POST, EMAIL, CUSTOMER }) => {
  const router = useRouter();
  const [show, setShow] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  const FormsToaster = () => {
    if (show) {
      return (
        <Toaster position="top">
          <Toast
            message={msg}
            intent="warning"
            onDismiss={() => setShow(false)}
          ></Toast>
        </Toaster>
      );
    } else {
      return <React.Fragment></React.Fragment>;
    }
  };

  const Clipboard = () => {
    const routes = "jwiusa.com" + router.asPath;
    var tempInput = document.createElement("INPUT");
    document.getElementsByTagName("body")[0].appendChild(tempInput);
    tempInput.setAttribute("value", routes);
    tempInput.select();
    document.execCommand("copy");
    document.getElementsByTagName("body")[0].removeChild(tempInput);
    setMsg("COPY: " + routes.toUpperCase());
    setShow(true);
  };

  return (
    <>
      <Row className="mb-2">
        <Col lg={6}>
          <h3 className="text-gray-800 h3 text-uppercase d-inline">{REF}</h3>
          <h3 className="pl-2 text-primary h5 text-uppercase d-inline">
            {CUSTOMER}
          </h3>
        </Col>
        <Col className="text-right" lg={6}>
          <Tag
            className="btn btn-link text-primary"
            round={true}
            minimal={true}
            onClick={Clipboard}
          >
            <i className="fa fa-share mr-1"></i>
            SHARE
          </Tag>
          <Tag
            className="btn btn-link text-primary mx-1"
            round={true}
            minimal={true}
            onClick={() => router.back()}
          >
            <i className="fa fa-undo mr-1"></i>
            BACK
          </Tag>
          {EMAIL && (
            <Tag
              className="btn btn-link text-xs text-primary mx-1"
              round={true}
              minimal={true}
            >
              <i className="fa fa-envelope mr-1"></i>
              <a
                target="__blank"
                href={EMAIL}
                onClick={() => {
                  setMsg("CREATING AN EMAIL...");
                  setShow(true);
                }}
              >
                MAIL
              </a>
            </Tag>
          )}
          {POST && (
            <Tag
              className="btn btn-link text-xs text-primary mx-1"
              round={true}
              minimal={true}
            >
              <i className="fa fa-calendar mr-1"></i>
              <a
                target="__blank"
                href={`http://www.google.com/calendar/event?action=TEMPLATE&text=${REF}&dates=${moment(
                  POST
                )
                  .utc()
                  .format("YYYYMMDD")}T080000Z/${moment(POST)
                  .utc()
                  .format(
                    "YYYYMMDD"
                  )}T090000Z&details=${REF}&location=JAMES WORLDWIDE INC.`}
                onClick={() => {
                  setMsg("CREATING AN CALENDAR...");
                  setShow(true);
                }}
              >
                POST DATE: {moment(POST).utc().format("ll")}
              </a>
            </Tag>
          )}
        </Col>
      </Row>
      <FormsToaster />
    </>
  );
};
export default Head;
