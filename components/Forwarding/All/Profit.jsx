import { Classes, Dialog, Button, Checkbox } from "@blueprintjs/core";
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
	const [selectedFile, setSelectedFile] = useState([]);
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
			return <span className="text-white">Current Status: Requested</span>;
		}
		if (data == 110) {
			return (
				<span className="text-white">Current Status: Director Rejected</span>
			);
		}
		if (data == 111) {
			return (
				<span className="text-white">Current Status: Director Approved</span>
			);
		}
		if (data == 120) {
			return (
				<span className="text-white">Current Status: Account Rejected</span>
			);
		}
		if (data == 121) {
			return (
				<span className="text-white">Current Status: Account Approved</span>
			);
		}
	};

	useEffect(() => {
		// WHEN THE REFERENCE CHANGED, RESET SELECTED FILE
		setSelectedFile([]);
	}, [Reference]);

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
				type: type,
				customer: customer,
				path: router.asPath,
			}),
		});
		if (req.status === 200) {
			alert("Requested, Thank you!");
			setSelectedFile([]);
			setSelected(false);
		} else {
			setSelectedFile([]);
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
					<h4 className="text-xl mb-4">SUMMARY</h4>
					{profit &&
						profit.map((ga, i) => (
							<div key={i + "PROFIT"}>
								<div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 gap-4">
									{/* AR */}
									<div>
										{/* AR SUMMARY */}
										<div
											className={`${
												arTotal != null && arTotal / ga.F_AR == 1
													? "bg-blue-400"
													: "bg-gray-400"
											} w-100 text-white rounded-sm px-3 py-1`}
										>
											<div className="flex justify-between">
												<span>AR</span>
												<span>{usdFormat(ga.F_AR)}</span>
											</div>
										</div>
										{/* INVOICE LIST */}
										<div className="grid grid-col-3 gap-2">
											<div className="col-start-2 col-span-2">
												{invoice &&
													invoice.map((ga) => (
														<div
															className={`${
																ga.F_InvoiceAmt == ga.F_PaidAmt &&
																ga.F_InvoiceAmt != 0
																	? "bg-blue-400"
																	: "bg-gray-400"
															} px-2 py-1 text-white cursor-not-allowed bg-blue-500 rounded-sm font-light my-1 hover:bg-blue-600`}
															key={ga.F_ID + "INVO"}
															// onClick={() => setSelected(ga)}
														>
															<div className="flex justify-between">
																<span>{ga.F_InvoiceNo}</span>
																<span className="font-bold">
																	{usdFormat(ga.F_InvoiceAmt)}
																</span>
															</div>
														</div>
													))}
											</div>
										</div>
										{/* FILE UPLOAD */}
										<form className="upload mt-4 font-light text-sm">
											<Select
												options={arfiles}
												className="w-80 mb-2"
												onChange={(e) => setArtype(e)}
												defaultValue={{ value: 0, label: "SELECT TYPE" }}
											/>
											<div className="input-group z-0 h-20">
												<div className="custom-file">
													<input
														type="file"
														id="invoice"
														className="custom-file-input"
														onChange={handleUpload}
													/>
													<label className="custom-file-label font-light">
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
														<button
															key={ga.F_ID + "FILE"}
															className="w-100 px-2 bg-blue-500 text-white border-2 border-indigo-300 rounded py-2 my-1 hover:bg-indigo-600"
															onClick={async () => {
																window.location.assign(
																	`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
																		ga.F_FILENAME
																	)}`
																);
															}}
														>
															<div className="flex justify-between font-semibold text-xs">
																<span className="text-uppercase">
																	<i className="fa fa-download mr-1"></i>
																	{ga.F_LABEL}
																</span>
																<span
																	className="text-truncate"
																	style={{
																		maxWidth: "180px",
																	}}
																>
																	{ga.F_FILENAME}
																</span>
															</div>
														</button>
													);
												}
											})
										)}
									</div>
									{/* CRDR */}
									<div>
										{/* CRDR SUMMARY */}
										<div
											className={`${
												crdrTotal != null && crdrTotal / ga.F_CrDr == 1
													? "bg-blue-400"
													: "bg-gray-400"
											} w-100 text-white rounded-sm mr-4 px-3 py-1`}
										>
											<div className="flex justify-between">
												<span>CRDR</span>
												<span>{usdFormat(ga.F_CrDr)}</span>
											</div>
										</div>
										{/* CRDR LIST */}
										<div className="grid grid-col-3 gap-2">
											<div className="col-start-2 col-span-2">
												{crdr &&
													crdr.map((ga) => (
														<div
															className={`${
																ga.F_Total == ga.F_PaidAmt && ga.F_Total != 0
																	? "bg-blue-400"
																	: "bg-gray-400"
															} px-2 py-1 text-white cursor-not-allowed bg-blue-500 rounded-sm font-light my-1 hover:bg-blue-600`}
															key={ga.F_ID + "CRDR"}
														>
															<div className="flex justify-between">
																<span>{ga.F_CrDbNo}</span>
																<span className="font-bold">
																	{usdFormat(ga.F_Total)}
																</span>
															</div>
														</div>
													))}
											</div>
										</div>
										{/* FILE UPLOAD */}
										<form className="upload mt-4 font-light text-sm">
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
														<button
															key={ga.F_ID + "FILE"}
															className="w-100 px-2 bg-blue-500 text-white border-2 border-indigo-300 rounded py-2 my-1 hover:bg-indigo-600"
															onClick={async () => {
																window.location.assign(
																	`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
																		ga.F_FILENAME
																	)}`
																);
															}}
														>
															<div className="flex justify-between font-semibold text-xs">
																<span className="text-uppercase">
																	<i className="fa fa-download mr-1"></i>
																	{ga.F_LABEL}
																</span>
																<span
																	className="text-truncate"
																	style={{
																		maxWidth: "180px",
																	}}
																>
																	{ga.F_FILENAME}
																</span>
															</div>
														</button>
													);
												}
											})
										)}
									</div>
									{/* AP */}
									<div>
										{/* AP SUMMARY */}
										<div
											className={`${
												apTotal != null && apTotal / ga.F_AP == 1
													? "bg-blue-400"
													: "bg-gray-400"
											} w-100 text-white rounded-sm mr-4 px-3 py-1`}
										>
											<div className="flex justify-between">
												<span>AP</span>
												<span>{usdFormat(ga.F_AP)}</span>
											</div>
										</div>
										{/* AP LIST */}
										<div className="grid grid-col-3 gap-2">
											<div className="col-start-2 col-span-2">
												{ap &&
													ap.map((ga) => (
														<div
															className={`${
																ga.F_InvoiceAmt == ga.F_PaidAmt &&
																ga.F_InvoiceAmt != 0
																	? "bg-blue-400"
																	: "bg-gray-400"
															} px-2 py-1 text-white cursor-pointer bg-blue-500 rounded-sm font-light my-1 hover:bg-blue-600`}
															key={ga.F_ID + "AP"}
															onClick={() => setSelected(ga)}
														>
															<div className="flex justify-between">
																<span className="truncate w-1/2">
																	{ga.VENDOR}
																</span>
																<span className="font-bold">
																	{usdFormat(ga.F_InvoiceAmt)}
																</span>
															</div>
														</div>
													))}
											</div>
										</div>
										{/* FILE UPLOAD */}
										<form className="upload mt-4 font-light text-sm">
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
											<div></div>
										) : !data.length ? (
											<div></div>
										) : (
											data.map((ga) => {
												if (ga.F_SECURITY == 30) {
													return (
														<button
															key={ga.F_ID + "FILE"}
															className="w-100 px-2 bg-blue-500 text-white border-2 border-indigo-300 rounded py-2 my-1 hover:bg-indigo-600"
															onClick={async () => {
																window.location.assign(
																	`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
																		ga.F_FILENAME
																	)}`
																);
															}}
														>
															<div className="flex justify-between font-semibold text-xs">
																<span className="text-uppercase">
																	<i className="fa fa-download mr-1"></i>
																	{ga.F_LABEL}
																</span>
																<span
																	className="text-truncate"
																	style={{
																		maxWidth: "180px",
																	}}
																>
																	{ga.F_FILENAME}
																</span>
															</div>
														</button>
													);
												}
											})
										)}
									</div>
									{/* TOTAL */}
									<div>
										<div
											className={`${
												((arTotal || 0) - (apTotal || 0) + (crdrTotal || 0)) /
													(ga.F_HouseTotal || ga.F_MasterTotal) ==
												1
													? "bg-blue-400"
													: "bg-gray-400"
											} w-100 text-white rounded-sm mr-4 px-3 py-1`}
										>
											<div className="flex justify-between">
												<span>TOTAL</span>
												<span>
													{usdFormat(ga.F_HouseTotal || ga.F_MasterTotal)}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					{requested && requested.length ? (
						<div className="w-100">
							<h4 className="text-xl mb-4">REQUEST</h4>
							{requested.map((ga) => (
								<div key={ga.ID}>
									<div className="my-1">
										<div className="flex justify-between p-1 bg-purple-500 rounded-sm text-white">
											<span>{ga.Title}</span>
											<Status data={ga.Status} />
										</div>
									</div>
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
					setSelectedFile([]);
					// setSelectedFile2(false);
					// setFile(false);
				}}
				title="Request Approval"
				className="dark:bg-gray-600"
			>
				<div className={Classes.DIALOG_BODY}>
					<h5>Would you like to request approval?</h5>

					<div className="card my-2">
						<div className="d-flex justify-content-between bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
							<span>INVOICE {selected.F_InvoiceNo}</span>
							<span>DUE: {moment(selected.F_DueDate).utc().format("l")}</span>
						</div>
						<div className="leading-8 p-3">
							<p>
								{selected.VENDOR
									? `Payable To: ${selected.VENDOR}`
									: selected.BILLTO
									? `Invoice To: ${selected.BILLTO}`
									: ""}
							</p>
							<p>
								{selected.SHIPTO
									? `Ship Party: ${selected.SHIPTO}`
									: `Description: ${selected.F_Descript}`}
							</p>
							<p className="text-lg font-semibold">
								Amount:{" "}
								<mark>
									{usdFormat(selected.F_InvoiceAmt)} {selected.F_Currency}
								</mark>
							</p>
							<div className="form-group mb-4">
								<label htmlFor="type" className="text-indigo-400">
									AP Type
								</label>
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

								<label htmlFor="type" className="mt-2 text-indigo-400">
									File
								</label>

								{data &&
									data.map((ga) => {
										if (ga.F_SECURITY == "30") {
											return (
												<Checkbox
													key={ga.F_ID + "CHECK"}
													onChange={(e) => {
														if (e.target.checked) {
															setSelectedFile((prev) => [...prev, ga.F_ID]);
														} else {
															var arr = [...selectedFile];
															var index = arr.indexOf(ga.F_ID);
															if (index !== -1) {
																arr.splice(index, 1);
																setSelectedFile(arr);
															}
														}
													}}
													label={`[${ga.F_LABEL.toUpperCase()}] ${
														ga.F_FILENAME
													}`}
												></Checkbox>
											);
										}
									})}
							</div>
						</div>
					</div>
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<Button
						text="Confirm"
						fill={true}
						onClick={() => postReq(selected)}
						disabled={!selectedFile.length || type == false || type == "false"}
					/>
					{/* WHEN REQUEST HAPPEN, UPLOAD TO DATABASE AND SEND THE NOTIFICATION TO IAN */}
				</div>
			</Dialog>
		</div>
	);
};
export default Profit;
