// import { useDropzone } from "react-dropzone";
import axios, { post } from "axios";
import { BlobProvider } from "@react-pdf/renderer";
import Cover from "../Oim/Cover";
// import { Button, Menu, MenuItem } from "@blueprintjs/core";
import CheckRequestForm from "../../Dashboard/CheckRequestForm";
import moment from "moment";
import { useEffect, useState } from "react";
import { Popover2 } from "@blueprintjs/popover2";
import useSWR from "swr";
import React from "react";
import {
	Col,
	Button,
	UncontrolledPopover,
	PopoverBody,
	Row,
	ButtonGroup,
} from "reactstrap";
import { Tag, Menu, MenuItem } from "@blueprintjs/core";
import usdFormat from "../../../lib/currencyFormat";

export const File = ({ Reference, House, Master, Container, Ap }) => {
	const [isClient, setIsClient] = useState(false);
	const [ApType, setApType] = useState("CHECK");
	const { data, mutate } = useSWR("/api/file/list?ref=" + Reference);

	useEffect(() => {
		setIsClient(true);
	}, [Reference]);

	async function handleDelete(id) {
		const verify = confirm("DELETE?");
		if (verify) {
			const res = await fetch(`/api/file/hide?q=${id}`);
			if (res.ok) {
				mutate();
			}
		}
	}

	return (
		<div className="card my-4 shadow">
			<div className="card-body p-4">
				<h4 className="text-xl mt-2 mb-4">FILES</h4>
				<div className="row">
					<div className="col-lg-6">
						<div className="card shadow">
							<div className="card-body">
								<h6 className="h6 text-dark">Forms</h6>
								<Row>
									<Col lg="12" sm="12" className="mb-2">
										<BlobProvider
											document={
												<Cover
													master={Master}
													house={House}
													containers={Container}
												/>
											}
										>
											{({ blob, url, loading, error }) => (
												<a
													href={isClient ? url : "#"}
													target="__blank"
													style={{ textDecoration: "none" }}
												>
													<button className="px-3 bg-blue-500 text-white border-2 border-indigo-300 rounded py-1 my-1 hover:bg-indigo-600">
														<div className="flex">
															<img
																src="/image/icons/file-pdf-solid.svg"
																width="15"
																height="15"
																style={{
																	filter:
																		"brightness(0.5) invert(1) sepia(0.9)",
																}}
															></img>
															<span className="ml-2">
																{loading || error ? (
																	<svg
																		className="animate-spin -ml-1 mx-3 h-5 w-5 text-white"
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																	>
																		<circle
																			className="opacity-25"
																			cx="12"
																			cy="12"
																			r="10"
																			stroke="currentColor"
																			strokeWidth="4"
																		></circle>
																		<path
																			className="opacity-75"
																			fill="currentColor"
																			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																		></path>
																	</svg>
																) : (
																	"FOLDER COVER"
																)}
															</span>
														</div>
													</button>
												</a>
											)}
										</BlobProvider>
									</Col>
									<Col lg="12" sm="12" className="mb-2">
										<Popover2
											content={
												<Menu>
													<MenuItem
														text="CHECK"
														onClick={() => setApType("CHECK")}
													/>
													<MenuItem
														text="CARD"
														onClick={() => setApType("CARD")}
													/>
													<MenuItem
														text="ACH"
														onClick={() => setApType("ACH")}
													/>
													<MenuItem
														text="WIRE"
														onClick={() => setApType("WIRE")}
													/>
												</Menu>
											}
										>
											<button className="px-3 bg-blue-500 text-white border-2 border-indigo-300 rounded py-1 my-1 hover:bg-indigo-600">
												<i className="fa fa-window-restore mr-2"></i>
												TYPE: {ApType}
											</button>
										</Popover2>
										{/* <Button
											id="Popover1"
											className="bg-primary bg-gray-500 text-white mr-4 px-4 py-2"
										>
											TYPE: {ApType}
										</Button> */}
										{/* <UncontrolledPopover
											placement="right"
											trigger="legacy"
											target="Popover1"
										>
											<PopoverBody>
												<ButtonGroup>
													<Tag
														interactive={true}
														large={true}
														onClick={() => setApType("CHECK")}
													>
														Check
													</Tag>
													<Tag
														interactive={true}
														large={true}
														// className="mx-1"
														onClick={() => setApType("CARD")}
													>
														Card
													</Tag>
													<Tag
														interactive={true}
														large={true}
														onClick={() => setApType("ACH")}
													>
														ACH
													</Tag>
													<Tag
														interactive={true}
														large={true}
														// className="mx-1"
														onClick={() => setApType("WIRE")}
													>
														Wire
													</Tag>
												</ButtonGroup>
											</PopoverBody>
										</UncontrolledPopover> */}
									</Col>
									{isClient &&
										Ap.length > 0 &&
										Ap.map((ga) => (
											<Col key={ga.F_ID} lg="6" sm="12" className="my-1">
												<BlobProvider
													document={
														<CheckRequestForm
															check={ga.F_CheckNo}
															type={ApType}
															payto={ga.VENDOR}
															amt={ga.F_InvoiceAmt}
															oim={Reference}
															customer={House[0].CUSTOMER}
															inv={ga.F_InvoiceNo}
															metd={moment(Master.F_ETD)
																.utc()
																.format("MM/DD/YY")}
															meta={moment(Master.F_ETA)
																.utc()
																.format("MM/DD/YY")}
															pic={ga.F_U1ID || ""}
															today={moment().format("l")}
															desc={ga.F_Descript}
															pod={Master.F_DisCharge || Master.F_Discharge}
															comm={Master.F_mCommodity || Master.F_Commodity}
															shipper={House[0].SHIPPER}
															consignee={House[0].CONSIGNEE}
														/>
													}
												>
													{({ blob, url, loading, error }) => (
														<a
															href={url}
															target="__blank"
															style={{ textDecoration: "none" }}
														>
															<button className="px-3 w-100 bg-green-500 text-white border-2 border-green-300 rounded py-1 my-1 hover:bg-green-600">
																<div className="flex justify-between">
																	<img
																		src="/image/icons/file-pdf-solid.svg"
																		width="15"
																		height="15"
																		style={{
																			filter:
																				"brightness(0.5) invert(1) sepia(0.9)",
																		}}
																	></img>
																	{loading || error ? (
																		<svg
																			className="animate-spin -ml-1 mx-3 h-5 w-5 text-white"
																			xmlns="http://www.w3.org/2000/svg"
																			fill="none"
																			viewBox="0 0 24 24"
																		>
																			<circle
																				className="opacity-25"
																				cx="12"
																				cy="12"
																				r="10"
																				stroke="currentColor"
																				strokeWidth="4"
																			></circle>
																			<path
																				className="opacity-75"
																				fill="currentColor"
																				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
																			></path>
																		</svg>
																	) : (
																		<>
																			<span className="text-truncate w-1/2">
																				{ga.VENDOR}
																			</span>
																			<span>{usdFormat(ga.F_InvoiceAmt)}</span>
																		</>
																	)}
																</div>
															</button>
														</a>
													)}
												</BlobProvider>
											</Col>
										))}
								</Row>
							</div>
						</div>
					</div>
					<div className="col-lg-6">
						<div className="card shadow">
							<div className="card-body">
								<h6 className="h6 text-dark">Files</h6>

								{data && data.length ? (
									data.map((ga) => (
										<div
											className="flex flex-row text-center"
											key={ga.F_ID + "FILE"}
										>
											<button
												className="w-100 bg-gray-200 p-2 my-1 rounded border-2 border-gray-300 hover:bg-gray-400 hover:text-white"
												onClick={async () => {
													window.location.assign(
														`/api/file/get?ref=${Reference}&file=${encodeURIComponent(
															ga.F_FILENAME
														)}`
													);
												}}
											>
												<div className="flex justify-between">
													<span className="uppercase">
														<svg
															width="24"
															height="24"
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

														{ga.F_LABEL}
													</span>
													<span className="truncate text-right w-2/3">
														{ga.F_FILENAME}
													</span>
												</div>
											</button>
											<button
												className="w-10 mx-2 my-1 rounded border-2 border-gray-300 hover:bg-red-200 hover:text-white"
												onClick={() => handleDelete(ga.F_ID)}
											>
												<svg
													width="24"
													height="24"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													className="mx-auto"
												>
													<path
														d="M8.46445 15.5354L15.5355 8.46436"
														stroke="black"
														strokeWidth="1.5"
														strokeLinecap="round"
													/>
													<path
														d="M8.46446 8.46458L15.5355 15.5356"
														stroke="black"
														strokeWidth="1.5"
														strokeLinecap="round"
													/>
												</svg>
											</button>
										</div>
									))
								) : (
									<div className="w-100 bg-gray-200 p-2 rounded text-center">
										NO FILE
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default File;
