import cookie from "cookie";
import Layout from "../../../components/Layout";
import jwt from "jsonwebtoken";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Popover2 } from "@blueprintjs/popover2";
import {
	Dialog,
	Menu,
	MenuDivider,
	MenuItem,
	Classes,
	Checkbox,
	Button,
} from "@blueprintjs/core";
import { BlobProvider } from "@react-pdf/renderer";
import Cover from "../../../components/Forwarding/OexCover";
import moment from "moment";
import usdFormat from "../../../lib/currencyFormat";
import FreightPayment from "../../../components/Forwarding/FreightPayment";
import FreightFile from "../../../components/Forwarding/FreightFile";

import FreightProfit from "../../../components/Forwarding/FreightProfit";
import Notification from "../../../components/Toaster";
import CheckRequestForm from "../../../components/Request/ApRequestForm";
import FreightDetailDialog from "../../../components/Forwarding/FreightDetailDialog";
import Comments from "../../../components/Utils/Comment";

const Detail = ({ token, Reference }) => {
	const router = useRouter();
	// Store path to local storage
	if (typeof window !== "undefined") {
		var arr = [];
		var history = localStorage.getItem("pageHistory");
		if (history == null) {
			arr.unshift({ path: router.asPath, ref: Reference });
			localStorage.setItem("pageHistory", JSON.stringify(arr));
		} else {
			arr = JSON.parse(history);
			// If the page history is exist, check the most recent history
			// If the reference is same as current reference, do not store data
			if (arr[0].ref != Reference) {
				arr.unshift({ path: router.asPath, ref: Reference });
				localStorage.setItem("pageHistory", JSON.stringify(arr));
			}
		}
	}
	const { data } = useSWR(`/api/forwarding/oex/detail?ref=${Reference}`);
	const { data: paymentMethod } = useSWR("/api/accounting/getPaymentCode");
	const { data: files, mutate: fileMutate } = useSWR(
		"/api/file/list?ref=" + Reference
	);

	const [show, setShow] = useState(false);
	const [msg, setMsg] = useState(false);
	const [selectedPayment, setSelectedPayment] = useState(false);
	const [selectedApType, setSelectedApType] = useState(false);
	const [selectedUrgent, setSelectedUrgent] = useState(false);
	const [ApMemo, setApMemo] = useState("");
	const [invoiceMemo, setInvoiceMemo] = useState(false);
	const [invoiceAutoSend, setInvoiceAutoSend] = useState(1);
	const [selectedFile, setSelectedFile] = useState([]);
	const [submitLoading, setSubmitLoading] = useState(false);

	const { data: invoiceRequested } = useSWR(
		selectedPayment.type == 10
			? `/api/requests/getInvoiceRequestDetail?tbid=${selectedPayment.F_ID}`
			: null
	);
	const { data: invoiceDetail } = useSWR(
		selectedPayment.type == 10
			? `/api/requests/getInvoiceDetail?id=${selectedPayment.F_ID}`
			: null
	);

	const { data: crdrDetail } = useSWR(
		selectedPayment.type == 20
			? `/api/requests/getCreditDebitDetail?id=${selectedPayment.F_ID}`
			: null
	);
	const { data: crdrRequested } = useSWR(
		selectedPayment.type == 20
			? `/api/requests/getCrdrRequestDetail?tbid=${selectedPayment.F_ID}`
			: null
	);

	const { data: apRequested } = useSWR(`/api/requests/get?ref=${Reference}`);

	const { data: payableDetail } = useSWR(
		selectedPayment.type == 30
			? `/api/requests/getAccountPayableDetail?id=${selectedPayment.F_ID}`
			: null
	);

	async function handleInvoiceRequest() {
		// Set submit loading to be true
		setSubmitLoading(true);
		const approved = invoiceRequested[0].map((ga) => {
			if (ga.STATUS == 111 || ga.STATUS == 101) {
				return true;
			}
		});
		let disabled = approved.includes(true);
		if (disabled) {
			alert(`Invoice ${selectedPayment.F_InvoiceNo} has already requested`);
			setSelectedPayment(false);
			setSubmitLoading(false);
			return;
		}
		const sure = confirm(
			`Are you sure you want to request for invoice ${selectedPayment.F_InvoiceNo}?`
		);
		if (sure) {
			const invoiceRequestFetch = await fetch(
				"/api/requests/postInvoiceRequest",
				{
					method: "POST",
					body: JSON.stringify({
						invoiceReq: selectedPayment,
						memo: invoiceMemo,
						selectedFile: selectedFile.map((ga) => ga.ID),
						fileNames: selectedFile.map((ga) => ga.NAME),
						Reference: Reference,
						autosend: invoiceAutoSend,
						path: router.asPath,
					}),
				}
			);
			if (invoiceRequestFetch.status == 200) {
				setMsg(`Requested approval for ${selectedPayment.F_InvoiceNo}`);
				setSelectedPayment(false);
			} else {
				setMsg(`Error: ${invoiceRequestFetch.status}`);
			}
			setShow(true);
		}
		// Set submit loading to be false
		setSubmitLoading(false);
	}

	// Only Director update the invoice request
	async function handleInvoiceUpdate(approve, id) {
		setSubmitLoading(true);
		const invoiceUpdate = await fetch(
			`/api/requests/updateInvoice?id=${id}&approve=${approve}`,
			{
				method: "POST",
				body: JSON.stringify({
					invohd: selectedPayment,
				}),
			}
		);

		if (invoiceUpdate.status == 200) {
			setMsg(
				`The invoice is successfully ${approve ? "approved" : "rejected"}!`
			);
			setSelectedPayment(false);
		} else {
			setMsg(`Error: ${invoiceUpdate.status}`);
		}
		setShow(true);
		setSubmitLoading(false);
	}

	async function handleSendInvoice(invoice) {
		var purchaseOrder = [];
		data.H.map((ga) => {
			if (ga.F_ExPref) {
				purchaseOrder.push(ga.F_ExPref);
			}
		});
		setSubmitLoading(true);
		const sendInvoiceFetch = await fetch(`/api/requests/sendInvoice`, {
			method: "POST",
			body: JSON.stringify({
				invoice,
				invoiceReq: selectedPayment,
				files: invoiceRequested[1],
				MBL: data.M.F_MBLNo,
				HBL: data.H.map((na) => `${na.F_HBLNo} `),
				CONTAINER: data.C.map((ga) => `${ga.F_ContainerNo} `),
				PO: purchaseOrder,
			}),
		});
		const result = await sendInvoiceFetch.json();
		try {
			setMsg(result.msg);
		} catch (err) {
			setMsg(JSON.stringify(err));
		}
		setShow(true);
		setSubmitLoading(false);
	}

	async function handleCreditDebitRequest() {
		setSubmitLoading(true);
		const approved = crdrRequested[0].map((ga) => {
			if (ga.STATUS == 111 || ga.STATUS == 101) {
				return true;
			}
		});
		let disabled = approved.includes(true);
		if (disabled) {
			alert(`Credit Debit ${selectedPayment.F_CrDbNo} has already requested`);
			setSelectedPayment(false);
			setSubmitLoading(false);
			return;
		}
		const sure = confirm(
			`Are you sure you want to request for Credit Debit ${selectedPayment.F_CrDbNo}?`
		);
		if (sure) {
			// Success
			const crdrRequestFetch = await fetch("/api/requests/postCrdrRequest", {
				method: "POST",
				body: JSON.stringify({
					request: selectedPayment,
					memo: invoiceMemo,
					selectedFile: selectedFile.map((ga) => ga.ID),
					fileNames: selectedFile.map((ga) => ga.NAME),
					Reference: Reference,
					path: router.asPath,
				}),
			});
			if (crdrRequestFetch.status == 200) {
				setMsg(`Requested approval for ${selectedPayment.F_CrDbNo}`);
				console.log(await crdrRequestFetch.json());
				setSelectedPayment(false);
			} else {
				setMsg(`Error: ${selectedPayment.status}`);
			}
			setShow(true);
			setSelectedPayment(false);
			// Failed
		}
		setSubmitLoading(false);
	}

	// Only Director update the invoice request
	async function handleCrdrUpdate(approve, id) {
		setSubmitLoading(true);

		const crdrUpdate = await fetch(
			`/api/requests/updateCrdr?id=${id}&approve=${approve}`,
			{
				method: "POST",
				body: JSON.stringify({
					crdbhd: selectedPayment,
				}),
			}
		);

		if (crdrUpdate.status == 200) {
			setMsg(
				`The credit debit is successfully ${approve ? "approved" : "rejected"}!`
			);
			setSelectedPayment(false);
		} else {
			setMsg(`Error: ${crdrUpdate.status}`);
		}
		setShow(true);
		setSubmitLoading(false);
	}

	async function handleAccountPayableRequest() {
		setSubmitLoading(true);
		if (apRequested) {
			// Check if the current request has accounting approved, director approved, or requested
			const approved = apRequested.map((ga) => {
				if (ga.INVOICE == selectedPayment.F_InvoiceNo) {
					if (ga.STATUS == 121 || ga.STATUS == 111 || ga.STATUS == 101) {
						return true;
					}
				}
			});
			const disabled = approved.includes(true);
			if (disabled) {
				alert(`Invoice ${selectedPayment.F_InvoiceNo} has already requested.`);
				setSelectedPayment(false);
				setSubmitLoading(false);
				return;
			}
		}
		const sure = confirm(
			`Are you sure you want to request for Account Payable ${selectedPayment.F_InvoiceNo}?`
		);
		if (sure) {
			// Success
			const apRequestFetch = await fetch("/api/requests/postRequest", {
				method: "POST",
				headers: { ref: Reference, token: JSON.stringify(token) },
				body: JSON.stringify({
					...selectedPayment,
					memo: ApMemo,
					urgent: selectedUrgent,
					file: selectedFile,
					type: selectedApType,
					customer: data.H[0].CUSTOMER,
					path: router.asPath,
				}),
			});
			if (apRequestFetch.status == 200) {
				setMsg(`Requested approval for ${selectedPayment.F_InvoiceNo}`);
				setSelectedPayment(false);
				setShow(true);
			} else {
				setMsg(`Error: ${apRequestFetch.status}`);
				setShow(true);
			}
			setSelectedPayment(false);
			// Failed
		}
		setSubmitLoading(false);
	}

	var mailSubject, mailBody, mailHref;
	if (data && data.M) {
		mailSubject = `[JW] ${data.H.length > 0 && data.H[0].CUSTOMER} `;
		mailSubject += `MBL# ${data.M.F_MBLNo} `;
		mailSubject += `HBL# ${data.H.map((na) => `${na.F_HBLNo}`)} `;
		mailSubject += `CNTR# ${
			data.C && data.C.map((ga) => `${ga.F_ContainerNo} `)
		}`;
		mailSubject += `ETD ${moment(data.M.F_ETD).utc().format("l")} `;
		mailSubject += `ETA ${moment(data.M.F_ETA).utc().format("l")} // ${
			data.M.F_RefNo
		}`;

		mailBody = `Dear ${data.H.length > 0 && data.H[0].CUSTOMER}
      \nPlease note that there is an OCEAN EXPORT SHIPMENT for ${
				data.H.length > 0 && data.H[0].CUSTOMER
			} scheduled to depart on ${moment(data.M.F_ETA).utc().format("LL")}.
      \n_______________________________________
      ETD:  ${moment(data.M.F_ETD).format("L")}
      POL:  ${data.M.F_LoadingPort}
      ETA:  ${moment(data.M.F_ETA).format("L")}
      POD:  ${data.M.F_DisCharge}
      SHIPPER:  ${data.H.length > 0 && data.H[0].SHIPPER}
      CONSIGNEE:  ${data.H.length > 0 && data.H[0].CONSIGNEE}
      MBL:  ${data.M.F_MBLNo}
      HBL:  ${data.H.map((ga) => `${ga.F_HBLNo} `)}
      CONTAINER:  ${data.C.map(
				(ga) => `${ga.F_ContainerNo}${ga.F_SealNo && `(${ga.F_SealNo})`} `
			)}`;

		mailHref = data.M
			? `mailto:?cc=${token && token.email}&subject=${encodeURIComponent(
					mailSubject
			  )}&body=${encodeURIComponent(mailBody)}`
			: "";
	}

	const Status = ({ data }) => {
		if (data == 101) {
			return <span className="font-bold">Current Status: Requested</span>;
		}
		if (data == 110) {
			return (
				<span className="font-bold">Current Status: Director Rejected</span>
			);
		}
		if (data == 111) {
			return (
				<span className="font-bold">Current Status: Director Approved</span>
			);
		}
		if (data == 120) {
			return (
				<span className="font-bold">Current Status: Account Rejected</span>
			);
		}
		if (data == 121) {
			return (
				<span className="font-bold">Current Status: Account Approved</span>
			);
		}
		if (data == 131) {
			return <span className="font-bold">Current Status: CEO Approved</span>;
		} else {
			return <span className="font-bold">{data}</span>;
		}
	};

	return (
		<Layout TOKEN={token} TITLE={Reference} LOADING={!data}>
			<div>
				{data && data.M ? (
					<div>
						<div className="flex justify-between">
							<div className="flex flex-row items-center">
								<h3 className="text-xl font-bold uppercase dark:text-white mr-2">
									{Reference}
								</h3>
								{data.M.F_FileClosed == "0" ? (
									<Popover2
										content={
											<div className="card p-2 rounded-sm">
												{Reference} is now open
											</div>
										}
										autoFocus={false}
										minimal={true}
										interactionKind="hover"
										hoverOpenDelay={100}
									>
										<svg
											className="fill-current text-green-500"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
										>
											<path d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z" />
										</svg>
									</Popover2>
								) : (
									<Popover2
										content={
											<div className="card p-2 rounded-sm">
												{Reference} is closed
											</div>
										}
										autoFocus={false}
										minimal={true}
										interactionKind="hover"
										hoverOpenDelay={100}
									>
										<svg
											className="fill-current text-red-500"
											xmlns="http://www.w3.org/2000/svg"
											width="24"
											height="24"
											viewBox="0 0 24 24"
										>
											<path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z" />
										</svg>
									</Popover2>
								)}
							</div>
							<Popover2
								content={
									<Menu className="card p-3 rounded">
										<MenuDivider title="FOLDER COVER" />
										<BlobProvider
											document={
												<Cover
													master={data.M}
													house={data.H}
													containers={data.C}
												/>
											}
										>
											{({ blob, url, loading, error }) => (
												<MenuItem
													text="Download"
													icon="cloud-download"
													href={url}
													target="__blank"
													disabled={error || loading}
												/>
											)}
										</BlobProvider>

										<MenuDivider title="TOOLS" />
										<MenuItem
											text="Detail"
											icon="info-sign"
											onClick={() => setSelectedPayment({ type: 100 })}
										/>
										<MenuItem
											text="Email"
											icon="envelope"
											onClick={() => window.open(mailHref, "__blank")}
										/>
										<MenuItem
											text="Prev"
											icon="circle-arrow-left"
											onClick={() => {
												var ref = Reference.split("-")[0];
												var number = Reference.split("-")[1];
												router.push(
													`/forwarding/oex/${ref}-${parseInt(number) - 1}`
												);
											}}
										/>
										<MenuItem
											text="Next"
											icon="circle-arrow-right"
											onClick={() => {
												var ref = Reference.split("-")[0];
												var number = Reference.split("-")[1];
												router.push(
													`/forwarding/oex/${ref}-${parseInt(number) + 1}`
												);
											}}
										/>
									</Menu>
								}
								fill={true}
								minimal={true}
								autoFocus={false}
							>
								<button className="w-100 bg-white hover:bg-indigo-500 hover:text-white border border-gray-500 text-xs font-bold tracking-wider p-2 mb-2">
									ACTION <i className="ml-2 fa fa-caret-down"></i>
								</button>
							</Popover2>
						</div>
						{/* MASTER AND SHIPMENT GRID */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div className="card overflow-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50 dark:bg-gray-700">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
											>
												Customer
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
											>
												{data.H.length
													? data.H[0].CUSTOMER
													: "CUSTOMER NOT FOUND"}
											</th>
										</tr>
									</thead>
									<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">MBL</td>
											<td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
												{data.M.F_MBLNo}
											</td>
										</tr>
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">CARRIER</td>
											<td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
												{data.M.CARRIER}
											</td>
										</tr>
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">AGENT</td>
											<td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
												{data.M.AGENT}
											</td>
										</tr>
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">VESSEL</td>
											<td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
												{data.M.F_Vessel} {data.M.F_Voyage}
											</td>
										</tr>
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">BOOKING</td>
											<td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
												{data.M.F_BookingNo}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div className="card overflow-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50 dark:bg-gray-700">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
											>
												Shipment
											</th>
											<th scope="col"></th>
											<th scope="col"></th>
										</tr>
									</thead>
									<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">CREATED</td>
											<td className="px-6 py-2 font-bold whitespace-nowrap uppercase">
												{data.M.F_U1ID}
											</td>
											<td className="px-6 py-2 whitespace-nowrap text-right">
												{moment(data.M.F_U1Date).utc().format("LL")}
											</td>
										</tr>
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">UPDATED</td>
											<td className="px-6 py-2 font-bold whitespace-nowrap uppercase">
												{data.M.F_U2ID}
											</td>
											<td className="px-6 py-2 whitespace-nowrap text-right">
												{moment(data.M.F_U2Date).utc().format("LL")}
											</td>
										</tr>
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">POST DATE</td>
											<td className="px-6 py-2 font-bold whitespace-nowrap">
												{data.M.F_PLOFREC}
											</td>
											<td className="px-6 py-2 whitespace-nowrap text-right">
												{data.M.F_PostDate
													? moment(data.M.F_PostDate).utc().format("LL")
													: ""}
											</td>
										</tr>
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">SHIP</td>
											<td className="px-6 py-2 font-bold whitespace-nowrap">
												{data.M.F_LoadingPort}
											</td>
											<td className="px-6 py-2 whitespace-nowrap text-right">
												{data.M.F_ETD
													? moment(data.M.F_ETD).utc().format("LL")
													: ""}
											</td>
										</tr>
										<tr>
											<td className="px-6 py-2 whitespace-nowrap">ARRIVAL</td>
											<td className="px-6 py-2 font-bold whitespace-nowrap">
												{data.M.F_DisCharge}
											</td>
											<td className="px-6 py-2 whitespace-nowrap text-right">
												{data.M.F_ETA
													? moment(data.M.F_ETA).utc().format("LL")
													: ""}
											</td>
										</tr>
										{/* <tr>
                      <td className="px-6 py-2 whitespace-nowrap">CUT OFF</td>
                      <td className="px-6 py-2 font-bold whitespace-nowrap">
                        {data.M.F_PLOFDEL}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-right">
                        {data.M.F_CutOffDate
                          ? moment(data.M.F_CutOffDate).utc().format("LL")
                          : ""}
                      </td>
                    </tr> */}
										{/* <tr>
                      <td className="px-6 py-2 whitespace-nowrap">MOVE TYPE</td>
                      <td
                        colSpan={2}
                        className="px-6 py-2 font-bold whitespace-nowrap"
                      >
                        {data.M.F_MoveType}
                      </td>
                    </tr> */}
									</tbody>
								</table>
							</div>
						</div>
						{/* INVOICE CRDR AP GRID */}
						<div className="grid grid-cols-1 lg:grid-cols-3 my-4 gap-4">
							<FreightPayment
								Invoice={data.I}
								CrDr={data.CR}
								Ap={data.A}
								setSelectedPayment={setSelectedPayment}
								apRequested={apRequested || []}
							/>
							<FreightFile
								Reference={Reference}
								token={token}
								files={files}
								fileMutate={fileMutate}
								setMsg={setMsg}
								setShow={setShow}
							/>
						</div>
						{/* COMMENT + PROFIT GRID */}
						<div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-flow-col my-4 gap-4">
							<Comments
								tbnamd="T_OOMMAIN"
								tbid={data.M?.F_ID}
								uid={token.uid}
							/>
							<FreightProfit
								Profit={data.P}
								Invoice={data.I}
								CrDr={data.CR}
								Ap={data.A}
							/>
						</div>
						{/* Request Invoice Approval */}
						<Dialog
							isOpen={selectedPayment.type == 10}
							onOpening={() => setSelectedFile([])}
							onClose={() => {
								setSelectedPayment(false);
								setSelectedFile([]);
								setInvoiceMemo(false);
							}}
							title="Request Invoice Approval"
							className="dark:bg-gray-600 large-dialog"
						>
							<div className={Classes.DIALOG_BODY}>
								{invoiceRequested &&
									invoiceRequested[0] &&
									invoiceRequested[0].map((ga) => (
										<div className="card p-2 mb-2" key={ga.ID}>
											<div className="flex justify-between font-semibold">
												<Status data={ga.STATUS} />
												<span>{moment(ga.CREATED).format("L")}</span>
											</div>
											<div>{ga.MESSAGE}</div>
											<div className="flex justify-between mt-2">
												<Button
													text="Approve"
													fill={true}
													disabled={
														submitLoading ||
														ga.STATUS == 111 ||
														!(token.admin == 6 || token.admin == 5)
													}
													loading={submitLoading}
													onClick={() => handleInvoiceUpdate(true, ga.ID)}
													small={true}
												/>
												<Button
													text="Reject"
													fill={true}
													minimal={true}
													disabled={
														submitLoading ||
														ga.STATUS == 111 ||
														!(token.admin == 6 || token.admin == 5)
													}
													loading={submitLoading}
													onClick={() => handleInvoiceUpdate(false, ga.ID)}
													small={true}
												/>
											</div>
											{/* ONLY IF DIRECTOR APPROVED, THE INVOICE CAN BE SENT TO THE CUSTOMER */}
											{ga.STATUS == 111 && (
												<Button
													text="Send Invoice (Test)"
													icon="envelope"
													className="mt-2"
													loading={submitLoading}
													small={true}
													onClick={() => handleSendInvoice(ga)}
													// disabled={ga.AUTOSEND == 0}
													// for testing purpose - uncomment this after
												/>
											)}
										</div>
									))}
								{invoiceRequested &&
									invoiceRequested[1] &&
									invoiceRequested[1].map((ga) => (
										<div
											className="card p-2 mb-2 flex flex-row cursor-pointer hover:bg-gray-200"
											key={ga.F_FILE}
											onClick={async () => {
												window.location.assign(
													`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
														ga.FILENAME
													)}`
												);
											}}
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className="inline mr-1"
											>
												<path
													className="fill-current"
													d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
												/>
												<path
													className="fill-current"
													fillRule="evenodd"
													clipRule="evenodd"
													d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
												/>
											</svg>
											{ga.FILENAME}
										</div>
									))}
								<div className="card my-2">
									<div className="d-flex tracking-wider font-bold bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
										<span>{selectedPayment.F_InvoiceNo}</span>
									</div>
									{/* INVOICE SUMMARY AND DETAILS */}
									<div className="p-2">
										<div className="pl-2 font-bold text-lg">
											Invoice Summary
										</div>
										<div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
											<table className="min-w-full divide-y divide-gray-200">
												<tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Invoice Date
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{moment(selectedPayment.F_InvoiceDate)
																.utc()
																.format("LL")}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Due Date
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{moment(selectedPayment.F_DueDate)
																.utc()
																.format("LL")}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Bill Party
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{selectedPayment.BILLTO}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Ship Party
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{selectedPayment.SHIPTO}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Person in Charge
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{selectedPayment.F_U1ID} /{" "}
															{selectedPayment.F_U2ID}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Invoice Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{usdFormat(selectedPayment.F_InvoiceAmt)}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Paid Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{usdFormat(selectedPayment.F_PaidAmt)}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Balance Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap font-bold">
															{usdFormat(
																selectedPayment.F_InvoiceAmt -
																	(selectedPayment.F_PaidAmt || 0)
															)}
														</td>
													</tr>
												</tbody>
											</table>
										</div>

										<div className="pl-2 font-bold text-lg">Invoice Detail</div>

										<div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
											<table className="min-w-full divide-y divide-gray-200">
												<thead className="bg-gray-50 dark:bg-gray-700">
													<tr>
														<th
															scope="col"
															className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Description
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Rate
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Qty
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Amount
														</th>
													</tr>
												</thead>
												<tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200">
													{invoiceDetail &&
														invoiceDetail.map((inv) => (
															<tr key={inv.F_ID}>
																<td className="px-6 py-2 whitespace-nowrap">
																	<div className="flex items-center text-xs">
																		{inv.F_Description}
																		{/* <div className="flex-shrink-0 h-10 w-10">
                              </div> */}
																	</div>
																</td>
																<td className="px-6 py-2 whitespace-nowrap">
																	<div className="text-xs text-gray-900 dark:text-white">
																		{usdFormat(inv.F_Rate)}
																	</div>
																</td>
																<td className="px-6 py-2 whitespace-nowrap">
																	<span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
																		{inv.F_Qty}
																	</span>
																</td>
																<td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-200 text-right">
																	{usdFormat(inv.F_Amount)}
																</td>
															</tr>
														))}
												</tbody>
											</table>
										</div>

										<hr className="mt-4" />
										<div className="p-3">
											<label
												className="block text-gray-700 text-sm font-semibold mb-2"
												htmlFor="memo"
											>
												Memo <span className="text-red-600">*</span>
											</label>

											{/* Message Field has a limit of 100 character */}
											<input
												className="shadow appearance-none border rounded w-full py-2 px-3 my-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												id="memo"
												type="text"
												maxLength="100"
												placeholder="Write Memo"
												onChange={(e) => setInvoiceMemo(e.target.value)}
											/>

											<label
												className="block text-gray-700 text-sm font-semibold my-2"
												htmlFor="mail"
											>
												Email Setting <span className="text-red-600">*</span>
											</label>
											<Checkbox
												label="Auto Mail Invoice"
												defaultChecked
												id="mail"
												onChange={(e) => {
													if (e.target.checked) {
														setInvoiceAutoSend(1);
													} else {
														setInvoiceAutoSend(0);
													}
												}}
											/>

											<label className="block text-gray-700 text-sm font-semibold my-2">
												Files
											</label>

											{files &&
												files.map((ga) => {
													if (ga.F_SECURITY == "10") {
														return (
															<Checkbox
																key={ga.F_ID + "CHECK"}
																label={`[${ga.F_LABEL.toUpperCase()}] ${
																	ga.F_FILENAME
																}`}
																onChange={(e) => {
																	if (e.target.checked) {
																		setSelectedFile((prev) => [
																			...prev,
																			{ ID: ga.F_ID, NAME: ga.F_FILENAME },
																		]);
																	} else {
																		var arr = [...selectedFile];
																		var index = arr.findIndex(
																			(i) => i.ID == ga.F_ID
																		);
																		if (index !== -1) {
																			arr.splice(index, 1);
																			setSelectedFile(arr);
																		}
																	}
																}}
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
									text="Submit request"
									fill={true}
									loading={submitLoading}
									disabled={!invoiceMemo}
									onClick={handleInvoiceRequest}
								/>
							</div>
						</Dialog>
						{/* Request Credit Debit Approval */}
						<Dialog
							isOpen={selectedPayment.type == 20}
							onOpening={() => setSelectedFile([])}
							onClose={() => {
								setSelectedPayment(false);
								setSelectedFile([]);
							}}
							title="Request Credit Debit Approval"
							className="dark:bg-gray-600 large-dialog"
						>
							<div className={Classes.DIALOG_BODY}>
								{crdrRequested &&
									crdrRequested[0] &&
									crdrRequested[0].map((ga) => (
										<div className="card p-2 mb-2" key={ga.ID}>
											<div className="flex justify-between font-semibold">
												<Status data={ga.STATUS} />
												<span>{moment(ga.CREATED).format("L")}</span>
											</div>
											<div>{ga.MESSAGE}</div>
											<div className="flex justify-between mt-2">
												<Button
													text="Approve"
													fill={true}
													disabled={
														submitLoading ||
														ga.STATUS == 111 ||
														!(token.admin == 6 || token.admin == 5)
													}
													loading={submitLoading}
													onClick={() => handleCrdrUpdate(true, ga.ID)}
													small={true}
												/>
												<Button
													text="Reject"
													fill={true}
													minimal={true}
													disabled={
														submitLoading ||
														ga.STATUS == 111 ||
														!(token.admin == 6 || token.admin == 5)
													}
													loading={submitLoading}
													onClick={() => handleCrdrUpdate(false, ga.ID)}
													small={true}
												/>
											</div>
											{/* ONLY IF DIRECTOR APPROVED, THE INVOICE CAN BE SENT TO THE CUSTOMER */}
											{/* {ga.STATUS == 111 && (
                        <Button
                          text="Send Invoice (Test)"
                          icon="envelope"
                          className="mt-2"
                          loading={submitLoading}
                          small={true}
                          onClick={() => handleSendInvoice(ga)}
                          disabled={ga.AUTOSEND == 0}
                        />
                      )} */}
										</div>
									))}
								{crdrRequested &&
									crdrRequested[1] &&
									crdrRequested[1].map((ga) => (
										<div
											className="card p-2 mb-2 flex flex-row cursor-pointer hover:bg-gray-200"
											key={ga.F_FILE}
											onClick={async () => {
												window.location.assign(
													`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
														ga.FILENAME
													)}`
												);
											}}
										>
											<svg
												width="20"
												height="20"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className="inline mr-1"
											>
												<path
													className="fill-current"
													d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
												/>
												<path
													className="fill-current"
													fillRule="evenodd"
													clipRule="evenodd"
													d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
												/>
											</svg>
											{ga.FILENAME}
										</div>
									))}
								<div className="card my-2">
									<div className="d-flex tracking-wider font-bold bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
										<span>{selectedPayment.F_CrDbNo}</span>
									</div>
									<div className="p-2">
										<div className="pl-2 font-bold text-lg">
											Credit Debit Summary
										</div>
										<div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
											<table className="min-w-full divide-y divide-gray-200">
												<tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Invoice Date
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{moment(selectedPayment.F_InvoiceDate)
																.utc()
																.format("LL")}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Due Date
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{moment(selectedPayment.F_DueDate)
																.utc()
																.format("LL")}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Agent
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{selectedPayment.AGENT}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Person in Charge
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{selectedPayment.F_U1ID} /{" "}
															{selectedPayment.F_U2ID}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Invoice Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{usdFormat(selectedPayment.F_Total)}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Paid Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{usdFormat(selectedPayment.F_PaidAmt)}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Balance Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap font-bold">
															{usdFormat(
																selectedPayment.F_Total -
																	(selectedPayment.F_PaidAmt || 0)
															)}
														</td>
													</tr>
												</tbody>
											</table>
										</div>

										<div className="pl-2 font-bold text-lg">
											Credit Debit Detail
										</div>

										<div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
											<table className="min-w-full divide-y divide-gray-200">
												<thead className="bg-gray-50 dark:bg-gray-700">
													<tr>
														<th
															scope="col"
															className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Description
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Crdit
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Debit
														</th>
													</tr>
												</thead>
												<tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200">
													{crdrDetail &&
														crdrDetail.map((inv) => (
															<tr key={inv.F_ID}>
																<td className="px-6 py-2 whitespace-nowrap">
																	<div className="flex items-center text-xs">
																		{inv.F_Description}
																		{/* <div className="flex-shrink-0 h-10 w-10">
                              </div> */}
																	</div>
																</td>
																<td className="px-6 py-2 whitespace-nowrap text-xs text-red-400 text-right">
																	{usdFormat(inv.F_Credit)}
																</td>
																<td className="px-6 py-2 whitespace-nowrap text-xs text-blue-400 text-right">
																	{usdFormat(inv.F_Debit)}
																</td>
															</tr>
														))}
												</tbody>
											</table>
										</div>

										<hr className="mt-4" />
										<div className="p-3">
											<label
												className="block text-gray-700 text-sm font-semibold mb-2"
												htmlFor="memo"
											>
												Memo <span className="text-red-600">*</span>
											</label>

											{/* Message Field has a limit of 100 character */}
											<input
												className="shadow appearance-none border rounded w-full py-2 px-3 my-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												id="memo"
												type="text"
												maxLength="100"
												placeholder="Write Memo"
												onChange={(e) => setInvoiceMemo(e.target.value)}
											/>

											<label
												className="block text-gray-700 text-sm font-semibold my-2"
												htmlFor="mail"
											>
												Email Setting <span className="text-red-600">*</span>
											</label>
											<Checkbox
												label="Auto Mail Invoice"
												defaultChecked
												id="mail"
												onChange={(e) => {
													if (e.target.checked) {
														setInvoiceAutoSend(1);
													} else {
														setInvoiceAutoSend(0);
													}
												}}
											/>

											<label className="block text-gray-700 text-sm font-semibold my-2">
												Files
											</label>

											{files &&
												files.map((ga) => {
													if (ga.F_SECURITY == "20") {
														return (
															<Checkbox
																key={ga.F_ID + "CHECK"}
																label={`[${ga.F_LABEL.toUpperCase()}] ${
																	ga.F_FILENAME
																}`}
																onChange={(e) => {
																	if (e.target.checked) {
																		setSelectedFile((prev) => [
																			...prev,
																			{ ID: ga.F_ID, NAME: ga.F_FILENAME },
																		]);
																	} else {
																		var arr = [...selectedFile];
																		var index = arr.findIndex(
																			(i) => i.ID == ga.F_ID
																		);
																		if (index !== -1) {
																			arr.splice(index, 1);
																			setSelectedFile(arr);
																		}
																	}
																}}
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
									text="Submit request"
									fill={true}
									disabled={!invoiceMemo}
									onClick={handleCreditDebitRequest}
									loading={submitLoading}
								/>
							</div>
						</Dialog>
						{/* Request Account Payable Approval */}
						<Dialog
							isOpen={selectedPayment && selectedPayment.type == 30}
							onOpening={() => setSelectedFile([])}
							onClose={() => {
								setSelectedPayment(false);
								setSelectedApType(false);
								setSelectedFile([]);
							}}
							title="Request Account Payable Approval"
							className="dark:bg-gray-600 large-dialog"
						>
							<div className={Classes.DIALOG_BODY}>
								{apRequested &&
									apRequested.map((ga) => {
										if (ga.INVOICE == selectedPayment.F_InvoiceNo) {
											return (
												<div className="card p-2 mb-2" key={ga.ID}>
													<div className="flex justify-between">
														<Status data={ga.STATUS} />
														<span>
															{moment(ga.CREATED).utc().format("LLL")}
														</span>
													</div>
												</div>
											);
										}
									})}
								<div className="card my-2">
									<div className="d-flex tracking-wider font-bold bg-gray-100 dark:bg-gray-500 rounded-t shadow-inner p-3">
										<span>{selectedPayment.F_InvoiceNo}</span>
									</div>
									<div className="p-2">
										<div className="pl-2 font-bold text-lg flex justify-between">
											<span>Account Payable Summary</span>
											<BlobProvider
												document={
													<CheckRequestForm
														pic={
															selectedPayment.F_U1ID
																? selectedPayment.F_U1ID.toUpperCase()
																: ""
														}
														payto={selectedPayment.VENDOR}
														amt={selectedPayment.F_InvoiceAmt}
														oim={Reference.toUpperCase()}
														type={selectedApType}
														inv={selectedPayment.F_InvoiceNo}
														desc={selectedPayment.F_Descript}
														customer={
															data.H.length > 0
																? data.H[0].CUSTOMER
																: "NO CUSTOMER"
														}
														metd={moment(data.M.F_ETD).utc().format("MM/DD/YY")}
														meta={moment(data.M.F_ETA).utc().format("MM/DD/YY")}
														pod={data.M.F_DisCharge}
														comm={data.H[0].F_Commodity || ""}
														shipper={
															data.H.length > 0
																? data.H[0].SHIPPER
																: "NO SHIPPER"
														}
														consignee={
															data.H.length > 0
																? data.H[0].CONSIGNEE
																: "NO CONSIGNEE"
														}
													/>
												}
											>
												{({ blob, url, loading, error }) => (
													<Button
														text="Account Payable Request Form"
														fill={true}
														className="w-50"
														small={true}
														onClick={() => window.open(url, "__blank")}
														icon="document-open"
														disabled={
															error ||
															(apRequested &&
																apRequested.filter(
																	(e) =>
																		e.INVOICE == selectedPayment.F_InvoiceNo
																).length)
														}
														loading={loading}
													/>
												)}
											</BlobProvider>
										</div>
										<div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
											<table className="min-w-full divide-y divide-gray-200">
												<tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Invoice Date
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{moment(selectedPayment.F_InvoiceDate)
																.utc()
																.format("LL")}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Due Date
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{moment(selectedPayment.F_DueDate)
																.utc()
																.format("LL")}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Vendor
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{selectedPayment.VENDOR}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Person in Charge
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{selectedPayment.F_U1ID} /{" "}
															{selectedPayment.F_U2ID}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Invoice Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{usdFormat(selectedPayment.F_InvoiceAmt)}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Paid Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap">
															{usdFormat(selectedPayment.F_PaidAmt)}
														</td>
													</tr>
													<tr>
														<td className="px-6 py-2 whitespace-nowrap">
															Balance Amount
														</td>
														<td className="px-6 py-2 whitespace-nowrap font-bold">
															{usdFormat(
																selectedPayment.F_InvoiceAmt -
																	(selectedPayment.F_PaidAmt || 0)
															)}
														</td>
													</tr>
												</tbody>
											</table>
										</div>

										<div className="pl-2 font-bold text-lg">
											Account Payable Detail
										</div>
										<div className="m-2 shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
											<table className="min-w-full divide-y divide-gray-200">
												<thead className="bg-gray-50 dark:bg-gray-700">
													<tr>
														<th
															scope="col"
															className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Description
														</th>
														<th
															scope="col"
															className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
														>
															Amount
														</th>
													</tr>
												</thead>
												<tbody className="bg-white dark:bg-gray-500 divide-y divide-gray-200">
													{payableDetail &&
														payableDetail.map((inv) => (
															<tr key={inv.F_ID}>
																<td className="px-6 py-2 whitespace-nowrap">
																	<div className="flex items-center text-xs">
																		{inv.F_Description}
																		{/* <div className="flex-shrink-0 h-10 w-10">
                              </div> */}
																	</div>
																</td>
																<td className="px-6 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-200 text-right">
																	{usdFormat(inv.F_Amount)}
																</td>
															</tr>
														))}
												</tbody>
											</table>
										</div>
										<hr className="mt-4" />
										<div className="px-3 pt-3">
											<label
												className="block text-gray-700 text-sm font-semibold mb-2"
												htmlFor="urgent"
											>
												Urgent
											</label>
											<Checkbox
												label="Urgent Account Payable"
												id="urgent"
												onChange={(e) => {
													if (e.target.checked) {
														setSelectedUrgent(true);
													} else {
														setSelectedUrgent(false);
													}
												}}
											/>
											<label
												className="block text-gray-700 text-sm font-semibold mb-2"
												htmlFor="memo"
											>
												Memo
											</label>
											<input
												className="shadow appearance-none border rounded w-full py-2 px-3 my-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
												id="memo"
												type="text"
												maxLength="100"
												placeholder="Write Memo"
												onChange={(e) => setApMemo(e.target.value)}
											/>
										</div>
										<div className="p-3">
											<label
												className="block text-gray-700 text-sm font-semibold mb-2"
												htmlFor="type"
											>
												Account Payable Type{" "}
												<span className="text-red-600">*</span>
											</label>
											<select
												className="form-control"
												id="type"
												onChange={(e) => setSelectedApType(e.target.value)}
											>
												<option value={false}>Please select type</option>
												{paymentMethod &&
													paymentMethod.map((ga, i) => (
														<option
															key={`${i}-payment`}
															disabled={!ga.F_ACTIVE}
															value={`${ga.F_PAYMENT_METHOD}${
																ga.F_PAYMENT_DETAIL
																	? ` ${ga.F_PAYMENT_DETAIL}`
																	: ""
															}`}
														>
															{ga.F_PAYMENT_METHOD} {ga.F_PAYMENT_DETAIL}
														</option>
													))}
											</select>
											<label className="block text-gray-700 text-sm font-semibold my-2">
												Files
											</label>

											{files &&
												files.map((ga) => {
													if (ga.F_SECURITY == "30") {
														return (
															<Checkbox
																key={ga.F_ID + "CHECK"}
																label={`[${ga.F_LABEL.toUpperCase()}] ${
																	ga.F_FILENAME
																}`}
																className="truncate"
																onChange={(e) => {
																	if (e.target.checked) {
																		setSelectedFile((prev) => [...prev, ga]);
																	} else {
																		var arr = [...selectedFile];
																		var index = arr.findIndex(
																			(i) => i.F_ID == ga.F_ID
																		);
																		if (index !== -1) {
																			arr.splice(index, 1);
																			setSelectedFile(arr);
																		}
																	}
																}}
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
									text="Submit request"
									fill={true}
									disabled={!selectedApType || !selectedFile.length}
									onClick={handleAccountPayableRequest}
									loading={submitLoading}
								/>
							</div>
						</Dialog>
						<Dialog
							isOpen={selectedPayment.type == 100}
							onClose={() => {
								setSelectedPayment(false);
							}}
							title="Shipment Detail"
							className="dark:bg-gray-600 large-dialog"
						>
							<div className={Classes.DIALOG_BODY}>
								<FreightDetailDialog house={data.H} container={data.C} />
							</div>
						</Dialog>
						<Notification show={show} setShow={setShow} msg={msg} />
					</div>
				) : (
					<section className="flex items-center justify-center py-10 text-white sm:py-16 md:py-24 lg:py-32">
						<div className="relative max-w-3xl px-10 text-center text-white auto lg:px-0">
							<div className="flex justify-between">
								<h1 className="relative flex flex-col text-6xl font-extrabold text-left text-black">
									Shipment
									<span>Does</span>
									<span>Not</span>
									<span>Exist</span>
								</h1>
							</div>

							<div className="my-16 border-b border-gray-300 lg:my-24"></div>

							<h2 className="text-left text-gray-500 xl:text-xl"></h2>
						</div>
					</section>
				)}
			</div>
		</Layout>
	);
};

export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);

		return {
			props: {
				token: token,
				Reference: query.Detail,
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

export default Detail;
