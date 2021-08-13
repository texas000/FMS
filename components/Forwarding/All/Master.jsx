import moment from "moment";
import { Popover2 } from "@blueprintjs/popover2";
import { Menu, MenuItem, Tag, Button } from "@blueprintjs/core";
import useSWR from "swr";
import { useState } from "react";
import { useEffect } from "react";

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
	Reference,
	PPCC,
}) => {
	const { data, mutate } = useSWR("/api/forwarding/getstatus?id=" + Reference);
	async function updateStatus(e) {
		const status = await fetch("/api/forwarding/statuscp", {
			headers: {
				ref: Reference,
				text: e,
			},
		});
		if (status.status === 200) {
			mutate();
		}
	}
	return (
		<div className="card my-4 shadow">
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-0 p-3 sm:gap-2">
				{/* MASTER INFO */}
				<div className="flex items-center flex-col my-auto col-span-2">
					<div className="w-100">
						<div className="grid grid-flow-col gap-2 text-center">
							{MoveType && (
								<div className="w-100 bg-green-600 text-white rounded-sm">
									{MoveType}
								</div>
							)}
							{LCLFCL && (
								<div className="w-100 bg-green-600 text-white rounded-sm">
									{LCLFCL == "F" ? "FCL" : "LCL"}
								</div>
							)}
							{IT && (
								<div className="w-100 bg-green-600 text-white rounded-sm">
									IT
								</div>
							)}
							{Express == "1" && (
								<div className="w-100 bg-green-600 text-white rounded-sm">
									EXPRESS
								</div>
							)}
							{Empty != "0" && (
								<div className="w-100 bg-green-600 text-white rounded-sm">
									EMPTY
								</div>
							)}
							{PPCC && (
								<div className="w-100 bg-green-600 text-white rounded-sm">
									{PPCC === "P" ? "PREPAID" : "COLLECT"}
								</div>
							)}
						</div>
					</div>

					<table className="table-hover mt-2 table-sm w-100">
						<tbody>
							<tr className="border-b border-green-400">
								<th className="text-green-500">MBL</th>
								<th className="font-normal">{MBL}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">CARRIER</th>
								<th className="font-normal">{Carrier}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">AGENT</th>
								<th className="font-normal">{Agent}</th>
							</tr>
							<tr className="border-b border-green-400">
								<th className="text-green-500">VESSEL</th>
								<th className="font-normal">{Vessel}</th>
							</tr>
							{CY ? (
								<tr className="border-b border-green-400">
									<th className="text-green-500">CY</th>
									<th className="font-normal">{CY}</th>
								</tr>
							) : null}
							{Commodity ? (
								<tr className="border-b border-green-400">
									<th className="text-green-500">COMMODITY</th>
									<th className="font-normal">{Commodity}</th>
								</tr>
							) : null}
						</tbody>
					</table>
				</div>

				{/* ACTION AND SHIPMENT ROUTE */}
				<div className="px-2 py-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
						<div>
							<Popover2
								content={
									<Menu className="text-uppercase">
										<MenuItem
											text="In Progress"
											onClick={() => updateStatus("In Progress")}
										/>
										<MenuItem
											text="Booking Confirmed"
											onClick={() => updateStatus("Booking Confirmed")}
										/>
										<MenuItem
											text="ISF Field"
											onClick={() => updateStatus("ISF Field")}
										/>
										<MenuItem
											text="Customs Cleared"
											onClick={() => updateStatus("Customs Cleared")}
										/>
										<MenuItem
											text="Available for Pickup"
											onClick={() => updateStatus("Available for Pickup")}
										/>
										<MenuItem
											text="Delivered"
											onClick={() => updateStatus("Delivered")}
										/>
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
						</div>
						<div>
							<Popover2
								content={
									<Menu className="text-uppercase">
										<MenuItem
											text="COPY LINK"
											onClick={Clipboard}
											icon="clipboard"
										/>
										<MenuItem
											text="SEND EMAIL"
											onClick={() => window.open(Email)}
											icon="envelope"
										/>
									</Menu>
								}
								fill={true}
							>
								<button className="font-weight-bold w-100 bg-gray-200 text-gray-700 p-1 rounded-sm hover:bg-gray-300">
									ACTION <i className="ml-2 fa fa-caret-down"></i>
								</button>
							</Popover2>
						</div>
					</div>
					<div className="divide-y gap-2">
						<div className="leading-loose my-3">
							<p>
								Created{" "}
								{Created &&
									moment(
										moment(Created).utc().format("YYYY-MM-DD HH:mm:ss")
									).fromNow()}{" "}
								by <span className="text-uppercase">{Creator}</span>
							</p>
							<p>
								Updated{" "}
								{Updated &&
									moment(
										moment(Updated).utc().format("YYYY-MM-DD HH:mm:ss")
									).fromNow()}{" "}
								by <span className="text-uppercase">{Updator}</span>
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
								<div>
									{moment(ETD).isValid && moment(ETD).utc().format("L")}
								</div>
							</div>
							<div className="text-right text-gray-500 text-xs">{Loading}</div>
							<div className="d-flex justify-content-between my-1">
								<div className="font-weight-bold">Arrival: </div>
								<div>
									{moment(ETA).isValid && moment(ETA).utc().format("L")}
								</div>
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
