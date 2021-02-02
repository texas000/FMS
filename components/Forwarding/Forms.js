import { BlobProvider } from "@react-pdf/renderer";
import { Button, ButtonGroup } from "reactstrap";
import CheckRequestForm from "./CheckRequestForm";
import MyCover from "./MyCover";
import moment from "moment";

export const Forms = ({ Master, House, Containers, AP }) => {
  const [isClient, setIsClient] = React.useState(false);
  const [APType, setAPType] = React.useState("CHECK");
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
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
        {isClient && (
          <ButtonGroup>
            <BlobProvider
              document={
                <MyCover
                  master={Master}
                  house={House || []}
                  containers={Containers}
                />
              }
            >
              {({ url }) => (
                <a href={url} target="_blank">
                  <Button
                    size="sm"
                    className="text-xs"
                    outline
                    color="info"
                    disabled={!isClient}
                  >
                    <i className="fa fa-print mr-1"></i>COVER
                  </Button>
                </a>
              )}
            </BlobProvider>
          </ButtonGroup>
        )}
      </div>
      <div className="card-body py-3">
        <div className="text-xs text-secondary">Please select AP type</div>
        <ButtonGroup className="text-xs" aria-label="radio">
          <Button
            size="sm"
            className="text-xs"
            outline={APType !== "CHECK"}
            color="info"
            onClick={() => setAPType("CHECK")}
          >
            Check
          </Button>
          <Button
            size="sm"
            className="text-xs"
            outline={APType !== "CARD"}
            color="info"
            onClick={() => setAPType("CARD")}
          >
            Card
          </Button>
          <Button
            size="sm"
            className="text-xs"
            outline={APType !== "WIRE"}
            color="info"
            onClick={() => setAPType("WIRE")}
          >
            Wire
          </Button>
          <Button
            size="sm"
            className="text-xs"
            outline={APType !== "ACH"}
            color="info"
            onClick={() => setAPType("ACH")}
          >
            ACH
          </Button>
        </ButtonGroup>
        <br />
        {isClient && AP.length ? (
          AP.map((ga, i) => (
            <React.Fragment key={i + ga.F_ID}>
              <BlobProvider
                document={
                  <CheckRequestForm
                    type={APType}
                    vendor={ga.PAY}
                    amt={numberWithCommas(
                      Number.parseFloat(ga.F_InvoiceAmt).toFixed(2)
                    )}
                    oim={Master.F_RefNo}
                    customer={House ? House[0].CUSTOMER || OTHER.CUSTOMER : ""}
                    inv={ga.F_InvoiceNo}
                    metd={moment(Master.F_ETD)
                      .add(1, "days")
                      .format("MM/DD/YY")}
                    meta={moment(Master.F_ETA)
                      .add(1, "days")
                      .format("MM/DD/YY")}
                    pic={ga.F_U1ID}
                    today={moment().format("l")}
                    desc={ga.F_Descript}
                  />
                }
              >
                {({ url }) => (
                  <a
                    href={url}
                    target="_blank"
                    className="btn btn-info btn-sm text-xs text-wrap my-1"
                  >
                    <i className="fa fa-file"></i>
                    <span className="ml-2">{ga.F_Descript}</span>
                  </a>
                )}
              </BlobProvider>
              <br />
            </React.Fragment>
          ))
        ) : (
          <div className="text-info text-xs mt-2">No AP Found</div>
        )}
      </div>
    </div>
  );
};
export default Forms;
