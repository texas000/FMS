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
					<h3 className="h3 text-dark">Dashboard</h3>
				</div>

				{/* Explain Row */}
				<div className="row">
					<div className="col-lg-3 mb-4">
						<div className="card text-dark shadow">
							<div className="card-body d-flex justify-content-between py-1">
								<div className="py-2">
									<h5>Ocean Import</h5>
									<div className="small">
										Total of {data && data.length ? data[0].length : "0"}
									</div>
								</div>
								<Link href="/forwarding/oim">
									<a className="d-flex align-items-center">
										<span className="fa-stack fa-2x">
											<i className="fa fa-circle fa-stack-2x text-gray-300"></i>
											<i className="fa fa-anchor fa-stack-1x text-primary"></i>
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-lg-3 mb-4">
						<div className="card text-dark shadow">
							<div className="card-body d-flex justify-content-between py-1">
								<div className="py-2">
									<h5>Ocean Export</h5>
									<div className="small">
										Total of {data && data.length ? data[1].length : "0"}
									</div>
								</div>
								<Link href="/forwarding/oex">
									<a className="d-flex align-items-center">
										<span className="fa-stack fa-2x">
											<i className="fa fa-circle fa-stack-2x text-gray-300"></i>
											<i className="fa fa-anchor fa-flip-vertical fa-stack-1x text-primary"></i>
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-lg-3 mb-4">
						<div className="card text-dark shadow">
							<div className="card-body d-flex justify-content-between py-1">
								<div className="py-2">
									<h5>Air Import</h5>
									<div className="small">
										Total of {data && data.length ? data[2].length : "0"}
									</div>
								</div>
								<Link href="/forwarding/aim">
									<a className="d-flex align-items-center">
										<span className="fa-stack fa-2x">
											<i className="fa fa-circle fa-stack-2x text-gray-300"></i>
											<i className="fa fa-plane fa-stack-1x text-info"></i>
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>

					<div className="col-lg-3 mb-4">
						<div className="card text-dark shadow">
							<div className="card-body d-flex justify-content-between py-1">
								<div className="py-2">
									<h5>Air Export</h5>
									<div className="small">
										Total of {data && data.length ? data[3].length : "0"}
									</div>
								</div>
								<Link href="/forwarding/aex">
									<a className="d-flex align-items-center">
										<span className="fa-stack fa-2x">
											<i className="fa fa-circle fa-stack-2x text-gray-300"></i>
											<i className="fa fa-plane fa-flip-vertical fa-stack-1x text-info"></i>
										</span>
									</a>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="row">
					{/*  ------------------- OIM ------------------------  */}
					<div className="col-xl-3 col-md-6 mb-4">
						<div className="card shadow h-100">
							<div className="card-body px-3">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										{/* <div className="font-weight-bold text-primary text-uppercase mb-2">
											ocean import
										</div> */}
										<ListGroup>
											{data && data.length ? (
												data[0].map((ga, i) => {
													return (
														<Link
															href={`/forwarding/oim/${ga.F_RefNo}`}
															key={i + "oim"}
														>
															<ListGroupItem
																tag="a"
																action
																className="d-flex py-2 justify-content-between align-items-center"
															>
																<span className="font-weight-bold">
																	{ga.F_RefNo}
																</span>
																<span
																	className="text-gray-800"
																	style={{
																		maxWidth: "50%",
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
															</ListGroupItem>
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
						<div className="card shadow h-100">
							<div className="card-body px-3">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										{/* <div className="font-weight-bold text-primary text-uppercase mb-2">
											ocean export
										</div> */}
										<ListGroup>
											{data && data.length ? (
												data[1].map((ga, i) => {
													return (
														<Link
															href={`/forwarding/oex/${ga.F_RefNo}`}
															key={i + "oex"}
														>
															<ListGroupItem
																action
																tag="a"
																className="d-flex py-2 justify-content-between align-items-center"
															>
																<span className="font-weight-bold">
																	{ga.F_RefNo}
																</span>
																<span
																	className="text-gray-800"
																	style={{
																		maxWidth: "50%",
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
															</ListGroupItem>
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
						<div className="card shadow h-100">
							<div className="card-body px-3">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										{/* <div className="font-weight-bold text-info text-uppercase mb-2">
											air import
										</div> */}
										<ListGroup>
											{data && data.length ? (
												data[2].map((ga, i) => {
													return (
														<Link
															href={`/forwarding/aim/${ga.F_RefNo}`}
															key={i + "aim"}
														>
															<ListGroupItem
																action
																tag="a"
																className="d-flex py-2 justify-content-between align-items-center"
															>
																<span className="font-weight-bold">
																	{ga.F_RefNo}
																</span>
																<span
																	style={{
																		maxWidth: "50%",
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
																			.diff(moment(ga.F_ETA).utc(), "days") < 0
																			? "text-danger"
																			: "text-info"
																	}`}
																>
																	{moment(ga.F_ETA)
																		.utc()
																		.add(1, "days")
																		.startOf("day")
																		.diff(new Date().toDateString(), "days")}
																</span>
															</ListGroupItem>
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
						<div className="card shadow h-100">
							<div className="card-body px-3">
								<div className="row no-gutters align-items-center">
									<div className="col mr-2">
										{/* <div className="font-weight-bold text-info text-uppercase mb-2">
											air export
										</div> */}
										<ListGroup>
											{data && data.length ? (
												data[3].map((ga, i) => {
													return (
														<Link
															href={`/forwarding/aex/${ga.F_RefNo}`}
															key={i + "aex"}
														>
															<ListGroupItem
																tag="a"
																action
																key={i + "aex"}
																className="d-flex py-2 justify-content-between align-items-center"
															>
																<span className="font-weight-bold">
																	{ga.F_RefNo}
																</span>
																<span
																	className="text-gray-800"
																	style={{
																		maxWidth: "50%",
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
																			.diff(moment(ga.F_ETA).utc(), "days") < 0
																			? "text-danger"
																			: "text-info"
																	}`}
																>
																	{moment(ga.F_ETA)
																		.utc()
																		.add(1, "days")
																		.startOf("day")
																		.diff(new Date().toDateString(), "days")}
																</span>
															</ListGroupItem>
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
			</Layout>
		);
	}
	return <p>Redirecting...</p>;
}
