import { Tag, Classes, Dialog, Button } from "@blueprintjs/core";
import moment from "moment";
import { useEffect, useState } from "react";
import axios, { post } from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Select from "react-select";
import { Spinner } from "reactstrap";
import usdFormat from "../../../lib/currencyFormat";

export const Profit = ({
	invoice,
	ap,
	crdr,
	profit,
	TOKEN,
	Reference,
	customer,
}) => {
	const { data, mutate } = useSWR("/api/file/list?ref=" + Reference);
	const { data: requested } = useSWR("/api/requests/get?ref=" + Reference);
	const [selected, setSelected] = useState(false);
	// const [file, setFile] = useState(false);
	const [selectedFile, setSelectedFile] = useState(false);
	const [selectedFile2, setSelectedFile2] = useState(false);
	const [type, setType] = useState(false);
	const [arType, setArtype] = useState(false);
	const [crType, setCrtype] = useState(false);
	const [apType, setAptype] = useState(false);

	const arfiles = [
		{ level: 10, value: "isf", label: "ISF" },
		{ level: 10, value: "hbl", label: "House B/L" },
		{ level: 10, value: "packing", label: "Packing List" },
		{ level: 10, value: "invoice", label: "Commercial Invoice" },
		{ level: 10, value: "customs", label: "Customs Document" },
		{ level: 10, value: "pod", label: "Proof of delivery" },
		{ level: 10, value: "others", label: "Others" },
	];
	const crdrfiles = [
		{ level: 20, value: "debit", label: "Debit Note" },
		{ level: 20, value: "credit", label: "Credit Note" },
		{ level: 20, value: "others", label: "Others" },
	];
	const apfiles = [
		{ level: 30, value: "mbl", label: "Master B/L" },
		{ level: 30, value: "truck", label: "Trucking Invoice" },
		{ level: 30, value: "do", label: "Delivery Order" },
		{ level: 30, value: "an", label: "Carrier Arrival Notice" },
		{ level: 30, value: "cinvoice", label: "Customs Invoice" },
		{ level: 30, value: "others", label: "Others" },
	];

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

	// async function getFiles() {
	// 	const file = await fetch("/api/dashboard/getFileList", {
	// 		method: "GET",
	// 		headers: {
	// 			ref: Reference,
	// 		},
	// 	});
	// 	if (file.status === 200) {
	// 		const list = await file.json();
	// 		setFile(list);
	// 	} else {
	// 		setFile([]);
	// 	}
	// }
	// useEffect(() => {
	// 	getFiles();
	// }, [Reference]);

	const router = useRouter();
	async function postReq(body) {
		const req = await fetch("/api/requests/postRequest", {
			method: "POST",
			headers: {
				ref: Reference,
				token: JSON.stringify(TOKEN),
			},
			body: JSON.stringify({
				...body,
				file: selectedFile,
				file2: selectedFile2,
				type: type,
				customer: customer,
				path: router.asPath,
			}),
		});
		if (req.status === 200) {
			setSelected(false);
		} else {
			alert(req.status);
		}
	}
	var arTotal = null;
	var crdrTotal = null;
	var apTotal = null;
	for (var i = 0; i < invoice.length; i++) {
		arTotal += invoice[i].F_PaidAmt;
	}
	for (var i = 0; i < crdr.length; i++) {
		crdrTotal += crdr[i].F_PaidAmt;
	}
	for (var i = 0; i < ap.length; i++) {
		apTotal += ap[i].F_PaidAmt;
	}

	function handleUpload(e) {
		var labels, levels;
		if (e.target.id == "crdr") {
			if (!crType) {
				alert("PLEASE SELECT FILE TYPE");
				return;
			}
			labels = crType.value;
			levels = crType.level;
		}
		if (e.target.id == "invoice") {
			if (!arType) {
				alert("PLEASE SELECT FILE TYPE");
				return;
			}
			labels = arType.value;
			levels = arType.level;
		}
		if (e.target.id == "ap") {
			if (!apType) {
				alert("PLEASE SELECT FILE TYPE");
				return;
			}
			labels = apType.value;
			levels = apType.level;
		}

		var uploadedFile = e.target.files[0];
		if (uploadedFile) {
			const formData = new FormData();
			formData.append("userPhoto", uploadedFile);
			const config = {
				headers: {
					"content-type": "multipart/form-data",
					label: labels,
					level: levels,
				},
			};
			try {
				const upload = new Promise((res, rej) => {
					try {
						res(post(`/api/file/upload?ref=${Reference}`, formData, config));
					} catch (err) {
						console.log(err);
						res("uploaded");
					}
				});
				upload.then((ga) => {
					if (ga.status === 200) {
						mutate();
					} else {
						console.log(ga.status);
					}
				});
			} catch (err) {
				if (err.response) {
					console.log(err.response);
				} else if (err.request) {
					console.log(err.request);
				} else {
					console.log(err);
				}
			}
		}
	}

	return (
		<div className="card my-4 py-4 shadow">
			<div className="row px-4 py-2">
				<div className="col-12">
					<h4 className="h6">SUMMARY</h4>
					{profit &&
						profit.map((ga, i) => (
							<div key={i + "PROFIT"}>
								<div className="row">
									<div className="col">
										{/* AR SUMMARY */}
										<Tag
											className={`${
												arTotal != null && arTotal / ga.F_AR == 1
													? "bg-primary"
													: "bg-gray-600"
											} w-100 text-white mr-4 px-4 py-2`}
										>
											<div className="d-flex justify-content-between font-weight-bold">
												<span>AR</span>
												<span>{usdFormat(ga.F_AR)}</span>
											</div>
										</Tag>
										{/* INVOICE LIST */}
										<div className="row p-2">
											<div className="col-lg-3"></div>
											<div className="col-lg-9">
												{invoice &&
													invoice.map((ga) => (
														<Tag
															className={`${
																ga.F_InvoiceAmt == ga.F_PaidAmt &&
																ga.F_InvoiceAmt != 0
																	? "bg-primary"
																	: "bg-secondary"
															} btn py-0 text-white btn-block`}
															key={ga.F_ID + "INVO"}
														>
															<div className="d-flex justify-content-between font-weight-light">
																<span>{ga.F_InvoiceNo}</span>
																<span>{usdFormat(ga.F_InvoiceAmt)}</span>
															</div>
														</Tag>
													))}
											</div>
										</div>
										<hr />
										{/* FILE UPLOAD */}
										<form className="upload">
											<Select
												options={arfiles}
												className="py-0"
												onChange={(e) => setArtype(e)}
												defaultValue={{ value: 0, label: "SELECT TYPE" }}
											/>
											<div className="input-group my-2" style={{ zIndex: "0" }}>
												<div className="custom-file w-75">
													<input
														type="file"
														id="invoice"
														className="custom-file-input"
														onChange={handleUpload}
													/>
													<label className="custom-file-label">
														Choose file
													</label>
												</div>
											</div>
										</form>
										{/* DISPLAY FILE */}
										{!data ? (
											<Spinner />
										) : !data.length ? (
											<div></div>
										) : (
											data.map((ga) => {
												if (ga.F_SECURITY == 10) {
													return (
														<Tag
															role="button"
															key={ga.F_ID + "FILE"}
															className="w-100 bg-gray-400 px-2 py-2 my-1"
															onClick={async () => {
																window.location.assign(
																	`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
																		ga.F_FILENAME
																	)}`
																);
															}}
														>
															<div className="d-flex justify-content-between text-dark">
																<span className="text-uppercase">
																	<i className="fa fa-download mr-1"></i>
																	{ga.F_LABEL}
																</span>
																<span
																	className="font-weight-bold text-truncate"
																	style={{
																		maxWidth: "180px",
																	}}
																>
																	{ga.F_FILENAME}
																</span>
															</div>
														</Tag>
													);
												}
											})
										)}
									</div>
									<div className="col">
										{/* CRDR SUMMARY */}
										<Tag
											className={`${
												crdrTotal != null && crdrTotal / ga.F_CrDr == 1
													? "bg-primary"
													: "bg-gray-600"
											} w-100 text-white mr-4 px-4 py-2`}
										>
											<div className="d-flex justify-content-between font-weight-bold">
												<span>CRDR</span>
												<span>{usdFormat(ga.F_CrDr)}</span>
											</div>
										</Tag>
										{/* CRDR LIST */}
										<div className="row p-2">
											<div className="col-lg-3"></div>
											<div className="col-lg-9">
												{crdr &&
													crdr.map((ga) => (
														<Tag
															className={`${
																ga.F_Total == ga.F_PaidAmt && ga.F_Total != 0
																	? "bg-primary"
																	: "bg-secondary"
															} btn py-0 text-white btn-block`}
															key={ga.F_ID + "CRDR"}
														>
															<div className="d-flex justify-content-between font-weight-light">
																<span>{ga.F_CrDbNo}</span>
																<span>{usdFormat(ga.F_Total)}</span>
															</div>
														</Tag>
													))}
											</div>
										</div>
										<hr />
										{/* FILE UPLOAD */}
										<form className="upload">
											<Select
												options={crdrfiles}
												className="py-0"
												onChange={(e) => setCrtype(e)}
												defaultValue={{ value: 0, label: "SELECT TYPE" }}
											/>
											<div className="input-group my-2" style={{ zIndex: "0" }}>
												<div className="custom-file w-75">
													<input
														type="file"
														id="crdr"
														className="custom-file-input"
														onChange={handleUpload}
													/>
													<label className="custom-file-label">
														Choose file
													</label>
												</div>
											</div>
										</form>
										{/* DISPLAY FILE */}
										{!data ? (
											<Spinner />
										) : !data.length ? (
											<div></div>
										) : (
											data.map((ga) => {
												if (ga.F_SECURITY == 20) {
													return (
														<Tag
															role="button"
															key={ga.F_ID + "FILE"}
															className="w-100 bg-gray-400 px-2 py-2 my-1"
															onClick={async () => {
																window.location.assign(
																	`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
																		ga.F_FILENAME
																	)}`
																);
															}}
														>
															<div className="d-flex justify-content-between text-dark">
																<span className="text-uppercase">
																	<i className="fa fa-download mr-1"></i>
																	{ga.F_LABEL}
																</span>
																<span
																	className="font-weight-bold text-truncate"
																	style={{
																		maxWidth: "180px",
																	}}
																>
																	{ga.F_FILENAME}
																</span>
															</div>
														</Tag>
													);
												}
											})
										)}
									</div>
									<div className="col">
										{/* AP SUMMARY */}
										<Tag
											className={`${
												apTotal != null && apTotal / ga.F_AP == 1
													? "bg-primary"
													: "bg-gray-600"
											} w-100 text-white mr-4 px-4 py-2`}
										>
											<div className="d-flex justify-content-between font-weight-bold">
												<span>AP</span>
												<span>{usdFormat(ga.F_AP)}</span>
											</div>
										</Tag>
										{/* AP LIST */}
										<div className="row p-2">
											<div className="col-lg-3"></div>
											<div className="col-lg-9">
												{ap &&
													ap.map((ga) => (
														<Tag
															className={`${
																ga.F_InvoiceAmt == ga.F_PaidAmt &&
																ga.F_InvoiceAmt != 0
																	? "bg-primary"
																	: "bg-secondary"
															} btn py-0 text-white btn-block`}
															key={ga.F_ID + "AP"}
															onClick={() => setSelected(ga)}
														>
															<div className="d-flex justify-content-between font-weight-light">
																<span
																	className="text-truncate"
																	style={{
																		maxWidth: "130px",
																	}}
																>
																	{ga.F_SName}
																</span>
																<span>{usdFormat(ga.F_InvoiceAmt)}</span>
															</div>
														</Tag>
													))}
											</div>
										</div>
										<hr />
										{/* FILE UPLOAD */}
										<form className="upload">
											<Select
												options={apfiles}
												className="py-0"
												onChange={(e) => setAptype(e)}
												defaultValue={{ value: 0, label: "SELECT TYPE" }}
											/>
											<div className="input-group my-2" style={{ zIndex: "0" }}>
												<div className="custom-file w-75">
													<input
														type="file"
														id="ap"
														className="custom-file-input"
														onChange={handleUpload}
													/>
													<label className="custom-file-label">
														Choose file
													</label>
												</div>
											</div>
										</form>
										{/* DISPLAY FILE */}
										{!data ? (
											<Spinner />
										) : !data.length ? (
											<div></div>
										) : (
											data.map((ga) => {
												if (ga.F_SECURITY == 30) {
													return (
														<Tag
															role="button"
															key={ga.F_ID + "FILE"}
															className="w-100 bg-gray-400 px-2 py-2 my-1"
															onClick={async () => {
																window.location.assign(
																	`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
																		ga.F_FILENAME
																	)}`
																);
															}}
														>
															<div className="d-flex justify-content-between text-dark">
																<span className="text-uppercase">
																	<i className="fa fa-download mr-1"></i>
																	{ga.F_LABEL}
																</span>
																<span
																	className="font-weight-bold text-truncate"
																	style={{
																		maxWidth: "180px",
																	}}
																>
																	{ga.F_FILENAME}
																</span>
															</div>
														</Tag>
													);
												}
											})
										)}
									</div>
									<div className="col">
										<Tag
											className={`${
												((arTotal || 0) - (apTotal || 0) + (crdrTotal || 0)) /
													(ga.F_HouseTotal || ga.F_MasterTotal) ==
												1
													? "bg-primary"
													: "bg-gray-600"
											} w-100 text-white mr-4 px-4 py-2`}
										>
											<div className="d-flex justify-content-between font-weight-bold">
												<span>TOTAL</span>
												<span>
													{usdFormat(ga.F_HouseTotal || ga.F_MasterTotal)}
												</span>
											</div>
										</Tag>
									</div>
								</div>
							</div>
						))}
					{requested && requested.length ? (
						<div className="row mt-4">
							<h4 className="ml-2 h6 col-12">REQUEST</h4>
							{requested.map((ga) => (
								<div key={ga.ID} className="col-lg-12">
									<Tag fill={true} className="my-1">
										<div className="d-flex justify-content-between p-1">
											<span>{ga.Title}</span>
											<Status data={ga.Status} />
										</div>
									</Tag>
								</div>
							))}
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
			<Dialog
				isOpen={selected}
				onClose={() => {
					setSelected(false);
					setType(false);
					setSelectedFile(false);
					setSelectedFile2(false);
					// setFile(false);
				}}
				title="Request Approval"
			>
				<div className={Classes.DIALOG_BODY}>
					<h5>Would you like to request approval?</h5>

					<div className="card">
						<div className="card-header font-weight-bold">
							<div className="d-flex justify-content-between">
								<span>INVOICE {selected.F_InvoiceNo}</span>
								<span>DUE: {moment(selected.F_DueDate).utc().format("l")}</span>
							</div>
						</div>
						<div className="card-body">
							<p className="font-weight-bold">
								Payable To: <mark>{selected.F_SName}</mark>
							</p>
							<p>
								Address: {selected.F_Addr} {selected.F_City} {selected.F_State}{" "}
								{selected.F_ZipCode}
							</p>
							<p>Description: {selected.F_Descript}</p>
							<p className="font-weight-bold h5">
								Amount:{" "}
								<mark>
									{usdFormat(selected.F_InvoiceAmt)} {selected.F_Currency}
								</mark>
							</p>
							<hr />
							<div className="form-group mb-4">
								<label htmlFor="type">AP Type</label>
								<select
									className="form-control"
									id="type"
									onChange={(e) => setType(e.target.value)}
								>
									<option value={false}>Please select type</option>
									<option value="check">Check</option>
									<option value="card">Card</option>
									<option value="ach">ACH</option>
									<option value="wire">Wire</option>
								</select>

								<label htmlFor="type" className="mt-2">
									File
								</label>
								<select
									className="form-control"
									id="type"
									onChange={(e) => setSelectedFile(e.target.value)}
								>
									<option value={false}>Please select file</option>
									{data &&
										data.map((ga) => {
											if (ga.F_SECURITY == "30") {
												return (
													<option value={ga.F_ID} key={ga.F_ID + "FIRST"}>
														[{ga.F_LABEL.toUpperCase()}] {ga.F_FILENAME}
													</option>
												);
											}
										})}
								</select>

								<label htmlFor="type" className="mt-2">
									Backup Document
								</label>
								<select
									className="form-control"
									id="type"
									onChange={(e) => setSelectedFile2(e.target.value)}
								>
									<option value={false}>Please select file</option>
									{data &&
										data.map((ga) => {
											if (ga.F_SECURITY == "30" && ga.F_ID != selectedFile) {
												return (
													<option value={ga.F_ID} key={ga.F_ID + "FIRST"}>
														[{ga.F_LABEL.toUpperCase()}] {ga.F_FILENAME}
													</option>
												);
											}
										})}
								</select>
							</div>
						</div>
					</div>
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<Button
						text="Confirm"
						fill={true}
						onClick={() => postReq(selected)}
						disabled={!selectedFile || type == false || type == "false"}
					/>
					{/* WHEN REQUEST HAPPEN, UPLOAD TO DATABASE AND SEND THE NOTIFICATION TO IAN */}
				</div>
			</Dialog>
		</div>
	);
};
export default Profit;
