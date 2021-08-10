import cookie from "cookie";
import Layout from "../../../../components/Layout";
import jwt from "jsonwebtoken";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import moment from "moment";
import {
	Button,
	Input,
	InputGroup,
	Label,
	Modal,
	ModalHeader,
	ModalBody,
	Spinner,
	Row,
	Col,
	Card,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import React from "react";

export default function blank({ Cookie, CUSTOMER, Firebase }) {
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const firebaseConfig = {
		apiKey: Firebase,
		authDomain: "jw-web-ffaea.firebaseapp.com",
		databaseURL: "https://jw-web-ffaea.firebaseio.com",
		projectId: "jw-web-ffaea",
		storageBucket: "jw-web-ffaea.appspot.com",
		messagingSenderId: "579008207978",
		appId: "1:579008207978:web:313c48437e50d7e5637e13",
		measurementId: "G-GPMS588XP2",
	};
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	} else {
		firebase.app();
	}

	function numberFormat(x) {
		var num = parseFloat(x).toFixed(2);
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	function dollarFormat(x) {
		var num = parseFloat(x).toFixed(2);
		return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	const [loading, setLoading] = React.useState(true);
	const [customerInfo, setCustomerInfo] = React.useState({});
	const [poData, setPoData] = React.useState([]);
	const [grossSum, setGrossSum] = React.useState(0);
	const [grossQty, setGrossQty] = React.useState(0);

	React.useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const mainRef = firebase.firestore().collection("JWG");

				const cusRef = mainRef
					.doc("COMPANY")
					.collection("ID")
					.doc(CUSTOMER)
					.get()
					.then(async (ga) => {
						if (ga.exists) {
							//DOCUMENT EXSITS
							setCustomerInfo(ga.data());
							const CustomerRef = mainRef
								.doc("COMPANY")
								.collection("ID")
								.doc(CUSTOMER);

							return CustomerRef;
						} else {
							// DOCUMENT NOT EXISTS
							setLoading(true);
							return false;
						}
					});
				cusRef.then((result) => {
					if (result != false) {
						mainRef
							.doc("PO")
							.collection("ID")
							.where("vendor", "==", result)
							.onSnapshot((querySnapshot) => {
								var data = [];
								// FOR EACH PO
								querySnapshot.forEach((doc) => {
									var itms = [];
									var totals = [];
									//FOR EACH ITEMS
									// FOR EACH PO, MULTIPLE ITMES
									doc.data().items.map((itm) => {
										// FOR EACH ITEM, PUSH THE DATA INTO AN ARRY(ITMS)
										itm.item.get().then((ga) => {
											totals.push(itm.qty * ga.data().price);
											itms.push({
												...ga.data(),
												qty: itm.qty,
												total: itm.qty * ga.data().price,
											});
										});
									});
									setTimeout(() => {
										const total = totals.reduce((a, b) => a + b, 0);
										const totalqty = itms.reduce(
											(sum, { qty }) => sum + parseFloat(qty),
											0
										);
										const ItemData = {
											...doc.data(),
											id: doc.id,
											itms: itms,
											sum: totals,
											total: total,
											totalqty: totalqty,
										};
										// EACH PO HAS ID, ITMS ARRAY
										setPoData((prev) => [...prev, ItemData]);
										setLoading(false);
									}, 500);
								});
							});
					}
				});
			}
		});
	}, []);

	const headerSortingStyle = { backgroundColor: "#c9d5f5" };
	const column = [
		{
			dataField: "id",
			text: "PO",
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "date",
			text: "DATE",
			formatter: (cell) => {
				if (cell) {
					return moment(cell.seconds * 1000).format("l");
				}
			},
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "total",
			text: "TOTAL",
			formatter: (cell) => {
				if (cell) {
					return <span>{dollarFormat(cell)}</span>;
				}
			},
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "totalqty",
			text: "TOTAL QTY",
			formatter: (cell) => {
				if (cell) {
					return <span>{numberFormat(cell)}</span>;
				}
			},
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "closed",
			text: "STATUS",
			formatter: (cell) => {
				if (cell) {
					return <i className="fa fa-times text-danger"></i>;
				} else {
					return <i className="fa fa-check text-success"></i>;
				}
			},
			sort: true,
			headerSortingStyle,
		},
		{
			dataField: "final",
			text: "FINAL",
			formatter: (cell) => {
				if (cell) {
					return <i className="fa fa-times text-danger"></i>;
				} else {
					return <i className="fa fa-check text-success"></i>;
				}
			},
			sort: true,
			headerSortingStyle,
		},
	];

	const expandRow = {
		renderer: (row) => {
			const subtotal = row.itms.reduce((sum, { total }) => sum + total, 0);
			return (
				<div className="container">
					<div className="row">
						<div className="col-12 mt-3">
							<p className="text-right mb-0 pb-0">100%</p>
							<div
								className="progress mb-4 mx-0 px-0"
								style={{ height: "1.5rem" }}
							>
								<div
									className="progress-bar bg-gray-400"
									role="progressbar"
									style={{ width: "20%" }}
								>
									{dollarFormat(subtotal / 20)}
								</div>
								<div
									className="progress-bar bg-gray-500"
									role="progressbar"
									style={{ width: "30%" }}
								>
									{dollarFormat(subtotal / 30)}
								</div>
								<div
									className="progress-bar bg-gray-600"
									role="progressbar"
									style={{ width: "50%" }}
								>
									{dollarFormat(subtotal / 50)}
								</div>
							</div>
						</div>
						<table className="table table-sm">
							<thead className="text-center">
								<tr>
									<th scope="col" className="w-25">
										ITEM
									</th>
									<th scope="col">SIZE</th>
									<th scope="col">COLOR</th>
									<th scope="col">PRICE</th>
									<th scope="col">QTY</th>
									<th scope="col">UOM</th>
									<th scope="col">SUBTOTAL</th>
								</tr>
							</thead>
							<tbody>
								{row.itms.length > 0 &&
									row.itms.map((ga, i) => (
										<tr key={i} style={{ backgroundColor: "transparent" }}>
											<th scope="row">{ga.description}</th>
											<td>{ga.size}</td>
											<td>{ga.color}</td>
											<td>{dollarFormat(ga.price)}</td>
											<td>{numberFormat(ga.qty)}</td>
											<td>{ga.uom}</td>
											<td>{dollarFormat(ga.total)}</td>
										</tr>
									))}
								<tr
									style={{ backgroundColor: "transparent" }}
									className="font-weight-bold"
								>
									<td colSpan="4" className="text-center">
										SUBTOTAL
									</td>
									<td>{numberFormat(row.totalqty)}</td>
									<td colSpan="2" className="text-right">
										{dollarFormat(row.total)}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			);
		},
	};

	return (
		<Layout TOKEN={TOKEN} TITLE={CUSTOMER}>
			{loading ? (
				<Spinner />
			) : (
				<>
					<h1>Purchase Order for {CUSTOMER}</h1>
					<p>EMAIL: {customerInfo.email}</p>
					<p>
						ADDRESS: {customerInfo.address1} {customerInfo.address2}
					</p>
					<BootstrapTable
						keyField="id"
						condensed
						wrapperClasses="table-responsive text-xs"
						data={poData}
						columns={column}
						expandRow={expandRow}
					/>
					<div className="col">
						<div className="progress">
							<div className="progress-bar bg-success w-100" role="progressbar">
								{dollarFormat(
									poData.reduce((sum, { total }) => sum + total, 0)
								)}
							</div>
						</div>
						<br />
						<div className="progress">
							<div className="progress-bar bg-info w-100" role="progressbar">
								{numberFormat(
									poData.reduce((sum, { totalqty }) => sum + totalqty, 0)
								)}
							</div>
						</div>
					</div>
				</>
			)}
		</Layout>
	);
}

export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	// Pass data to the page via props
	return {
		props: {
			Cookie: cookies,
			CUSTOMER: query.Detail,
			Firebase: process.env.FIREBASE_API_KEY,
		},
	};
}
