import { BlobProvider } from "@react-pdf/renderer";
import Cover from "./Cover";
import { Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { Col, Row } from "reactstrap";
import CheckRequestForm from "../../Dashboard/CheckRequestForm";
import moment from "moment";
import { useEffect, useState } from "react";
import useSWR from "swr";
import usdFormat from "../../../lib/currencyFormat";

export const File = ({ Reference, House, Master, Ap }) => {
	const [isClient, setIsClient] = useState(false);
	const [ApType, setApType] = useState("CHECK");
	const { data, mutate } = useSWR("/api/file/list?ref=" + Reference);
	useEffect(() => {
		setIsClient(true);
	}, [Reference]);

	return (
		<div className="card my-4 shadow">
			<div className="card-body">
				<h4 className="text-xl mt-2 mb-4">FILES</h4>
				<div className="row">
					<div className="col-lg-6">
						<div className="card shadow">
							<div className="card-body">
								<h6 className="h6 text-dark">Forms</h6>
								<Row>
									<Col lg="12" sm="12" className="mb-2">
										<BlobProvider
											document={<Cover master={Master} house={House} />}
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
																			stroke-width="4"
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
																				stroke-width="4"
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
										<button
											key={ga.F_ID + "FILE"}
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
													<i className="fa fa-download mx-2"></i>
													{ga.F_LABEL}
												</span>
												<span className="truncate text-right w-2/3">
													{ga.F_FILENAME}
												</span>
											</div>
										</button>
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
