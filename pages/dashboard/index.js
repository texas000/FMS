import Layout from "../../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { ListGroup, ListGroupItem } from "reactstrap";
import moment from "moment";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import Link from "next/link";
import { useRouter } from "next/router";

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

export default function dashboard(props) {
	const { data } = useSWR("/api/dashboard/list");
	const router = useRouter();
	useEffect(() => {
		if (!props.token) {
			router.push("/login");
		}
		// if (typeof window !== "undefined") {
		// localStorage.setItem("board", JSON.stringify(Board));
		// }
	}, []);
	if (props.token) {
		return (
			<Layout TOKEN={props.token} TITLE="Dashboard">
				<div className="d-sm-flex align-items-center justify-content-between mb-4 w-100">
					<h3 className="h3 mb-0 font-weight-light">Dashboard</h3>
				</div>

				<div className="row">
					{/*  ------------------- OIM ------------------------  */}
					<div className="col-xl-3 col-md-6 mb-4">
						<div className="card border-left-primary shadow h-100 py-2">
							<div className="card-body px-2">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										<div className="text-xs font-weight-bold text-primary text-uppercase mb-2">
											ocean import
										</div>
										<ListGroup>
											{data && data.length ? (
												data[0].map((ga, i) => {
													return (
														<Link
															href={`/forwarding/oim/${ga.F_RefNo}`}
															key={i + "oim"}
														>
															<a>
																<ListGroupItem
																	action
																	className="d-flex py-2 justify-content-between align-items-center text-xs btn btn-link reference"
																>
																	<span className="font-weight-bold">
																		{ga.F_RefNo}
																	</span>
																	<span
																		className="text-gray-800"
																		style={{
																			maxWidth: "100px",
																			textOverflow: "ellipsis",
																			whiteSpace: "nowrap",
																			overflow: "hidden",
																		}}
																	>
																		{ga.Customer || "NO CUSTOMER"}
																	</span>
																	<span
																		className={`font-weight-bold ${
																			moment()
																				.startOf("day")
																				.diff(moment(ga.F_ETA).utc(), "days") <
																			0
																				? "text-danger"
																				: "text-primary"
																		}`}
																	>
																		{moment()
																			.startOf("day")
																			.diff(moment(ga.F_ETA).utc(), "days")}
																	</span>
																</ListGroupItem>
															</a>
														</Link>
													);
												})
											) : (
												<div className="mt-2 text-danger text-xs">
													No Result
												</div>
											)}
										</ListGroup>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/*  ------------------- OEX ------------------------  */}
					<div className="col-xl-3 col-md-6 mb-4">
						<div className="card border-left-primary shadow h-100 py-2">
							<div className="card-body px-2">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										<div className="text-xs font-weight-bold text-primary text-uppercase mb-2">
											ocean export
										</div>
										<ListGroup>
											{data && data.length ? (
												data[1].map((ga, i) => {
													return (
														<Link
															href={`/forwarding/oex/${ga.F_RefNo}`}
															key={i + "oex"}
														>
															<a>
																<ListGroupItem
																	action
																	className="d-flex py-2 justify-content-between align-items-center text-xs btn btn-link reference"
																>
																	<span className="font-weight-bold">
																		{ga.F_RefNo}
																	</span>
																	<span
																		className="text-gray-800"
																		style={{
																			maxWidth: "100px",
																			textOverflow: "ellipsis",
																			whiteSpace: "nowrap",
																			overflow: "hidden",
																		}}
																	>
																		{ga.Customer || "NO CUSTOMER"}
																	</span>
																	<span
																		className={`font-weight-bold ${
																			moment()
																				.startOf("day")
																				.diff(moment(ga.F_ETA).utc(), "days") <
																			0
																				? "text-danger"
																				: "text-primary"
																		}`}
																	>
																		{moment()
																			.startOf("day")
																			.diff(moment(ga.F_ETA).utc(), "days")}
																	</span>
																</ListGroupItem>
															</a>
														</Link>
													);
												})
											) : (
												<div className="mt-2 text-danger text-xs">
													No Result
												</div>
											)}
										</ListGroup>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/*  ------------------- AIM ------------------------  */}
					<div className="col-xl-3 col-md-6 mb-4">
						<div className="card border-left-info shadow h-100 py-2">
							<div className="card-body px-2">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										<div className="text-xs font-weight-bold text-info text-uppercase mb-2">
											air import
										</div>
										<ListGroup>
											{data && data.length ? (
												data[2].map((ga, i) => {
													return (
														<Link
															href={`/forwarding/aim/${ga.F_RefNo}`}
															key={i + "aim"}
														>
															<a>
																<ListGroupItem
																	action
																	className="d-flex py-2 justify-content-between align-items-center text-xs btn btn-link reference"
																>
																	<span className="font-weight-bold">
																		{ga.F_RefNo}
																	</span>
																	<span
																		className="text-gray-800"
																		style={{
																			maxWidth: "100px",
																			textOverflow: "ellipsis",
																			whiteSpace: "nowrap",
																			overflow: "hidden",
																		}}
																	>
																		{ga.Customer || "NO CUSTOMER"}
																	</span>
																	<span
																		className={`font-weight-bold ${
																			moment()
																				.startOf("day")
																				.diff(moment(ga.F_ETA).utc(), "days") <
																			0
																				? "text-danger"
																				: "text-info"
																		}`}
																	>
																		{moment()
																			.startOf("day")
																			.diff(moment(ga.F_ETA).utc(), "days")}
																	</span>
																</ListGroupItem>
															</a>
														</Link>
													);
												})
											) : (
												<div className="mt-2 text-danger text-xs">
													No Result
												</div>
											)}
										</ListGroup>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/*  ------------------- AEX ------------------------  */}
					<div className="col-xl-3 col-md-6 mb-4">
						<div className="card border-left-info shadow h-100 py-2">
							<div className="card-body px-2">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										<div className="text-xs font-weight-bold text-info text-uppercase mb-2">
											air export
										</div>
										<ListGroup>
											{data && data.length ? (
												data[3].map((ga, i) => {
													return (
														<Link
															href={`/forwarding/aex/${ga.F_RefNo}`}
															key={i + "aex"}
														>
															<a>
																<ListGroupItem
																	action
																	key={i + "aex"}
																	className="d-flex py-2 justify-content-between align-items-center text-xs reference"
																>
																	<span className="font-weight-bold">
																		{ga.F_RefNo}
																	</span>
																	<span
																		className="text-gray-800"
																		style={{
																			maxWidth: "100px",
																			textOverflow: "ellipsis",
																			whiteSpace: "nowrap",
																			overflow: "hidden",
																		}}
																	>
																		{ga.Customer || "NO CUSTOMER"}
																	</span>
																	<span
																		className={`font-weight-bold ${
																			moment()
																				.startOf("day")
																				.diff(moment(ga.F_ETA).utc(), "days") <
																			0
																				? "text-danger"
																				: "text-info"
																		}`}
																	>
																		{moment()
																			.startOf("day")
																			.diff(moment(ga.F_ETA).utc(), "days")}
																	</span>
																</ListGroupItem>
															</a>
														</Link>
													);
												})
											) : (
												<div className="mt-2 text-danger text-xs">
													No Result
												</div>
											)}
										</ListGroup>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Explain Row */}
				<div className="row">
					<div className="col-lg-3 mb-4">
						<div className="card bg-primary text-white shadow">
							<div className="card-body d-flex justify-content-between">
								<div>
									Ocean Import
									<div className="text-white-50 small">
										Total of {data && data.length ? data[0].length : "0"}
									</div>
								</div>
								<Link href="/forwarding/oim">
									<a className="d-flex align-items-center">
										<span className="fa-stack fa-2x">
											<i className="fa fa-circle fa-stack-2x text-gray-100"></i>
											<i className="fa fa-anchor fa-stack-1x text-primary"></i>
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-lg-3 mb-4">
						<div className="card bg-primary text-white shadow">
							<div className="card-body d-flex justify-content-between">
								<div>
									Ocean Export
									<div className="text-white-50 small">
										Total of {data && data.length ? data[1].length : "0"}
									</div>
								</div>
								<Link href="/forwarding/oex">
									<a className="d-flex align-items-center">
										<span className="fa-stack fa-2x">
											<i className="fa fa-circle fa-stack-2x text-gray-100"></i>
											<i className="fa fa-anchor fa-flip-vertical fa-stack-1x text-primary"></i>
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-lg-3 mb-4">
						<div className="card bg-info text-white shadow">
							<div className="card-body d-flex justify-content-between">
								<div>
									Air Import
									<div className="text-white-50 small">
										Total of {data && data.length ? data[2].length : "0"}
									</div>
								</div>
								<Link href="/forwarding/aim">
									<a className="d-flex align-items-center">
										<span className="fa-stack fa-2x">
											<i className="fa fa-circle fa-stack-2x text-gray-100"></i>
											<i className="fa fa-plane fa-stack-1x text-info"></i>
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-lg-3 mb-4">
						<div className="card bg-info text-white shadow">
							<div className="card-body d-flex justify-content-between">
								<div>
									Air Export
									<div className="text-white-50 small">
										Total of {data && data.length ? data[3].length : "0"}
									</div>
								</div>
								<Link href="/forwarding/aex">
									<a className="d-flex align-items-center">
										<span className="fa-stack fa-2x">
											<i className="fa fa-circle fa-stack-2x text-gray-100"></i>
											<i className="fa fa-plane fa-flip-vertical fa-stack-1x text-info"></i>
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<style jsx>
					{`
						.reference::before {
							transform: scaleX(0);
							transform-origin: bottom right;
						}

						.reference:hover::before {
							transform: scaleX(1);
							transform-origin: bottom left;
						}
						.reference::before {
							content: " ";
							display: block;
							position: absolute;
							top: 0;
							right: 0;
							bottom: 0;
							left: 0;
							inset: 0 0 0 0;
							background: hsl(200 100% 80%);
							z-index: -1;
							transition: transform 0.3s ease;
						}
						 {
							/* .reference:hover {
	            opacity: 0.1;
	            background-color: "blue";
	          } */
						}
					`}
				</style>
			</Layout>
		);
	}
	return <p>Redirecting...</p>;
}
