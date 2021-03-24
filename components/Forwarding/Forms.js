import { BlobProvider, PDFDownloadLink } from "@react-pdf/renderer";
import CheckRequestForm from "./CheckRequestForm";
import MyCover from "./MyCover";
import moment from "moment";
import {
  Button,
  ButtonGroup,
  Icon,
  Menu,
  MenuItem,
  MenuDivider,
  useHotkeys,
  Breadcrumbs,
  Divider,
  Position,
  Toaster,
  Toast,
  Tag,
  Intent,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

export const Forms = ({ Master, House, Containers, User, Type }) => {
  const [isClient, setIsClient] = React.useState(false);
  const [APType, setAPType] = React.useState("CHECK");
  const [show, setShow] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const FormsToaster = () => {
    if (show) {
      return (
        <Toaster position="top">
          <Toast
            message={msg}
            intent="primary"
            onDismiss={() => setShow(false)}
          ></Toast>
        </Toaster>
      );
    } else {
      return <React.Fragment></React.Fragment>;
    }
  };

  const CoverFormDownload = () => (
    <PDFDownloadLink
      document={
        <MyCover
          master={Master}
          house={House || []}
          containers={Containers}
          type={Type}
        />
      }
      fileName={Master.RefNo}
      className="py-0 my-0"
    >
      {({ blob, url, loading, error }) => (
        <Button
          loading={loading}
          text="COVER DOWNLOAD"
          icon="download"
          intent="primary"
          className="mr-1"
          style={{ fontSize: "0.7rem" }}
        ></Button>
      )}
    </PDFDownloadLink>
  );
  function numberWithCommas(x) {
    var num = parseFloat(x).toFixed(2);
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const CoverFormView = () => (
    <>
      <BlobProvider
        document={
          <MyCover
            master={Master}
            house={House || []}
            containers={Containers}
            type={Type}
          />
        }
      >
        {({ blob, url, loading, error }) => (
          <>
            <a href={url} target="__blank">
              <Button
                loading={loading}
                text="VIEW"
                icon="eye-open"
                intent="primary"
                className="mx-1"
                style={{ fontSize: "0.7rem" }}
              ></Button>
            </a>
          </>
        )}
      </BlobProvider>
    </>
  );
  const APRequestMenu = () => {
    if (House.length > 0) {
      return House.map(
        (ga, i) =>
          ga.AP &&
          ga.AP.map((ap) => (
            <React.Fragment key={i + ap.ID}>
              <BlobProvider
                document={
                  <CheckRequestForm
                    type={APType}
                    vendor={ap.PayTo_SName}
                    payTo={ap.PayToCustomer}
                    amt={numberWithCommas(
                      Number.parseFloat(ap.InvoiceAmt).toFixed(2)
                    )}
                    oim={Master.RefNo}
                    customer={House[i].Customer_SName || ""}
                    inv={ap.InvoiceNo}
                    metd={moment(Master.ETD).utc().format("MM/DD/YY")}
                    meta={moment(Master.ETA).utc().format("MM/DD/YY")}
                    pic={ap.U1ID || ""}
                    today={moment().format("l")}
                    desc={ap.Descript}
                    shipper={House ? House[0].SHIPPER : ""}
                    notify={House ? House[0].NOTIFY : ""}
                    consignee={House ? House[0].CONSIGNEE : ""}
                    pod={Master.DisCharge || Master.Discharge}
                    comm={
                      Master.mCommodity ||
                      House[0].Commodity ||
                      Master.Commodity
                    }
                  />
                }
              >
                {({ blob, url, loading, error }) => (
                  <a
                    href={url}
                    target="__blank"
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      icon="dollar"
                      intent="success"
                      className="mx-1 my-1"
                      small={true}
                      loading={loading}
                      style={{ fontSize: "0.7rem" }}
                      text={ap.PayTo_SName}
                    ></Button>
                  </a>
                )}
              </BlobProvider>
            </React.Fragment>
          ))
      );
    } else {
      return <React.Fragment></React.Fragment>;
    }
  };

  const mailThis = async () => {
    var filteredHbl = "";
    if (House) {
      var hblArray = House.map(
        (ga, i) =>
          `<tr><td>HBL #${i + 1}</td><td>${ga.HBLNo || ga.HawbNo}</td></tr>`
      );
      filteredHbl = hblArray.join("");
    }
    var filteredContainers = "";
    if (Containers) {
      var containerArray = Containers.map(
        (ga, i) =>
          `<tr><td>Container #${i + 1}</td><td>${ga.ContainerNo}</td></tr>`
      );
      filteredContainers = containerArray.join("");
    }
    var fetchMailer = await fetch("/api/mailSend", {
      headers: {
        email: User.email,
        subject: Master.RefNo,
        contents: `<div style="font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";"><div style="display: none;">Automatically Generated from JWIUSA</div><a href="https://jwiusa.com"><img src="https://jamesworldwide.com/wp-content/uploads/2016/03/main-logo.png" width="150" height="30"></a><h2>${
          House ? House[0].Customer_SName : "NO CUSTOMER"
        }</h2><table style="width: 100%;"><tr style="background-color: #dddddd;"><td>REF#</td><td>${
          Master.RefNo
        }</td></tr><tr><td>MBL</td><td>${
          Master.MBLNo || Master.MawbNo
        }</td></tr>${filteredHbl}${filteredContainers}<tr><td>ETD</td><td>${moment(
          Master.ETD
        )
          .utc()
          .format("ll")}</td></tr><tr><td>ETA</td><td>${moment(Master.ETA)
          .utc()
          .format("ll")}</td></tr></table></div>`,
      },
    });
    if (fetchMailer.status === 200) {
      alert("MAIL SENT TO " + User.email);
    } else {
      console.error(fetchMailer);
      alert("FAILED");
    }
  };

  const ApMenu = (
    <Menu>
      <MenuItem
        icon="book"
        text="CHECK"
        onClick={() => {
          setAPType("CHECK");
          setMsg("AP TYPE: CHECK");
          setShow(true);
        }}
      />
      <MenuItem
        icon="credit-card"
        text="CARD"
        onClick={() => {
          setAPType("CARD");
          setMsg("AP TYPE: CARD");
          setShow(true);
        }}
      />
      <MenuItem
        icon="send-to"
        text="ACH"
        onClick={() => {
          setAPType("ACH");
          setMsg("AP TYPE: ACH");
          setShow(true);
        }}
      />
      <MenuItem
        icon="bank-account"
        text="WIRE"
        onClick={() => {
          setAPType("WIRE");
          setMsg("AP TYPE: WIRE");
          setShow(true);
        }}
      />
    </Menu>
  );

  return (
    <div className="card border-left-info shadow d-print-none">
      <div className="card-header py-2 d-flex flex-row align-items-center justify-content-between">
        <div className="text-s font-weight-bold text-info text-uppercase">
          <span className="fa-stack">
            <i className="fa fa-circle fa-stack-2x text-info"></i>
            <i className="fa fa-print fa-stack-1x fa-inverse"></i>
          </span>
          forms
        </div>
        {/* FOLDER TEMPLATE PRINT */}
      </div>
      <div className="card-body py-3">
        {isClient && (
          <div className="text-left">
            <ButtonGroup className="pl-1 mb-2">
              {/* <Tag
                intent="none"
                minimal="true"
                className="font-weight-bold text-info"
                style={{ backgroundColor: "white", fontSize: "1rem" }}
              >
                COVER
              </Tag>
              <Divider /> */}
              <CoverFormDownload />
              <CoverFormView />
            </ButtonGroup>
            <Divider />
            {/* <Button
              text="MAIL"
              icon="envelope"
              intent="primary"
              className="mx-1"
              onClick={mailThis}
              style={{ fontSize: "0.7rem", marginTop: "2px" }}
            ></Button> */}
            <Popover2 content={ApMenu} placement="right-end">
              <Button
                icon="multi-select"
                style={{ fontSize: "0.7rem" }}
                className="ml-1 mr-2 mt-2"
                text={`AP TYPE: ${APType}`}
              />
            </Popover2>
            <br />
            <APRequestMenu />
            <FormsToaster />
          </div>
        )}
      </div>
    </div>
  );
};
export default Forms;
