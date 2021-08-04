import moment from "moment";
import { Popover2 } from "@blueprintjs/popover2";
import { Menu, MenuItem, Tag, Button } from "@blueprintjs/core";

export const Master = ({
	M,
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
}) => (
	<div className="card my-4 py-4 shadow">
		<div className="row">
			<div className="col-8 px-4 py-4">
				<div className="d-flex justify-content-between text-center">
					<Tag intent="primary" className="w-100 mr-1">
						{M.F_Type}
					</Tag>
					{M.F_C1 && (
						<Tag intent="primary" className="w-100 mx-1">
							{M.F_C1}
						</Tag>
					)}
					{M.F_C2 && (
						<Tag intent="primary" className="w-100 mx-1">
							{M.F_C2}
						</Tag>
					)}
					{M.F_C3 && (
						<Tag intent="primary" className="w-100 mx-1">
							{M.F_C3}
						</Tag>
					)}
				</div>
				<table className="table table-hover mt-2 table-sm text-xs">
					<tbody>
						<tr>
							<th className="text-success">CUSTOMER</th>
							<th className="text-secondary">{M.CUSTOMER}</th>
						</tr>
						<tr>
							<th className="text-success">MBL</th>
							<th className="text-secondary">{M.F_Mblno}</th>
						</tr>
						<tr>
							<th className="text-success">HBL</th>
							<th className="text-secondary">{M.F_Hblno}</th>
						</tr>
						<tr>
							<th className="text-success">Commodity</th>
							<th className="text-secondary">{M.F_Commodity}</th>
						</tr>
						<tr>
							<th className="text-success">Reference Number</th>
							<th className="text-secondary">{M.F_CustRefNo}</th>
						</tr>
						<tr>
							<th className="text-success">Internal Memo</th>
							<th className="text-secondary">{M.F_IMemo}</th>
						</tr>
						<tr>
							<th className="text-success">Public Memo</th>
							<th className="text-secondary">{M.F_PMemo}</th>
						</tr>
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
					<div>{ETD != null && moment(ETD).utc().format("L")}</div>
				</div>
				<div className="text-right text-gray-500 text-xs">{Loading}</div>
				<div className="d-flex justify-content-between my-1">
					<div className="font-weight-bold">Arrival: </div>
					<div>{ETA != null && moment(ETA).utc().format("L")}</div>
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
