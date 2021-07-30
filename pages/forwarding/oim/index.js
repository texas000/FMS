import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Card, Row, Col, Spinner } from "reactstrap";
import moment from "moment";
import Link from "next/link";
import useSWR from "swr";

const Index = ({ Cookie }) => {
	const [Page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const { data, mutate } = useSWR(
		`/api/forwarding/oim/pagination?page=${Page}&size=${pageSize}`
	);
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const [Result, setResult] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [selected, setSelected] = useState(false);
	const [houses, setHouses] = useState([]);

	const router = useRouter();

	// INDICATION FOR TABLE
	function indication() {
		return (
			<span>
				<span className="text-danger">No Ocean Import</span> at the moment
			</span>
		);
	}

	//  PAGE BUTTON TO NAVIGATE
	const pageButtonRenderer = ({
		page,
		active,
		disabled,
		title,
		onPageChange,
	}) => {
		const handleClick = (e) => {
			e.preventDefault();
			onPageChange(page);
			if (page === ">") {
				setPage(Page + 1);
			}
			if (page === "<") {
				if (Page !== 1) {
					setPage(Page - 1);
				}
			}
			// if (page === ">>") {
			// 	setPage(Page + 10);
			// }
			// if (page === "<<") {
			// 	setPage(1);
			// }
			// mutate();
		};
		return (
			<li className="page-item" key={page}>
				<a
					href="#"
					onClick={handleClick}
					className={`${active && "btn-primary"} btn btn-sm ${
						(page === ">>" || page === "<<") && "d-none"
					}`}
				>
					{typeof page === "number" ? page + Page - 1 : page}
				</a>
			</li>
		);
	};

	// Custom Total Data for Table
	const customTotal = (from, to, size) => (
		<span className="react-bootstrap-table-pagination-total ml-2">
			Showing {from} to {to} of {size} Results
		</span>
	);

	// Custom Page Size
	const customSizePerPage = [
		{ page: 10, text: "10" },
		{ page: 50, text: "50" },
		{ page: 100, text: "100" },
		{ page: 200, text: "200" },
	];

	const sizePerPageRenderer = ({
		options,
		currSizePerPage,
		onSizePerPageChange,
	}) => (
		<div className="page-item ml-2" role="group">
			{customSizePerPage.map((option) => {
				const isSelect = currSizePerPage == `${option.page}`;
				return (
					<a
						key={option.text}
						onClick={() => {
							onSizePerPageChange(option.page);
							setPageSize(option.page);
							mutate();
							// onSizePerPageChange(option.page);
						}}
						small="true"
						className={isSelect ? "btn btn-sm btn-primary" : "btn btn-sm"}
					>
						{option.text}
					</a>
				);
			})}
		</div>
	);

	const headerSortingStyle = { backgroundColor: "#c9d5f5" };
	const column = [
		{
			dataField: "F_RefNo",
			text: "REFERENCE",
			formatter: (cell) => (
				<Link href={`/forwarding/oim/${cell}`}>
					<a>{cell}</a>
				</Link>
			),
			classes: "text-center text-truncate text-uppercase",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			headerSortingStyle,
		},
		{
			dataField: "Company",
			text: "CUSTOMER",
			classes: "text-truncate",
			headerClasses: "text-dark text-center align-middle pb-0 font-weight-bold",
			sort: true,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			headerSortingStyle,
		},
		{
			dataField: "F_MBLNo",
			text: "MASTER BL",
			classes: "text-truncate",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			headerSortingStyle,
		},
		// {
		// 	dataField: "F_HBLNo",
		// 	text: "HBL",
		// 	classes: "text-truncate",
		// 	headerClasses:
		// 		"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
		// 	sort: true,
		// 	filter: textFilter({
		// 		className: "text-xs text-center",
		// 	}),
		// 	headerSortingStyle,
		// },
		{
			dataField: "F_ETD",
			text: "DISCHARGE",
			classes: "text-truncate",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			headerSortingStyle,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			formatter: (cell) => {
				if (cell) {
					return moment(cell).format("L");
				}
			},
		},
		{
			dataField: "F_ETA",
			text: "ARRIVAL",
			classes: "text-truncate",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			headerSortingStyle,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			formatter: (cell) => {
				if (cell) {
					return moment(cell).format("L");
				}
			},
		},
		{
			dataField: "F_PostDate",
			text: "POST DATE",
			classes: "text-truncate",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			headerSortingStyle,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			formatter: (cell) => {
				if (cell) {
					return moment(cell).format("L");
				}
			},
		},
		{
			dataField: "F_U2ID",
			text: "EDITOR",
			classes: "text-truncate text-uppercase",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			headerSortingStyle,
			filter: textFilter({
				className: "text-xs text-center",
				defaultValue: TOKEN.admin === 9 ? "" : TOKEN.fsid,
			}),
		},
	];

	const pageOption = {
		// onSizePerPageChange: (sizePerPage, page) => {
		// 	setPageSize(sizePerPage);
		// 	setPage(page);
		// 	mutate();
		// },
		// onPageChange: (page, sizePerPage) => {
		// 	setPage(page);
		// 	setPageSize(sizePerPage);
		// 	console.log(page);
		// 	console.log(sizePerPage);
		// 	// mutate();
		// },
		alwaysShowAllBtns: true,
		showTotal: true,
		pageButtonRenderer,
		paginationTotalRenderer: customTotal,
		sizePerPageRenderer,
	};

	useEffect(() => {
		!TOKEN && router.push("/login");
		// getOim();
		// In the dev mode, show result in the console.
		// console.log(Result);
		// console.log(Page);
	}, []);

	async function getOimSearch(e) {
		if (e.length > 0) {
			const oims = await fetch("/api/forwarding/oim/getList", {
				headers: {
					key: Cookie.jamesworldwidetoken,
					search: e,
				},
			}).then(async (j) => await j.json());
			setResult(oims);
		} else {
			alert("SEARCH VALUE MUST BE OVER 3 CHAR");
		}
	}
	if (TOKEN && TOKEN.group) {
		return (
			<Layout TOKEN={TOKEN} TITLE="OCEAN IMPORT">
				{/* <Dialog
					isOpen={isOpen}
					title={selected.F_RefNo}
					onClose={() => setIsOpen(false)}
					className="bg-white w-75"
				>
					<MasterDialog refs={selected} multi={houses} token={TOKEN} />
				</Dialog> */}
				<div className="d-flex flex-sm-row justify-content-between">
					<div className="flex-column">
						<h3 className="h3 text-dark">Ocean Import</h3>
					</div>
					{/* <InputGroup
						leftIcon="search"
						type="number"
						placeholder="Search Number"
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								getOimSearch(e.target.value);
							}
						}}
					/> */}
				</div>

				{/* <div className="d-lg-none">
          <div className="list-group">
            {Result.length !== 0 ? (
              Result.map((ga) => (
                <a
                  href="#"
                  key={ga.oihmain.ID}
                  onClick={() => {
                    router.push(
                      `/forwarding/oim/[Detail]`,
                      `/forwarding/oim/${ga.oimmain.RefNo}`
                    );
                  }}
                  className="list-group-item list-group-item-action text-xs text-truncate"
                >
                  <span className="text-primary font-weight-bold">
                    {ga.oimmain.RefNo}
                  </span>
                  <i className="fa fa-arrow-right text-success mx-2"></i>
                  <span className="font-weight-light">
                    {ga.oihmain.Customer_SName}
                  </span>
                  <i className="fa fa-arrow-right text-warning mx-2"></i>
                  <span className="text-uppercase">{ga.oimmain.U2ID}</span>
                </a>
              ))
            ) : (
              <div
                className="alert alert-secondary text-capitalize"
                role="alert"
              >
                you do not have ocean import at the moment
              </div>
            )}
          </div>
        </div> */}

				<Card className="border-0 shadow mt-3 table-responsive">
					{!data ? (
						<div className="text-center">
							<Spinner color="primary" />
						</div>
					) : (
						<Row>
							{/* DISPLAY SEARCH RESULT */}
							<ToolkitProvider
								keyField="NUM"
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
											wrapperClasses="table rounded"
											bordered={false}
											filter={filterFactory()}
											noDataIndication={indication}
											pagination={paginationFactory(pageOption)}
										/>
									</Col>
								)}
							</ToolkitProvider>
						</Row>
					)}
				</Card>
			</Layout>
		);
	} else {
		return <p>Redirecting...</p>;
	}
};

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	return { props: { Cookie: cookies } };
}

export default Index;
