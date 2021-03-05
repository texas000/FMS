import { Badge, Button, Col, Row } from "reactstrap";
import { useRouter } from "next/router";
import moment from "moment";

const Head = ({ REF, POST, PIC, EMAIL, CUSTOMER }) => {
  const router = useRouter();

  const Clipboard = () => {
    const routes = "jwiusa.com" + router.asPath;
    var tempInput = document.createElement("INPUT");
    document.getElementsByTagName("body")[0].appendChild(tempInput);
    tempInput.setAttribute("value", routes);
    tempInput.select();
    document.execCommand("copy");
    document.getElementsByTagName("body")[0].removeChild(tempInput);
    alert("Copied to your Clipboard");
  };

  return (
    <>
      <Row className="mb-2">
        <Col lg={6}>
          <h3 className="text-gray-800 h4 font-weight-bold text-uppercase d-inline">
            {REF}
          </h3>
          <h3 className="pl-2 text-primary h5 font-weight-bold text-uppercase d-inline">
            {CUSTOMER}
          </h3>
        </Col>
        <Col className="text-right" lg={6}>
          <Badge
            className="text-xs mx-1 btn btn-link text-primary"
            color="warning"
            onClick={Clipboard}
          >
            <i className="fa fa-upload"></i> SHARE
          </Badge>
          <Badge
            className="text-xs mx-1 btn btn-link text-primary"
            color="warning"
            onClick={() => router.back()}
          >
            <i className="fa fa-reply"></i> BACK
          </Badge>
          {/* <Button
            className="mr-2 py-0"
            size="sm"
            color="danger"
            style={{ borderRadius: 0 }}
            onClick={() => router.back()}
            outline
          >
            <i className="fa fa-reply"></i> Back
          </Button> */}
          {EMAIL && (
            <Badge className="text-xs mx-1" color="warning">
              <a target="__blank" href={EMAIL}>
                <i className="fa fa-envelope pr-2"></i>MAIL
              </a>
            </Badge>
          )}
          {POST && (
            <Badge className="text-xs mx-1" color="warning">
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
                  )}T090000Z&details=${REF}${PIC}&location=JAMES WORLDWIDE INC.`}
              >
                <i className="fa fa-calendar pr-2"></i>POST DATE:{" "}
                {moment(POST).utc().format("ll")}
              </a>
            </Badge>
          )}
          {PIC && (
            <Badge className="text-xs text-gray-800" color="warning">
              PIC: {PIC.toUpperCase()}
            </Badge>
          )}
          {/* <p style={{ fontSize: "0.7em", marginBottom: "0.2rem" }}>
            MAIL: Send data to (Outlook / Gmail), POST DATE: Set date to Google
            Calendar
          </p> */}
        </Col>
      </Row>
    </>
  );
};
export default Head;
