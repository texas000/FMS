import { Badge, Button, Col, Row } from "reactstrap";
import { useRouter } from 'next/router';
import moment from 'moment'

const Head = ({ REF, POST, PIC, EMAIL }) => {
    const router = useRouter();

    const Clipboard = () => {
        var tempInput = document.createElement('INPUT');
        document.getElementsByTagName('body')[0].appendChild(tempInput)
        tempInput.setAttribute('value',process.env.BASE_URL.substring(0, process.env.BASE_URL.length-1)+router.asPath)
        tempInput.select();
        document.execCommand('copy');
        document.getElementsByTagName('body')[0].removeChild(tempInput)
        alert("Copied to your Clipboard")
    }

    return (
      <>
        <Row>
          <Col>
            <h2 style={{fontFamily: "Roboto"}}>{REF}</h2>
            <Button
              className="mr-2"
              size="sm"
              color="primary"
              style={{ borderRadius: 0 }}
              onClick={Clipboard}
            >
              <i className="fa fa-share"></i> Share
            </Button>
            <Button
              className="mr-2"
              size="sm"
              color="danger"
              style={{ borderRadius: 0 }}
              onClick={() => router.back()}
            >
              <i className="fa fa-reply"></i> Back
            </Button>
          </Col>
          <Col className="text-right">
            {EMAIL && (
                <Badge style={{
                    fontSize: "0.8em",
                    color: "gray",
                    backgroundColor: "#FFE4B5",
                    marginRight: "0.5rem",
                    marginBottom: "0.5rem",
                  }}>
                      <a
                  target="__blank"
                  href={EMAIL}
                  ><i className="fa fa-envelope pr-2"></i>MAIL</a>
                </Badge>
            )}
            {POST && (
              <Badge
                style={{
                  fontSize: "0.8em",
                  color: "gray",
                  backgroundColor: "#FFE4B5",
                  marginRight: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
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
                  <i className="fa fa-calendar pr-2"></i>POST DATE: {moment(POST).utc().format("ll")}
                </a>
              </Badge>
            )}
            {PIC && (
              <Badge
                style={{
                  fontSize: "0.8em",
                  color: "gray",
                  backgroundColor: "#FFE4B5",
                  marginRight: "0.5rem",
                  marginBottom: "0.5rem",
                }}
              >
                PIC: {PIC.toUpperCase()}
              </Badge>
            )}
            <p style={{ fontSize: "0.7em", marginBottom: '0.2rem' }}>
              MAIL: Send data to (Outlook / Gmail), POST DATE: Set date to Google Calendar
            </p>
          </Col>
        </Row>
        <hr />
        <style jsx>{`
          h2, a, span, p {
            font-family: 'roboto';
            font-weight: 1000;
          }
          `}</style>
      </>
    );}
export default Head;