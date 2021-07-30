import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Card, Col, Row } from "reactstrap";
import { Dialog, Classes, Tag, Button } from "@blueprintjs/core";
import { useState } from "react";
import usdFormat from "../lib/currencyFormat";
import moment from "moment";

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		return {
			props: {
				token: token,
			},
		};
	} catch (err) {
		return {
			props: { token: false },
		};
	}
}
export default function request(props) {
	const [selected, setSelected] = useState(false);
	const { data } = useSWR("/api/requests/get");
	const { data: ap } = useSWR(
		selected
			? `/api/requests/detail?table=${selected.TBName}&id=${selected.TBID}`
			: null
	);

	function filterHeader(column, colIndex, { sortElement, filterElement }) {
		return (
			<div style={{ display: "flex", flexDirection: "column" }}>
				{column.text}
				{filterElement}
				{sortElement}
			</div>
		);
	}

	const Status = ({ data }) => {
		if (data == 101) {
			return <span className="text-success font-weight-bold">Requested</span>;
		}
		if (data == 110) {
			return <span className="text-danger font-weight-bold">Dir Rejected</span>;
		}
		if (data == 111) {
			return (
				<span className="text-success font-weight-bold">Dir Approved</span>
			);
		}
		if (data == 120) {
			return <span className="text-danger font-weight-bold">Acc Rejected</span>;
		}
		if (data == 121) {
			return (
				<span className="text-success font-weight-bold">Acc Approved</span>
			);
		}
	};

	const column = [
		{
			dataField: "RefNo",
			text: "REFERENCE",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			filter: textFilter({
				className: "text-xs text-center d-sm-none d-md-block",
			}),
			headerFormatter: filterHeader,
		},
		{
			dataField: "Title",
			text: "TITLE",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			filter: textFilter({
				className: "text-xs text-center d-sm-none d-md-block",
			}),
			headerFormatter: filterHeader,
		},
		{
			dataField: "Status",
			text: "STATUS",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			filter: textFilter({
				className: "text-xs text-center d-none d-xl-block",
			}),
			formatter: (cell) => {
				if (cell) {
					return <Status data={cell} />;
				}
			},
			headerFormatter: filterHeader,
		},
		{
			dataField: "ApType",
			text: "TYPE",
			classes: "text-uppercase",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			filter: textFilter({
				className: "text-xs text-center d-none d-xl-block",
			}),
			headerFormatter: filterHeader,
		},
		{
			dataField: "Creator",
			text: "CREATOR",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			filter: textFilter({
				className: "text-xs text-center d-none d-xl-block",
			}),
			headerFormatter: filterHeader,
		},
		{
			dataField: "CreateAt",
			text: "CREATED",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			filter: textFilter({
				className: "text-xs text-center d-none d-xl-block",
			}),
			headerFormatter: filterHeader,
			formatter: (cell) => {
				if (cell) {
					return moment(cell).utc().add(1, "days").calendar();
				}
			},
		},
	];

	const rowEvents = {
		onClick: (e, row, rowIndex) => {
			setSelected(row);
		},
	};

	async function updateRequest(approve) {
		// if (approve) {
		// 	console.log("APPROVE");
		// 	return;
		// }
		// console.log("REJECT");

		// UPDATE STATUS AND SEND MAIL TO RELATED
		const res = await fetch(
			`/api/requests/update?id=${selected.ID}&approve=${approve}`
		);
		console.log(res.status);
	}

	return (
		<Layout TOKEN={props.token} TITLE="Dashboard">
			<div className="d-flex flex-sm-row justify-content-between">
				<div>
					<h3 className="h3 text-dark">
						Request <small className="text-gray-500">Demo</small>
					</h3>
				</div>
			</div>
			<Card className="border-0 shadow mt-3">
				<Row>
					<ToolkitProvider
						keyField="ID"
						bordered={false}
						columns={column}
						data={data ? data : []}
						exportCSV
						search
					>
						{(props) => (
							<Col>
								<BootstrapTable
									{...props.baseProps}
									hover
									condensed
									filter={filterFactory()}
									wrapperClasses="table-responsive rounded"
									bordered={false}
									rowEvents={rowEvents}
								/>
							</Col>
						)}
					</ToolkitProvider>
				</Row>
			</Card>
			<Dialog
				isOpen={selected}
				onClose={() => {
					setSelected(false);
				}}
				title="Manage Request"
			>
				<div className={`${Classes.DIALOG_BODY} h-100`}>
					<h5>Would you like to accept request?</h5>
					<div className="card">
						<div className="card-header font-weight-bold">
							<div className="d-flex text-dark justify-content-between">
								<span>{selected.Title}</span>
							</div>
						</div>
						{/* RefNo */}
						<div className="card-body">
							<p className="font-weight-bold">Reference: {selected.RefNo}</p>
							<p>
								Status: <Status data={selected.Status} />
							</p>
							<p>
								Type: <mark className="text-uppercase">{selected.ApType}</mark>
							</p>
							<p>
								Requested: {moment(selected.CreateAt).utc().format("LLL")} by{" "}
								{selected.Creator}
							</p>
							{ap ? (
								<div>
									<p>
										Request Amount:{" "}
										<mark className="font-weight-bold">
											{usdFormat(ap.F_InvoiceAmt)}
										</mark>
									</p>
									<ul className="list-group">
										{ap.Detail.length &&
											ap.Detail.map((ga) => (
												<li
													key={ga.F_ID}
													className="list-group-item d-flex justify-content-between"
												>
													<span>{ga.F_Description}</span>
													<span>{usdFormat(ga.F_Amount)}</span>
												</li>
											))}
									</ul>
								</div>
							) : (
								<div></div>
							)}

							<Tag
								icon="cloud-download"
								interactive={true}
								intent="primary"
								className="p-2 my-2"
								onClick={async () => {
									window.location.assign(
										`/api/file/get?ref=${
											selected.RefNo
										}&file=${encodeURIComponent(selected.F1)}`
									);
								}}
							>
								{selected.F1}
							</Tag>
							{selected.F2 && (
								<Tag
									icon="cloud-download"
									interactive={true}
									intent="primary"
									className="p-2 my-2 mx-2"
									onClick={async () => {
										window.location.assign(
											`/api/file/get?ref=${
												selected.RefNo
											}&file=${encodeURIComponent(selected.F2)}`
										);
									}}
								>
									{selected.F2}
								</Tag>
							)}
						</div>
					</div>
				</div>

				<div
					className={`${Classes.DIALOG_FOOTER} d-flex justify-content-between`}
				>
					<Button
						text="Approve"
						fill={true}
						onClick={() => updateRequest(true)}
						disabled={
							props.token.admin === 6
								? selected.Status !== 101
								: props.token.admin === 9
								? selected.Status !== 111
								: true
						}
					/>
					<Button
						text="Reject"
						fill={true}
						minimal={true}
						onClick={() => updateRequest(false)}
						disabled={
							props.token.admin === 6
								? selected.Status !== 101
								: props.token.admin === 9
								? selected.Status !== 111
								: true
						}
					/>
					{/* WHEN REQUEST HAPPEN, UPLOAD TO DATABASE AND SEND THE NOTIFICATION TO IAN */}
				</div>
			</Dialog>
		</Layout>
	);
}
