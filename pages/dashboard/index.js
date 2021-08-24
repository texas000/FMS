import Layout from "../../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ListGroup, ListGroupItem } from "reactstrap";
import moment from "moment";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import Notification from "../../components/Toaster";
import Checkout from "../../components/Dashboard/Payment";
import usdFormat from "../../lib/currencyFormat";

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

export default function dashboard(props) {
	const { data } = useSWR("/api/dashboard/list");
	const { data: invoice } = useSWR("/api/dashboard/invoice");
	// useEffect(() => {
	// 	// if (typeof window !== "undefined") {
	// 	// localStorage.setItem("board", JSON.stringify(Board));
	// 	// }
	// }, []);
	return (
		<Layout TOKEN={props.token} TITLE="Dashboard" LOADING={!data}>
			{/* <Notification
				show={show}
				setShow={setShow}
				msg="Hello"
				intent="primary"
			/> */}

			<div className="flex justify-between mb-4">
				<h3 className="dark:text-white">Dashboard</h3>
				<Link href="/invoice">
					<a
						className="bg-white dark:bg-gray-700 dark:text-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
						style={{ textDecoration: "none" }}
					>
						Pending Invoice {invoice && usdFormat(invoice[0].pending)}
					</a>
				</Link>
			</div>

			{/* SUMMARY FREIGHT */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="mb-4">
					<div className="shadow rounded bg-white dark:bg-gray-800 text-black dark:text-white px-5">
						<div className="flex justify-content-between py-1">
							<div className="py-2">
								<div className="text-lg">Ocean Import</div>
								<div className="text-sm">
									Total of {data && data.length ? data[0].length : "0"}
								</div>
							</div>
							<Link href="/forwarding/oim">
								<a className="d-flex align-items-center">
									<span className="fa-stack fa-2x">
										<i className="fa fa-circle fa-stack-2x text-gray-200"></i>
										<i className="fa fa-anchor fa-stack-1x text-blue-500"></i>
									</span>
								</a>
							</Link>
						</div>
					</div>
				</div>

				<div className="mb-4">
					<div className="shadow rounded bg-white dark:bg-gray-800 text-black dark:text-white px-5">
						<div className="flex justify-content-between py-1">
							<div className="py-2">
								<div className="text-lg">Ocean Export</div>
								<div className="text-sm">
									Total of {data && data.length ? data[1].length : "0"}
								</div>
							</div>
							<Link href="/forwarding/oex">
								<a className="d-flex align-items-center">
									<span className="fa-stack fa-2x">
										<i className="fa fa-circle fa-stack-2x text-gray-200"></i>
										<i className="fa fa-anchor fa-flip-vertical fa-stack-1x text-blue-500"></i>
									</span>
								</a>
							</Link>
						</div>
					</div>
				</div>

				<div className="mb-4">
					<div className="shadow rounded bg-white dark:bg-gray-800 text-black dark:text-white px-5">
						<div className="flex justify-content-between py-1">
							<div className="py-2">
								<div className="text-lg">Air Import</div>
								<div className="text-sm">
									Total of {data && data.length ? data[2].length : "0"}
								</div>
							</div>
							<Link href="/forwarding/aim">
								<a className="d-flex align-items-center">
									<span className="fa-stack fa-2x">
										<i className="fa fa-circle fa-stack-2x text-gray-200"></i>
										<i className="fa fa-plane fa-stack-1x text-purple-500"></i>
									</span>
								</a>
							</Link>
						</div>
					</div>
				</div>

				<div className="mb-4">
					<div className="shadow rounded bg-white dark:bg-gray-800 text-black dark:text-white px-5">
						<div className="flex justify-content-between py-1">
							<div className="py-2">
								<div className="text-lg">Air Export</div>
								<div className="text-sm">
									Total of {data && data.length ? data[3].length : "0"}
								</div>
							</div>
							<Link href="/forwarding/aex">
								<a className="d-flex align-items-center">
									<span className="fa-stack fa-2x">
										<i className="fa fa-circle fa-stack-2x text-gray-200"></i>
										<i className="fa fa-plane fa-flip-vertical fa-stack-1x text-purple-500"></i>
									</span>
								</a>
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* RECENT LIST FREIGHT */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
				{/*  ------------------- OIM ------------------------  */}

				<div className="card shadow h-100 p-3">
					<ul className="px-0 divide-y divide-gray-300">
						{data && data.length ? (
							data[0].map((ga, i) => {
								return (
									<li
										className="px-2 py-1 hover:bg-gray-200 focus:ring-2 focus:ring-blue-600"
										key={i + "oim"}
									>
										<Link href={`/forwarding/oim/${ga.F_RefNo}`}>
											<a
												className="flex justify-between"
												style={{ textDecoration: "none" }}
											>
												<span className="w-1/4 truncate font-semibold">
													{ga.F_RefNo}
												</span>
												<span className="w-1/2 truncate">
													{ga.Customer || "NO CUSTOMER"}
												</span>
												<span
													className={`font-weight-bold ${
														moment()
															.startOf("day")
															.diff(moment(ga.F_ETA).utc(), "days") < 0
															? "text-danger"
															: "text-primary"
													}`}
												>
													{moment(ga.F_ETA)
														.utc()
														.add(1, "days")
														.startOf("day")
														.diff(new Date().toDateString(), "days")}
												</span>
											</a>
										</Link>
									</li>
								);
							})
						) : (
							<div className="mt-2 text-danger text-xs">No Result</div>
						)}
					</ul>
				</div>

				{/*  ------------------- OEX ------------------------  */}

				<div className="card shadow h-100 p-3">
					<ul className="px-0 divide-y divide-gray-300">
						{data && data.length ? (
							data[1].map((ga, i) => {
								return (
									<li
										className="px-2 py-1 hover:bg-gray-200 focus:ring-2 focus:ring-blue-600"
										key={i + "oex"}
									>
										<Link href={`/forwarding/oex/${ga.F_RefNo}`}>
											<a
												className="flex justify-between"
												style={{ textDecoration: "none" }}
											>
												<span className="w-1/4 truncate font-semibold">
													{ga.F_RefNo}
												</span>
												<span className="w-1/2 truncate">
													{ga.Customer || "NO CUSTOMER"}
												</span>
												<span
													className={`font-weight-bold ${
														moment()
															.startOf("day")
															.diff(moment(ga.F_ETA).utc(), "days") < 0
															? "text-danger"
															: "text-primary"
													}`}
												>
													{moment(ga.F_ETA)
														.utc()
														.add(1, "days")
														.startOf("day")
														.diff(new Date().toDateString(), "days")}
												</span>
											</a>
										</Link>
									</li>
								);
							})
						) : (
							<div className="mt-2 text-danger text-xs">No Result</div>
						)}
					</ul>
				</div>

				{/*  ------------------- AIM ------------------------  */}

				<div className="card shadow h-100 p-3">
					<ul className="px-0 divide-y divide-gray-300">
						{data && data.length ? (
							data[2].map((ga, i) => {
								return (
									<li
										className="px-2 py-1 hover:bg-gray-200 focus:ring-2 focus:ring-blue-600"
										key={i + "aim"}
									>
										<Link href={`/forwarding/aim/${ga.F_RefNo}`}>
											<a
												className="flex justify-between"
												style={{ textDecoration: "none" }}
											>
												<span className="w-1/4 truncate font-semibold">
													{ga.F_RefNo}
												</span>
												<span className="w-1/2 truncate">
													{ga.Customer || "NO CUSTOMER"}
												</span>
												<span
													className={`font-weight-bold ${
														moment()
															.startOf("day")
															.diff(moment(ga.F_ETA).utc(), "days") < 0
															? "text-danger"
															: "text-primary"
													}`}
												>
													{moment(ga.F_ETA)
														.utc()
														.add(1, "days")
														.startOf("day")
														.diff(new Date().toDateString(), "days")}
												</span>
											</a>
										</Link>
									</li>
								);
							})
						) : (
							<div className="mt-2 text-danger text-xs">No Result</div>
						)}
					</ul>
				</div>

				{/*  ------------------- AEX ------------------------  */}

				<div className="card shadow h-100 p-3">
					<ul className="px-0 divide-y divide-gray-300">
						{data && data.length ? (
							data[3].map((ga, i) => {
								return (
									<li
										className="px-2 py-1 hover:bg-gray-200 focus:ring-2 focus:ring-blue-600"
										key={i + "aex"}
									>
										<Link href={`/forwarding/aex/${ga.F_RefNo}`}>
											<a
												className="flex justify-between"
												style={{ textDecoration: "none" }}
											>
												<span className="w-1/4 truncate font-semibold">
													{ga.F_RefNo}
												</span>
												<span className="w-1/2 truncate">
													{ga.Customer || "NO CUSTOMER"}
												</span>
												<span
													className={`font-weight-bold ${
														moment()
															.startOf("day")
															.diff(moment(ga.F_ETA).utc(), "days") < 0
															? "text-danger"
															: "text-primary"
													}`}
												>
													{moment(ga.F_ETA)
														.utc()
														.add(1, "days")
														.startOf("day")
														.diff(new Date().toDateString(), "days")}
												</span>
											</a>
										</Link>
									</li>
								);
							})
						) : (
							<div className="mt-2 text-danger text-xs">No Result</div>
						)}
					</ul>
				</div>
			</div>

			<Checkout />
		</Layout>
	);
}
