import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import paginationFactory, {
	PaginationProvider,
	PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory, {
	textFilter,
	selectFilter,
} from "react-bootstrap-table2-filter";
import { Dialog, Classes, Button } from "@blueprintjs/core";
import { Fragment, useState } from "react";
import Head from "next/head";

import moment from "moment";
import router from "next/router";
import ApManageDialog from "../components/Request/ApManageDialog";

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
			redirect: {
				permanent: false,
				destination: "/login",
			},
		};
	}
}
export default function request(props) {
	const [selected, setSelected] = useState(false);
	const { data, mutate } = useSWR("/api/requests/get");
	const { data: invoice } = useSWR("api/requests/getInvoiceList");
	const { data: crdr } = useSWR("api/requests/getCrdrList");
	const { data: ap } = useSWR(
		selected
			? `/api/requests/detail?table=${selected.TBNAME}&id=${selected.TBID}`
			: null
	);

	function filterHeader(column, colIndex, { sortElement, filterElement }) {
		return (
			<div
				style={{
					display: "flex",
					flexDirection: "column",
				}}
			>
				{column.text}
				{filterElement}
				{sortElement}
			</div>
		);
	}

	const selectOptions = {
		101: "REQUESTED",
		110: "DIRECTOR REJECTED",
		111: "DIRECTOR",
		120: "ACCOUNTING REJECTED",
		121: "APPROVED",
		131: "APPROVED BY CEO",
	};

	const selectInvoiceOptions = {
		101: "REQUESTED",
		110: "REJECTED",
		111: "APPROVED",
	};
	// AP TABLE COLUMN HERE
	// QUERY BY URGENT
	const column = [
		{
			dataField: "REFNO",
			text: "REFERENCE",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			formatter: (cell, row) => (
				<div>
					{row.URGENT ? (
						<i className="material-icons text-red-500 absolute -left-1">
							priority_high
						</i>
					) : (
						""
					)}
					{cell}
				</div>
			),
			headerFormatter: filterHeader,
		},
		{
			dataField: "VENDOR",
			text: "VENDOR",
			classes: "text-uppercase cursor-pointer",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			classes: "truncate sm:px-0 px-4",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			headerFormatter: filterHeader,
		},
		{
			dataField: "INVOICE",
			text: "INVOICE",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "TYPE",
			text: "TYPE",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "STATUS",
			text: "STATUS",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: selectFilter({
				className: "text-xs text-center hidden sm:block",
				options: selectOptions,
			}),
			formatter: (cell) => (
				<div
					className={`text-xs rounded text-center ${
						cell == (121 || 131)
							? "bg-blue-500 text-white"
							: cell == 101
							? "bg-white border border-gray-800 text-gray-500"
							: cell == 110 || cell == 120
							? "bg-red-500 text-white"
							: "bg-gray-400 text-white"
					}`}
				>
					{selectOptions[cell]}
				</div>
			),
			headerFormatter: filterHeader,
		},
		{
			dataField: "Creator",
			text: "CREATOR",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "CREATED",
			text: "CREATED",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
			formatter: (cell) => {
				if (cell) {
					return moment(cell).utc().format("lll");
				}
			},
		},
	];

	const invoiceColumn = [
		{
			dataField: "REFNO",
			text: "REFERENCE",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "BILLTO",
			text: "CUSTOMER",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			classes: "truncate sm:px-0 px-4",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			headerFormatter: filterHeader,
		},
		{
			dataField: "INVOICE",
			text: "INVOICE",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "STATUS",
			text: "STATUS",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: selectFilter({
				className: "text-xs text-center hidden sm:block",
				options: selectInvoiceOptions,
			}),
			formatter: (cell) => (
				<div
					className={`text-xs rounded text-center ${
						cell == 101
							? "bg-white border border-gray-800 text-gray-500"
							: cell == 111
							? "bg-blue-500 text-white"
							: "bg-red-500 text-white"
					}`}
				>
					{selectInvoiceOptions[cell]}
				</div>
			),
			headerFormatter: filterHeader,
		},
		{
			dataField: "CREATOR",
			text: "CREATOR",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "CREATED",
			text: "CREATED",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			classes: "truncate sm:px-0 px-4",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			headerFormatter: filterHeader,
			formatter: (cell) => {
				if (cell) {
					return moment(cell).utc().format("lll");
				}
			},
		},
	];

	const crdrColumn = [
		{
			dataField: "REFNO",
			text: "REFERENCE",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "AGENT",
			text: "AGENT",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			classes: "truncate sm:px-0 px-4",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			headerFormatter: filterHeader,
		},
		{
			dataField: "CRDB",
			text: "CRDR REF",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "STATUS",
			text: "STATUS",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: selectFilter({
				className: "text-xs text-center hidden sm:block",
				options: selectInvoiceOptions,
			}),
			formatter: (cell) => (
				<div
					className={`text-xs rounded text-center ${
						cell == 101
							? "bg-white border border-gray-800 text-gray-500"
							: cell == 111
							? "bg-blue-500 text-white"
							: "bg-red-500 text-white"
					}`}
				>
					{selectInvoiceOptions[cell]}
				</div>
			),
			headerFormatter: filterHeader,
		},
		{
			dataField: "CREATOR",
			text: "CREATOR",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			classes: "truncate sm:px-0 px-4",
			headerFormatter: filterHeader,
		},
		{
			dataField: "CREATED",
			text: "CREATED",
			headerClasses:
				"text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
			classes: "truncate sm:px-0 px-4",
			filter: textFilter({
				className: "text-xs text-center hidden sm:block",
			}),
			headerFormatter: filterHeader,
			formatter: (cell) => {
				if (cell) {
					return moment(cell).utc().format("lll");
				}
			},
		},
	];

	const pageOption = {
		sizePerPageList: [{ text: "10", value: 10 }],
		custom: true,
	};

	const rowEvents = {
		onClick: (e, row, rowIndex) => {
			setSelected(row);
		},
	};

	const invoiceRowEvents = {
		onClick: (e, row, rowIndex) => {
			router.push(row.PATH);
		},
	};

	async function updateRequest(approve) {
		// UPDATE STATUS AND SEND MAIL TO RELATED
		const res = await fetch(`/api/requests/update?approve=${approve}`, {
			method: "POST",
			body: JSON.stringify(selected),
		});
		if (res.ok) {
			mutate();
			setSelected(false);
		}
	}

	const { ExportCSVButton } = CSVExport;

	return (
		<Layout TOKEN={props.token} TITLE="Dashboard" LOADING={!data}>
			<Head>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
				/>
			</Head>
			<div className="flex flex-sm-row justify-between">
				<h3 className="dark:text-white">Account Payable</h3>
			</div>
			<div className="card border-0 py-3 px-0 shadow mt-3 overflow-x-auto">
				<ToolkitProvider
					keyField="ID"
					bordered={false}
					columns={column}
					data={data ? data : []}
					exportCSV
					search
				>
					{(props) => (
						<PaginationProvider pagination={paginationFactory(pageOption)}>
							{({ paginationProps, paginationTableProps }) => (
								<div className="flex flex-col">
									<div className="flex flex-row-reverse mr-2">
										<PaginationListStandalone {...paginationProps} />
										<ExportCSVButton {...props.csvProps}>
											<svg
												width="24"
												height="24"
												xmlns="http://www.w3.org/2000/svg"
												fill-rule="evenodd"
												clip-rule="evenodd"
												className="fill-current text-indigo-500"
											>
												<path d="M16.965 2.381c3.593 1.946 6.035 5.749 6.035 10.119 0 6.347-5.153 11.5-11.5 11.5s-11.5-5.153-11.5-11.5c0-4.37 2.442-8.173 6.035-10.119l.608.809c-3.353 1.755-5.643 5.267-5.643 9.31 0 5.795 4.705 10.5 10.5 10.5s10.5-4.705 10.5-10.5c0-4.043-2.29-7.555-5.643-9.31l.608-.809zm-4.965-2.381v14.826l3.747-4.604.753.666-5 6.112-5-6.101.737-.679 3.763 4.608v-14.828h1z" />
											</svg>
										</ExportCSVButton>
									</div>
									<BootstrapTable
										{...props.baseProps}
										{...paginationTableProps}
										rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer dark:bg-gray-700 dark:text-white"
										condensed
										rowStyle={{ cursor: "pointer" }}
										filter={filterFactory()}
										wrapperClasses="rounded table-fixed mx-0 px-0"
										bordered={false}
										// pagination={paginationFactory(pageOption)}
										rowEvents={rowEvents}
									/>
								</div>
							)}
						</PaginationProvider>
					)}
				</ToolkitProvider>
			</div>
			<div className="flex flex-sm-row mt-4 justify-between">
				<h3 className="dark:text-white">Invoice</h3>
			</div>

			<div className="card border-0 py-3 px-0 shadow my-3 overflow-x-auto">
				<ToolkitProvider
					keyField="ID"
					bordered={false}
					columns={invoiceColumn}
					data={invoice ? invoice : []}
					exportCSV
					search
				>
					{(props) => (
						<PaginationProvider pagination={paginationFactory(pageOption)}>
							{({ paginationProps, paginationTableProps }) => (
								<div className="flex flex-col">
									<div className="flex flex-row-reverse mr-2">
										<PaginationListStandalone {...paginationProps} />
										<ExportCSVButton {...props.csvProps}>
											<svg
												width="24"
												height="24"
												xmlns="http://www.w3.org/2000/svg"
												fill-rule="evenodd"
												clip-rule="evenodd"
												className="fill-current text-indigo-500"
											>
												<path d="M16.965 2.381c3.593 1.946 6.035 5.749 6.035 10.119 0 6.347-5.153 11.5-11.5 11.5s-11.5-5.153-11.5-11.5c0-4.37 2.442-8.173 6.035-10.119l.608.809c-3.353 1.755-5.643 5.267-5.643 9.31 0 5.795 4.705 10.5 10.5 10.5s10.5-4.705 10.5-10.5c0-4.043-2.29-7.555-5.643-9.31l.608-.809zm-4.965-2.381v14.826l3.747-4.604.753.666-5 6.112-5-6.101.737-.679 3.763 4.608v-14.828h1z" />
											</svg>
										</ExportCSVButton>
									</div>
									<BootstrapTable
										{...props.baseProps}
										{...paginationTableProps}
										rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer dark:bg-gray-700 dark:text-white"
										condensed
										rowStyle={{ cursor: "pointer" }}
										filter={filterFactory()}
										wrapperClasses="rounded table-fixed mx-0 px-0"
										bordered={false}
										rowEvents={invoiceRowEvents}
									/>
								</div>
							)}
						</PaginationProvider>
					)}
				</ToolkitProvider>
			</div>

			<div className="flex flex-sm-row mt-4 justify-between">
				<h3 className="dark:text-white">Credit Debit</h3>
			</div>

			<div className="card border-0 py-3 px-0 shadow my-3 overflow-x-auto">
				<ToolkitProvider
					keyField="ID"
					bordered={false}
					columns={crdrColumn}
					data={crdr ? crdr : []}
					exportCSV
					search
				>
					{(props) => (
						<PaginationProvider pagination={paginationFactory(pageOption)}>
							{({ paginationProps, paginationTableProps }) => (
								<div className="flex flex-col">
									<div className="flex flex-row-reverse mr-2">
										<PaginationListStandalone {...paginationProps} />
										<ExportCSVButton {...props.csvProps}>
											<svg
												width="24"
												height="24"
												xmlns="http://www.w3.org/2000/svg"
												fill-rule="evenodd"
												clip-rule="evenodd"
												className="fill-current text-indigo-500"
											>
												<path d="M16.965 2.381c3.593 1.946 6.035 5.749 6.035 10.119 0 6.347-5.153 11.5-11.5 11.5s-11.5-5.153-11.5-11.5c0-4.37 2.442-8.173 6.035-10.119l.608.809c-3.353 1.755-5.643 5.267-5.643 9.31 0 5.795 4.705 10.5 10.5 10.5s10.5-4.705 10.5-10.5c0-4.043-2.29-7.555-5.643-9.31l.608-.809zm-4.965-2.381v14.826l3.747-4.604.753.666-5 6.112-5-6.101.737-.679 3.763 4.608v-14.828h1z" />
											</svg>
										</ExportCSVButton>
									</div>
									<BootstrapTable
										{...props.baseProps}
										{...paginationTableProps}
										rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer dark:bg-gray-700 dark:text-white"
										condensed
										rowStyle={{ cursor: "pointer" }}
										filter={filterFactory()}
										wrapperClasses="rounded table-fixed mx-0 px-0"
										bordered={false}
										rowEvents={invoiceRowEvents}
									/>
								</div>
							)}
						</PaginationProvider>
					)}
				</ToolkitProvider>
			</div>

			<Dialog
				isOpen={selected}
				onClose={() => {
					setSelected(false);
				}}
				title="Manage Request"
				className="dark:bg-gray-600"
			>
				<div className={`${Classes.DIALOG_BODY} h-100`}>
					<ApManageDialog selected={selected} ap={ap} />
				</div>

				<div
					className={`${Classes.DIALOG_FOOTER} d-flex justify-content-between`}
				>
					<Button
						text="Approve"
						fill={true}
						onClick={() => updateRequest(true)}
						disabled={
							props.token.admin === 6 || props.token.admin === 5
								? !(selected.STATUS === 101 || selected.STATUS === 110)
								: props.token.admin === 9
								? selected.STATUS !== 111
								: true
						}
					/>
					<Button
						text="Reject"
						fill={true}
						minimal={true}
						onClick={() => updateRequest(false)}
						disabled={
							props.token.admin === 6 || props.token.admin === 5
								? selected.STATUS !== 101
								: props.token.admin === 9
								? selected.STATUS !== 111
								: true
						}
					/>
					{/* WHEN REQUEST HAPPEN, UPLOAD TO DATABASE AND SEND THE NOTIFICATION TO IAN */}
				</div>
			</Dialog>
		</Layout>
	);
}
