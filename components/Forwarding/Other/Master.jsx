import moment from "moment";
import { Popover2 } from "@blueprintjs/popover2";
import { Menu, MenuItem, Tag, Button } from "@blueprintjs/core";
import useSWR from "swr";

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
	Reference,
}) => {
	const { data, mutate } = useSWR("/api/forwarding/getstatus?id=" + Reference);
	return (
		<div className="card my-4 py-4 shadow">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-0 p-3 sm:gap-2">
				<div className="flex items-center flex-col my-auto col-span-2">
					<div className="w-100 grid grid-flow-col gap-2 text-center">
						<div className="w-100 bg-green-600 text-white rounded-sm">
							{M.F_Type}
						</div>
						{M.F_C1 && (
							<div className="w-100 bg-green-600 text-white rounded-sm">
								{M.F_C1}
							</div>
						)}
						{M.F_C2 && (
							<div className="w-100 bg-green-600 text-white rounded-sm">
								{M.F_C2}
							</div>
						)}
						{M.F_C3 && (
							<div className="w-100 bg-green-600 text-white rounded-sm">
								{M.F_C3}
							</div>
						)}
					</div>
					<table className="table-hover mt-2 table-sm w-100">
						<tbody>
							<tr className="border-b border-green-400">
								<th className="text-green-500">CUSTOMER</th>
								<th className="font-normal">{M.CUSTOMER}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">MBL</th>
								<th className="font-normal">{M.F_Mblno}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">HBL</th>
								<th className="font-normal">{M.F_Hblno}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">Commodity</th>
								<th className="font-normal">{M.F_Commodity}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">Reference Number</th>
								<th className="font-normal">{M.F_CustRefNo}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">Internal Memo</th>
								<th className="font-normal">{M.F_IMemo}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">Public Memo</th>
								<th className="font-normal">{M.F_PMemo}</th>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="px-4 py-4">
					<Popover2
						content={
							<Menu className="font-weight-bold text-uppercase">
								<MenuItem text="In Progress" />
								<MenuItem text="Invoiced" />
								<MenuItem text="Done" />
								<MenuItem text="Approved" disabled={true} />
								<MenuItem text="Closed" disabled={true} />
							</Menu>
						}
						fill={true}
					>
						{Closed && (
							<button
								disabled={Closed != "0"}
								className="font-weight-bold w-100 bg-gray-200 text-gray-700 p-1 rounded-sm hover:bg-gray-300"
							>
								{Closed == "0"
									? data
										? data.STATUS || "ADD STATUS"
										: "OPEN"
									: "CLOSED"}{" "}
								<i className="ml-2 fa fa-caret-down"></i>
							</button>
						)}
					</Popover2>
					<div className="divide-y gap-2">
						<div className="leading-loose my-3">
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
						<div>
							<div className="d-flex justify-content-between mt-3">
								<div className="font-weight-bold">Ship: </div>
								<div>{ETD != null && moment(ETD).utc().format("L")}</div>
							</div>
							<div className="text-right text-gray-500 text-xs">{Loading}</div>
							<div className="d-flex justify-content-between my-1">
								<div className="font-weight-bold">Arrival: </div>
								<div>{ETA != null && moment(ETA).utc().format("L")}</div>
							</div>
							<div className="text-right text-gray-500 text-xs">
								{Discharge}
							</div>
							<div className="d-flex justify-content-between my-1">
								<div className="font-weight-bold">Delivery: </div>
								<div>
									{FETA &&
										(typeof FETA === "string"
											? moment(FETA).isValid && moment(FETA).utc().format("L")
											: FETA.length && moment(FETA).utc().format("L"))}
								</div>
							</div>
							<div className="text-right text-gray-500 text-xs">
								{Destination}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Master;
