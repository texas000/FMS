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
		<div className="card my-4 py-4 shadow">
			<div className="row">
				<div className="col-lg-8 px-4 py-4">
					<div>
						<div className="d-flex justify-content-between text-center">
							{MoveType && (
								<Tag intent="primary" className="mx-1 w-100">
									{MoveType}
								</Tag>
							)}
							{LCLFCL && (
								<Tag
									intent={LCLFCL ? "primary" : "none"}
									className="mx-1 w-100"
								>
									{LCLFCL == "F" ? "FCL" : "LCL"}
								</Tag>
							)}
							{IT && (
								<Tag intent={IT ? "primary" : "none"} className="mx-1 w-100">
									IT
								</Tag>
							)}
							{Express && (
								<Tag
									intent={Express == "1" ? "primary" : "none"}
									className="mx-1 w-100"
								>
									EXPRESS
								</Tag>
							)}
							{Empty != "0" && (
								<Tag intent={Empty ? "primary" : "none"} className="mx-1 w-100">
									EMPTY
								</Tag>
							)}
							{PPCC && (
								<Tag intent="primary" className="mx-1 w-100">
									{PPCC === "P" ? "PREPAID" : "COLLECT"}
								</Tag>
							)}
						</div>
					</div>

					<table className="table table-hover mt-2 table-sm text-xs">
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

				<div className="col-lg-4 px-4 py-4">
					<div className="row">
						<div className="col">
							<Popover2
								content={
									<Menu className="font-weight-bold text-uppercase">
										<MenuItem
											text="In Progress"
											className="text-success"
											onClick={() => updateStatus("In Progress")}
										/>
										<MenuItem
											text="Booking Confirmed"
											className="text-primary"
											onClick={() => updateStatus("Booking Confirmed")}
										/>
										<MenuItem
											text="ISF Field"
											className="text-primary"
											onClick={() => updateStatus("ISF Field")}
										/>
										<MenuItem
											text="Customs Cleared"
											className="text-primary"
											onClick={() => updateStatus("Customs Cleared")}
										/>
										<MenuItem
											text="Available for Pickup"
											className="text-primary"
											onClick={() => updateStatus("Available for Pickup")}
										/>
										<MenuItem
											text="Delivered"
											className="text-primary"
											onClick={() => updateStatus("Delivered")}
										/>
										<MenuItem text="Approved" disabled={true} />
										<MenuItem text="Closed" disabled={true} />
									</Menu>
								}
								fill={true}
							>
								{Closed && (
									<Button
										text={
											Closed == "0"
												? data
													? data.STATUS || "ADD STATUS"
													: "OPEN"
												: "CLOSED"
										}
										disabled={Closed != "0"}
										className="font-weight-bold"
										rightIcon="caret-down"
										fill={true}
									></Button>
								)}
							</Popover2>
						</div>
						<div className="col">
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
								<Button
									text="ACTION"
									rightIcon="caret-down"
									className="font-weight-bold"
									fill={true}
								></Button>
							</Popover2>
						</div>
					</div>

					<div className="text-dark mt-2">
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
};
export default Master;
