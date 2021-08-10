import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../components/Layout";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Card } from "reactstrap";
import moment from "moment";
import Link from "next/link";
import useSWR from "swr";

const Index = ({ token }) => {
	const [Page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(20);
	const { data, mutate } = useSWR(
		`/api/forwarding/aim/pagination?page=${Page}&size=${pageSize}`
	);

	// INDICATION FOR TABLE
	function indication() {
		return (
			<span>
				<span className="text-danger">No Air Import</span> at the moment
			</span>
		);
	}

	// HEADER STYLE FLEX COLUMN
	function filterHeader(column, colIndex, { sortElement, filterElement }) {
		return (
			<div style={{ display: "flex", flexDirection: "column" }}>
				{column.text}
				{filterElement}
				{sortElement}
			</div>
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
							// setPageSize(option.page);
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
				<Link href={`/forwarding/aim/${cell}`}>
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
			headerFormatter: filterHeader,
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
			headerFormatter: filterHeader,
		},
		{
			dataField: "F_MawbNo",
			text: "MASTER BL",
			classes: "text-truncate",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			headerSortingStyle,
			headerFormatter: filterHeader,
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
			text: "ETD",
			classes: "text-truncate",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			headerSortingStyle,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			headerFormatter: filterHeader,
			formatter: (cell) => {
				if (cell) {
					return moment(cell).format("L");
				}
			},
		},
		{
			dataField: "F_ETA",
			text: "ETA",
			classes: "text-truncate",
			headerClasses:
				"text-dark text-center px-4 align-middle pb-0 font-weight-bold",
			sort: true,
			headerSortingStyle,
			filter: textFilter({
				className: "text-xs text-center",
			}),
			headerFormatter: filterHeader,
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
			headerFormatter: filterHeader,
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
			headerFormatter: filterHeader,
			filter: textFilter({
				className: "text-xs text-center",
				// defaultValue: token.admin === 9 ? "" : token.fsid,
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

	return (
		<Layout TOKEN={token} TITLE="AIR IMPORT" LOADING={!data}>
			<div className="d-flex flex-sm-row justify-content-between">
				<div className="flex-column">
					<h3 className="h3 text-dark">Air Import</h3>
				</div>
			</div>

			<Card className="border-0 shadow mt-3 pb-3 w-auto">
				{!data ? (
					<></>
				) : (
					<ToolkitProvider
						keyField="NUM"
						bordered={false}
						columns={column}
						data={data ? data : []}
						exportCSV
						search
					>
						{(props) => (
							<BootstrapTable
								{...props.baseProps}
								hover
								condensed
								bordered={false}
								wrapperClasses="table w-auto"
								filter={filterFactory()}
								noDataIndication={indication}
								pagination={paginationFactory(pageOption)}
							/>
						)}
					</ToolkitProvider>
				)}
			</Card>
		</Layout>
	);
};

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

export default Index;

// import cookie from "cookie";
// import React, { useEffect, useState } from "react";
// import jwt from "jsonwebtoken";
// import Layout from "../../../components/Layout";
// import { useRouter } from "next/router";
// import BootstrapTable from "react-bootstrap-table-next";
// import ToolkitProvider from "react-bootstrap-table2-toolkit";
// import paginationFactory from "react-bootstrap-table2-paginator";
// import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
// import { Card, Row, Col } from "reactstrap";
// import moment from "moment";
// import { InputGroup, Button, Dialog } from "@blueprintjs/core";
// import MasterDialog from "../../../components/Dashboard/MasterDialog";
// import "@blueprintjs/core/lib/css/blueprint.css";
// import "quill/dist/quill.snow.css";

// const Index = ({ Cookie }) => {
//   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
//   const [Result, setResult] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [selected, setSelected] = useState(false);
//   const [houses, setHouses] = useState([]);

//   const router = useRouter();

//   function indication() {
//     return (
//       <span>
//         <span className="text-danger">No Air Import</span> at the moment
//       </span>
//     );
//   }

//   const pageButtonRenderer = ({
//     page,
//     active,
//     disabled,
//     title,
//     onPageChange,
//   }) => {
//     const handleClick = (e) => {
//       e.preventDefault();
//       onPageChange(page);
//     };
//     return (
//       <li className="page-item" key={page}>
//         <a
//           href="#"
//           onClick={handleClick}
//           className={
//             active ? "btn btn-sm btn-info text-xs" : "btn btn-sm text-xs"
//           }
//         >
//           {page}
//         </a>
//       </li>
//     );
//   };

//   const customTotal = (from, to, size) => (
//     <span className="react-bootstrap-table-pagination-total ml-2 text-xs text-secondary">
//       Showing {from} to {to} of {size} Results
//     </span>
//   );

//   const customSizePerPage = [
//     { page: 10, text: "10" },
//     { page: 50, text: "50" },
//     { page: 100, text: "100" },
//     { page: 200, text: "200" },
//     { page: 300, text: "300" },
//   ];

//   const sizePerPageRenderer = ({
//     options,
//     currSizePerPage,
//     onSizePerPageChange,
//   }) => (
//     <div className="btn-group" role="group">
//       {customSizePerPage.map((option) => {
//         const isSelect = currSizePerPage === `${option.page}`;
//         return (
//           <Button
//             key={option.text}
//             onClick={() => onSizePerPageChange(option.page)}
//             small={true}
//             style={
//               isSelect
//                 ? {
//                     color: "#fff",
//                     background: "#4e73df",
//                     borderRadius: "0",
//                   }
//                 : {
//                     color: "#4e73df",
//                     background: "#fff",
//                     borderRadius: "0",
//                   }
//             }
//             className="text-xs"
//           >
//             {option.text}
//           </Button>
//         );
//       })}
//     </div>
//   );
//   const rowEvents = {
//     onClick: (e, row, rowIndex) => {
//       var house = Result.filter((element) => element.F_ID[0] === row.F_ID[0]);
//       setHouses(house);
//       setIsOpen(true);
//       setSelected({
//         ...row,
//         Master: "T_AIMMAIN",
//         House: "T_AIHMAIN",
//         temp: "aim",
//       });
//     },
//   };
//   const headerSortingStyle = { backgroundColor: "#c9d5f5" };
//   const column = [
//     {
//       dataField: "F_RefNo",
//       text: "REF",
//       formatter: (cell) => <a href="#">{cell}</a>,
//       classes:
//         "text-xs text-center text-truncate text-uppercase font-weight-bold",
//       headerClasses:
//         "text-x text-white text-center align-middle px-4 bg-primary pb-0 font-weight-light",
//       sort: true,
//       filter: textFilter({
//         className: "text-xs bg-primary text-white border-0",
//       }),
//       headerSortingStyle,
//     },
//     {
//       dataField: "Customer",
//       text: "CUSTOMER",
//       classes: "text-xs text-truncate",
//       headerClasses:
//         "text-x w-25 text-white bg-primary text-center align-middle pb-0 font-weight-light",
//       sort: true,
//       filter: textFilter({
//         className: "text-xs w-100 bg-primary text-white border-0",
//       }),
//       headerSortingStyle,
//     },
//     {
//       dataField: "F_MawbNo",
//       text: "MBL",
//       classes: "text-xs text-truncate",
//       headerClasses:
//         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
//       sort: true,
//       filter: textFilter({
//         className: "text-xs bg-primary text-white border-0",
//       }),
//       headerSortingStyle,
//     },
//     {
//       dataField: "F_HawbNo",
//       text: "HBL",
//       classes: "text-xs text-truncate",
//       headerClasses:
//         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
//       sort: true,
//       filter: textFilter({
//         className: "text-xs bg-primary text-white border-0",
//       }),
//       headerSortingStyle,
//     },
//     {
//       dataField: "F_ETD",
//       text: "ETD",
//       classes: "text-xs text-truncate",
//       headerClasses:
//         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
//       sort: true,
//       headerSortingStyle,
//       filter: textFilter({
//         className: "text-xs bg-primary text-white border-0",
//       }),
//       formatter: (cell) => {
//         if (cell) {
//           if (moment(cell).isSameOrBefore(moment())) {
//             return moment(cell).format("L");
//           } else {
//             return (
//               <div className="text-primary">{moment(cell).format("L")}</div>
//             );
//           }
//         }
//       },
//     },
//     {
//       dataField: "F_ETA",
//       text: "ETA",
//       classes: "text-xs text-truncate",
//       headerClasses:
//         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
//       sort: true,
//       headerSortingStyle,
//       filter: textFilter({
//         className: "text-xs bg-primary text-white border-0",
//       }),
//       formatter: (cell) => {
//         if (cell) {
//           if (moment(cell).isSameOrBefore(moment())) {
//             return moment(cell).format("L");
//           } else {
//             return (
//               <div className="text-primary">{moment(cell).format("L")}</div>
//             );
//           }
//         }
//       },
//     },
//     {
//       dataField: "F_PostDate",
//       text: "POST",
//       classes: "text-xs text-truncate",
//       headerClasses:
//         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
//       sort: true,
//       headerSortingStyle,
//       filter: textFilter({
//         className: "text-xs bg-primary text-white border-0",
//       }),
//       formatter: (cell) => {
//         if (cell) {
//           if (moment(cell).isSameOrBefore(moment())) {
//             return moment(cell).format("L");
//           } else {
//             return (
//               <div className="text-primary">{moment(cell).format("L")}</div>
//             );
//           }
//         }
//       },
//     },
//     {
//       dataField: "F_U2ID[0]",
//       text: "EDITOR",
//       classes: "text-xs text-truncate text-uppercase",
//       headerClasses:
//         "text-x text-center text-white bg-primary px-4 align-middle pb-0 font-weight-light",
//       sort: true,
//       headerSortingStyle,
//       filter: textFilter({
//         className: "text-xs bg-primary text-white border-0",
//         defaultValue: TOKEN.fsid,
//       }),
//     },
//   ];

//   async function getAim() {
//     const oims = await fetch("/api/forwarding/aim/getList", {
//       headers: {
//         key: Cookie.jamesworldwidetoken,
//       },
//     }).then(async (j) => await j.json());
//     // console.log(oims);
//     setResult(oims);
//   }

//   useEffect(() => {
//     !TOKEN && router.push("/login");
//     getAim();
//     // In the dev mode, show result in the console.
//     // console.log(Result);
//   }, []);

//   async function getOimSearch(e) {
//     if (e.target.value.length > 2) {
//       const oims = await fetch("/api/forwarding/aim/getList", {
//         headers: {
//           key: Cookie.jamesworldwidetoken,
//           search: e.target.value,
//         },
//       }).then(async (j) => await j.json());
//       setResult(oims);
//     } else {
//       alert("SEARCH VALUE MUST BE OVER 3 CHAR");
//     }
//   }
//   if (TOKEN && TOKEN.group) {
//     return (
//       <Layout TOKEN={TOKEN} TITLE="AIR IMPORT">
//         <Dialog
//           isOpen={isOpen}
//           title={selected.F_RefNo}
//           onClose={() => setIsOpen(false)}
//           className="bg-white w-50"
//         >
//           <MasterDialog
//             refs={selected}
//             multi={houses}
//             // container={containers}
//             // comment={comments}
//             // file={files}
//             token={TOKEN}
//           />
//         </Dialog>
//         <div className="d-flex flex-sm-row justify-content-between">
//           <div className="flex-column">
//             <h3 className="mb-4 forwarding font-weight-light">Air Import</h3>
//           </div>
//           <InputGroup
//             leftIcon="search"
//             type="number"
//             placeholder="Search Number"
//             onKeyPress={(e) => {
//               if (e.key === "Enter") {
//                 e.preventDefault();
//                 getOimSearch(e);
//               }
//             }}
//           />
//         </div>

//         {/* <div className="d-lg-none">
//           <div className="list-group">
//             {Result.length !== 0 ? (
//               Result.map((ga) => (
//                 <a
//                   href="#"
//                   key={ga.oihmain.ID}
//                   onClick={() => {
//                     router.push(
//                       `/forwarding/oim/[Detail]`,
//                       `/forwarding/oim/${ga.oimmain.RefNo}`
//                     );
//                   }}
//                   className="list-group-item list-group-item-action text-xs text-truncate"
//                 >
//                   <span className="text-primary font-weight-bold">
//                     {ga.oimmain.RefNo}
//                   </span>
//                   <i className="fa fa-arrow-right text-success mx-2"></i>
//                   <span className="font-weight-light">
//                     {ga.oihmain.Customer_SName}
//                   </span>
//                   <i className="fa fa-arrow-right text-warning mx-2"></i>
//                   <span className="text-uppercase">{ga.oimmain.U2ID}</span>
//                 </a>
//               ))
//             ) : (
//               <div
//                 className="alert alert-secondary text-capitalize"
//                 role="alert"
//               >
//                 you do not have ocean import at the moment
//               </div>
//             )}
//           </div>
//         </div> */}

//         <Card className="bg-transparent border-0 d-none d-lg-block">
//           <Row>
//             {/* DISPLAY SEARCH RESULT */}
//             <ToolkitProvider
//               keyField="F_ID"
//               bordered={false}
//               columns={column}
//               data={Result}
//               exportCSV
//               search
//             >
//               {(props) => (
//                 <Col>
//                   <BootstrapTable
//                     {...props.baseProps}
//                     hover
//                     striped
//                     condensed
//                     rowEvents={rowEvents}
//                     wrapperClasses="table-responsive rounded"
//                     bordered={false}
//                     filter={filterFactory()}
//                     noDataIndication={indication}
//                     pagination={paginationFactory({
//                       showTotal: true,
//                       pageButtonRenderer,
//                       paginationTotalRenderer: customTotal,
//                       sizePerPageRenderer,
//                     })}
//                   />
//                 </Col>
//               )}
//             </ToolkitProvider>
//           </Row>
//         </Card>
//       </Layout>
//     );
//   } else {
//     return <p>Redirecting...</p>;
//   }
// };

// export async function getServerSideProps({ req }) {
//   const cookies = cookie.parse(
//     req ? req.headers.cookie || "" : window.document.cookie
//   );
//   return { props: { Cookie: cookies } };
// }

// export default Index;
// // import cookie from "cookie";
// // import React, { useEffect, useState } from "react";
// // import jwt from "jsonwebtoken";
// // import Layout from "../../../components/Layout";
// // import { useRouter } from "next/router";
// // import BootstrapTable from "react-bootstrap-table-next";
// // import ToolkitProvider from "react-bootstrap-table2-toolkit";
// // import paginationFactory from "react-bootstrap-table2-paginator";
// // import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
// // import { Card, Row, Col, Button } from "reactstrap";
// // import moment from "moment";

// // const Index = ({ Cookie, Result }) => {
// //   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
// //   const router = useRouter();

// //   function indication() {
// //     return (
// //       <span>
// //         You do not have <span className="text-danger">Air Import</span> at the
// //         moment
// //       </span>
// //     );
// //   }

// //   const pageButtonRenderer = ({
// //     page,
// //     active,
// //     disabled,
// //     title,
// //     onPageChange,
// //   }) => {
// //     const handleClick = (e) => {
// //       e.preventDefault();
// //       onPageChange(page);
// //     };
// //     return (
// //       <li className="page-item" key={page}>
// //         <a
// //           href="#"
// //           onClick={handleClick}
// //           className={
// //             active ? "btn btn-sm btn-info text-xs" : "btn btn-sm text-xs"
// //           }
// //         >
// //           {page}
// //         </a>
// //       </li>
// //     );
// //   };

// //   const customTotal = (from, to, size) => (
// //     <span className="react-bootstrap-table-pagination-total ml-2 text-xs text-secondary">
// //       Showing {from} to {to} of {size} Results
// //     </span>
// //   );

// //   const customSizePerPage = [
// //     { page: 10, text: "10" },
// //     { page: 50, text: "50" },
// //     { page: 100, text: "100" },
// //     { page: 200, text: "200" },
// //     { page: 300, text: "300" },
// //   ];

// //   const sizePerPageRenderer = ({
// //     options,
// //     currSizePerPage,
// //     onSizePerPageChange,
// //   }) => (
// //     <div className="btn-group" role="group">
// //       {customSizePerPage.map((option) => {
// //         const isSelect = currSizePerPage === `${option.page}`;
// //         return (
// //           <Button
// //             key={option.text}
// //             onClick={() => onSizePerPageChange(option.page)}
// //             size="sm"
// //             color={isSelect ? "secondary" : "primary"}
// //             className="text-xs"
// //             outline
// //           >
// //             {option.text}
// //           </Button>
// //         );
// //       })}
// //     </div>
// //   );

// //   const headerSortingStyle = { backgroundColor: "#c9d5f5" };

// //   const column = [
// //     {
// //       dataField: "aimmain.RefNo",
// //       text: "REF",
// //       formatter: (cell) => <a href="#">{cell}</a>,
// //       events: {
// //         onClick: (e, columns, columnIndex, row) => {
// //           router.push(
// //             `/forwarding/aim/[Detail]`,
// //             `/forwarding/aim/${row.aimmain.RefNo}`
// //           );
// //         },
// //       },
// //       classes:
// //         "text-xs text-center text-truncate text-uppercase font-weight-bold",
// //       headerClasses:
// //         "text-x text-white text-center align-middle px-4 bg-primary pb-0 font-weight-light",
// //       sort: true,
// //       filter: textFilter({
// //         className: "text-xs bg-primary text-white border-0",
// //       }),
// //       headerSortingStyle,
// //     },
// //     {
// //       dataField: "aihmain.Customer_SName",
// //       text: "CUSTOMER",
// //       classes: "text-xs text-truncate",
// //       headerClasses:
// //         "text-x w-25 text-white bg-primary text-center align-middle pb-0 font-weight-light",
// //       sort: true,
// //       filter: textFilter({
// //         className: "text-xs w-100 bg-primary text-white border-0",
// //       }),
// //       headerSortingStyle,
// //     },
// //     {
// //       dataField: "aimmain.MBLNo",
// //       text: "MBL",
// //       classes: "text-xs text-truncate",
// //       headerClasses:
// //         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
// //       sort: true,
// //       filter: textFilter({
// //         className: "text-xs bg-primary text-white border-0",
// //       }),
// //       headerSortingStyle,
// //     },
// //     {
// //       dataField: "aihmain.HBLNo",
// //       text: "HBL",
// //       classes: "text-xs text-truncate",
// //       headerClasses:
// //         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
// //       sort: true,
// //       filter: textFilter({
// //         className: "text-xs bg-primary text-white border-0",
// //       }),
// //       headerSortingStyle,
// //     },
// //     {
// //       dataField: "aimmain.ETD",
// //       text: "ETD",
// //       classes: "text-xs text-truncate",
// //       headerClasses:
// //         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
// //       sort: true,
// //       headerSortingStyle,
// //       filter: textFilter({
// //         className: "text-xs bg-primary text-white border-0",
// //       }),
// //       formatter: (cell) => {
// //         if (cell) {
// //           if (moment(cell).isSameOrBefore(moment())) {
// //             return moment(cell).format("L");
// //           } else {
// //             return (
// //               <div className="text-primary">{moment(cell).format("L")}</div>
// //             );
// //           }
// //         }
// //       },
// //     },
// //     {
// //       dataField: "aimmain.ETA",
// //       text: "ETA",
// //       classes: "text-xs text-truncate",
// //       headerClasses:
// //         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
// //       sort: true,
// //       headerSortingStyle,
// //       filter: textFilter({
// //         className: "text-xs bg-primary text-white border-0",
// //       }),
// //       formatter: (cell) => {
// //         if (cell) {
// //           if (moment(cell).isSameOrBefore(moment())) {
// //             return moment(cell).format("L");
// //           } else {
// //             return (
// //               <div className="text-primary">{moment(cell).format("L")}</div>
// //             );
// //           }
// //         }
// //       },
// //     },
// //     {
// //       dataField: "aimmain.PostDate",
// //       text: "POST",
// //       classes: "text-xs text-truncate",
// //       headerClasses:
// //         "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
// //       sort: true,
// //       headerSortingStyle,
// //       filter: textFilter({
// //         className: "text-xs bg-primary text-white border-0",
// //       }),
// //       formatter: (cell) => {
// //         if (cell) {
// //           if (moment(cell).isSameOrBefore(moment())) {
// //             return moment(cell).format("L");
// //           } else {
// //             return (
// //               <div className="text-primary">{moment(cell).format("L")}</div>
// //             );
// //           }
// //         }
// //       },
// //     },
// //     {
// //       dataField: "aimmain.U2ID",
// //       text: "EDITOR",
// //       classes: "text-xs text-truncate text-uppercase",
// //       headerClasses:
// //         "text-x text-center text-white bg-primary px-4 align-middle pb-0 font-weight-light",
// //       sort: true,
// //       headerSortingStyle,
// //       filter: textFilter({
// //         className: "text-xs bg-primary text-white border-0",
// //       }),
// //     },
// //   ];

// //   useEffect(() => {
// //     !TOKEN && router.push("/login");
// //   }, []);
// //   if (TOKEN && TOKEN.group) {
// //     return (
// //       <Layout TOKEN={TOKEN} TITLE="AIR IMPORT">
// //         <div className="d-flex flex-sm-row justify-content-between">
// //           <div className="flex-column">
// //             <h3 className="mb-4 forwarding font-weight-light">Air Import</h3>
// //           </div>
// //         </div>
// //         <div className="d-lg-none">
// //           <div className="list-group">
// //             {Result.length !== 0 ? (
// //               Result.map((ga) => (
// //                 <a
// //                   href="#"
// //                   key={ga.aihmain.ID}
// //                   onClick={() => {
// //                     router.push(
// //                       `/forwarding/aim/[Detail]`,
// //                       `/forwarding/aim/${ga.aimmain.RefNo}`
// //                     );
// //                   }}
// //                   className="list-group-item list-group-item-action text-xs text-truncate"
// //                 >
// //                   <span className="text-primary font-weight-bold">
// //                     {ga.aimmain.RefNo}
// //                   </span>
// //                   <i className="fa fa-arrow-right text-success mx-2"></i>
// //                   <span className="font-weight-light">
// //                     {ga.aihmain.Customer_SName}
// //                   </span>
// //                   <i className="fa fa-arrow-right text-warning mx-2"></i>
// //                   <span className="text-uppercase">{ga.aimmain.U2ID}</span>
// //                 </a>
// //               ))
// //             ) : (
// //               <div
// //                 className="alert alert-secondary text-capitalize"
// //                 role="alert"
// //               >
// //                 you do not have air import at the moment
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //         <Card className="bg-transparent border-0 d-none d-lg-block">
// //           <Row>
// //             {/* DISPLAY SEARCH RESULT */}
// //             <ToolkitProvider
// //               keyField="aihmain.ID"
// //               bordered={false}
// //               columns={column}
// //               data={Result}
// //               exportCSV
// //               search
// //             >
// //               {(props) => (
// //                 <Col>
// //                   <BootstrapTable
// //                     {...props.baseProps}
// //                     hover
// //                     striped
// //                     condensed
// //                     wrapperClasses="table-responsive rounded"
// //                     bordered={false}
// //                     filter={filterFactory()}
// //                     noDataIndication={indication}
// //                     pagination={paginationFactory({
// //                       showTotal: true,
// //                       pageButtonRenderer,
// //                       paginationTotalRenderer: customTotal,
// //                       sizePerPageRenderer,
// //                     })}
// //                   />
// //                 </Col>
// //               )}
// //             </ToolkitProvider>
// //           </Row>
// //         </Card>
// //       </Layout>
// //     );
// //   } else {
// //     return <p>Redirecting...</p>;
// //   }
// // };

// // export async function getServerSideProps({ req }) {
// //   const cookies = cookie.parse(
// //     req ? req.headers.cookie || "" : window.document.cookie
// //   );

// //   if (jwt.decode(cookies.jamesworldwidetoken) !== null) {
// //     const { fsid } = jwt.decode(cookies.jamesworldwidetoken);
// //     var result = [];
// //     const fetchSearch = await fetch(
// //       `${process.env.FS_BASEPATH}aimmain_leftjoin_aihmain?PIC=${fsid}&etaFrom=&etaTo=&etdFrom=&etdTo=&casestatus=`,
// //       {
// //         headers: { "x-api-key": process.env.JWT_KEY },
// //       }
// //     );
// //     if (fetchSearch.status === 200) {
// //       result = await fetchSearch.json();
// //     }

// //     return { props: { Cookie: cookies, Result: result } };
// //   } else {
// //   }
// // }

// // export default Index;
