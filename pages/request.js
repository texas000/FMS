import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Card, Col, Row, Progress } from "reactstrap";
import { Dialog, Classes, Tag, Button } from "@blueprintjs/core";
import { useState } from "react";
import usdFormat from "../lib/currencyFormat";
import moment from "moment";
import { BlobProvider } from "@react-pdf/renderer";
import CheckRequestForm from "../components/Dashboard/CheckRequestForm";

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
			return <span className="text-success font-weight-bold">REQUESTED</span>;
		}
		if (data == 110) {
			return (
				<span className="text-danger font-weight-bold">DIRECTOR REJECTED</span>
			);
		}
		if (data == 111) {
			return (
				<span className="text-success font-weight-bold">DIRECTOR APPROVED</span>
			);
		}
		if (data == 120) {
			return (
				<span className="text-danger font-weight-bold">
					ACCOUNTING REJECTED
				</span>
			);
		}
		if (data == 121) {
			return (
				<span className="text-success font-weight-bold">
					ACCOUNTING APPROVED
				</span>
			);
		}
	};

	const StatusBar = ({ data }) => {
		if (data == 101) {
			return (
				<Progress color="secondary" value="100">
					REQUESTED
				</Progress>
			);
		}
		if (data == 110) {
			return (
				<Progress color="danger" value="100">
					DIRECTOR REJECTED
				</Progress>
			);
		}
		if (data == 111) {
			return <Progress value="50">DIRECTOR APPROVED</Progress>;
		}
		if (data == 120) {
			return (
				<Progress color="danger" value="100">
					ACCOUNTING REJECTED
				</Progress>
			);
		}
		if (data == 121) {
			return (
				<Progress multi>
					<Progress bar value="50">
						DIRECTOR APPROVED
					</Progress>
					<Progress bar color="success" value="50">
						ACCOUNTING APPROVED
					</Progress>
				</Progress>
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
			dataField: "ApType",
			text: "TYPE",
			classes: "text-uppercase cursor-pointer",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			filter: textFilter({
				className: "text-xs text-center d-none d-xl-block",
			}),
			headerFormatter: filterHeader,
		},
		{
			dataField: "Title",
			text: "INVOICE",
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
					return <StatusBar data={cell} />;
				}
			},
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
					return moment(cell).utc().calendar();
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
			<Card className="border-0 shadow mt-3 table-responsive-md">
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
									rowStyle={{ cursor: "pointer" }}
									filter={filterFactory()}
									wrapperClasses="table rounded"
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
							<p>Customer: {selected.Body}</p>
							{ap ? (
								<div>
									<p>Vendor : {ap.Vendor}</p>
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
									{ap.Files.length &&
										ap.Files.map((ga) => (
											<Tag
												key={`${ga.TBID}FILE`}
												icon="cloud-download"
												interactive={true}
												intent="primary"
												className="p-2 my-2 mx-1"
												onClick={() => {
													window.location.assign(
														`/api/file/get?ref=${
															selected.RefNo
														}&file=${encodeURIComponent(ga.FILENAME)}`
													);
												}}
											>
												{ga.FILENAME}
											</Tag>
										))}
									<BlobProvider
										document={
											<CheckRequestForm
												oim={selected.RefNo}
												pic={selected.Creator}
												payto={ap.Vendor}
												customer={selected.Body}
												amt={ap.F_InvoiceAmt}
												type={selected.ApType.toUpperCase()}
												desc={ap.Detail.map(
													(ga) => `\t\t${ga.F_Description}\n`
												).join("")}
												inv={ap.F_InvoiceNo}
												due={
													ap.F_DueDate
														? moment(ap.F_DueDate).utc().format("L")
														: ""
												}
												approved={
													selected.Status === 111 || selected.Status === 121
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
												<Tag
													icon="cloud-download"
													interactive={true}
													intent="primary"
													className="p-2 my-2 ml-2"
												>
													Form
												</Tag>
											</a>
										)}
									</BlobProvider>
								</div>
							) : (
								<div></div>
							)}
							<p className="mt-2">
								Requested: {moment(selected.CreateAt).utc().format("LLL")} by{" "}
								{selected.Creator}
							</p>
							<p>
								Approved: {moment(selected.ModifyAt).utc().format("LLL")} by{" "}
								{selected.Modifier}
							</p>

							{/* {ap ? (
								<BlobProvider
									document={
										<CheckRequestForm
											oim={selected.RefNo}
											pic={selected.Creator}
											payto={ap.Vendor}
											customer={selected.Body}
											amt={ap.F_InvoiceAmt}
											type={selected.ApType.toUpperCase()}
											desc={ap.Detail.map(
												(ga) => `\t\t${ga.F_Description}\n`
											).join("")}
											inv={ap.F_InvoiceNo}
											due={
												ap.F_DueDate
													? moment(ap.F_DueDate).utc().format("L")
													: ""
											}
											approved={
												selected.Status === 111 || selected.Status === 121
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
											<Tag
												icon="cloud-download"
												interactive={true}
												intent="primary"
												className="p-2 my-2 ml-2"
											>
												Form
											</Tag>
										</a>
									)}
								</BlobProvider>
							) : (
								<></>
							)} */}
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