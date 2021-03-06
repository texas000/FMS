import moment from "moment";
import { Popover2 } from "@blueprintjs/popover2";
import { Menu, MenuItem, Tag, Button } from "@blueprintjs/core";

export const Master = ({
  Clipboard,
  Email,
  Closed,
  Created,
  Updated,
  Creator,
  Updator,
  Post,
  ETA,
  ETD,
  Loading,
  Discharge,
  FETA,
  Destination,
  MoveType,
  LCLFCL,
  IT,
  Express,
  Empty,
  MBL,
  Carrier,
  Agent,
  Vessel,
  CY,
  Commodity,
}) => (
  <div className="card my-4 py-4 shadow">
    <div className="row">
      <div className="col-8 px-4 py-4">
        <div className="d-flex justify-content-between">
          <div>
            {MoveType && (
              <Tag intent="primary" round={true} className="mx-1">
                {MoveType}
              </Tag>
            )}
            {LCLFCL && (
              <Tag
                intent={LCLFCL ? "primary" : "none"}
                round={true}
                className="mx-1"
              >
                {LCLFCL == "F" ? "FCL" : "LCL"}
              </Tag>
            )}
            {IT && (
              <Tag
                intent={IT ? "primary" : "none"}
                round={true}
                className="mx-1"
              >
                IT
              </Tag>
            )}
            {Express && (
              <Tag
                intent={Express == "1" ? "primary" : "none"}
                round={true}
                className="mx-1"
              >
                EXPRESS
              </Tag>
            )}
            {Empty != "0" && (
              <Tag
                intent={Empty ? "primary" : "none"}
                round={true}
                className="mx-1"
              >
                EMPTY
              </Tag>
            )}
          </div>
          <div>
            <Button
              small={true}
              icon="envelope"
              text="SEND MAIL"
              onClick={() => window.open(Email)}
            />
            <Button
              small={true}
              onClick={Clipboard}
              text="COPY CLIPBOARD"
              icon="clipboard"
              className="mx-1"
            ></Button>
          </div>
        </div>

        <table className="table-borderless mt-2 table-sm text-xs">
          <tbody>
            <tr>
              <th className="text-success">MBL</th>
              <th className="text-secondary">{MBL}</th>
            </tr>
            <tr>
              <th className="text-success">CARRIER</th>
              <th className="text-secondary">{Carrier}</th>
            </tr>
            <tr>
              <th className="text-success">AGENT</th>
              <th className="text-secondary">{Agent}</th>
            </tr>
            <tr>
              <th className="text-success">VESSEL</th>
              <th className="text-secondary">{Vessel}</th>
            </tr>
            {CY ? (
              <tr>
                <th className="text-success">CY</th>
                <th className="text-secondary">{CY}</th>
              </tr>
            ) : null}
            {Commodity ? (
              <tr>
                <th className="text-success">COMMODITY</th>
                <th className="text-secondary">{Commodity}</th>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="col-4 px-4 py-4">
        <Popover2
          content={
            <Menu className="font-weight-bold text-uppercase">
              <MenuItem text="In Progress" className="text-success" />
              <MenuItem text="Invoiced" className="text-warning" />
              <MenuItem text="Done" className="text-danger" />
              <MenuItem text="Approved" disabled={true} />
              <MenuItem text="Closed" disabled={true} />
            </Menu>
          }
          fill={true}
        >
          {Closed && (
            <Button
              text={Closed == "0" ? "OPEN" : "CLOSED"}
              disabled={Closed != "0"}
              rightIcon="caret-down"
              fill={true}
            ></Button>
          )}
        </Popover2>

        <div className="text-secondary mt-2">
          <p>
            Created{" "}
            {Created &&
              moment(
                moment(Created).utc().format("YYYY-MM-DD HH:mm:ss")
              ).fromNow()}{" "}
            by {Creator}
          </p>
          <p>
            Updated{" "}
            {Updated &&
              moment(
                moment(Updated).utc().format("YYYY-MM-DD HH:mm:ss")
              ).fromNow()}{" "}
            by {Updator}
          </p>
          <p>
            Post{" "}
            {Post &&
              moment(
                moment(Post).utc().format("YYYY-MM-DD HH:mm:ss")
              ).fromNow()}
          </p>
        </div>
        <hr />
        <div className="d-flex justify-content-between">
          <div className="font-weight-bold">Ship: </div>
          <div>{moment(ETD).isValid && moment(ETD).utc().format("L")}</div>
        </div>
        <div className="text-right text-gray-500 text-xs">{Loading}</div>
        <div className="d-flex justify-content-between my-1">
          <div className="font-weight-bold">Arrival: </div>
          <div>{moment(ETA).isValid && moment(ETA).utc().format("L")}</div>
        </div>
        <div className="text-right text-gray-500 text-xs">{Discharge}</div>
        <div className="d-flex justify-content-between my-1">
          <div className="font-weight-bold">Delivery: </div>
          <div>
            {FETA &&
              (typeof FETA === "string"
                ? moment(FETA).isValid && moment(FETA).utc().format("L")
                : FETA.length && moment(FETA).utc().format("L"))}
          </div>
        </div>
        <div className="text-right text-gray-500 text-xs">{Destination}</div>
      </div>
    </div>
  </div>
);
export default Master;
