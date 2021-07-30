// import { useDropzone } from "react-dropzone";
import axios, { post } from "axios";
import { BlobProvider } from "@react-pdf/renderer";
import Cover from "../Oim/Cover";
// import { Button, Menu, MenuItem } from "@blueprintjs/core";
import CheckRequestForm from "../../Dashboard/CheckRequestForm";
import moment from "moment";
import { useEffect, useState } from "react";
// import { Popover2 } from "@blueprintjs/popover2";
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
import { Tag } from "@blueprintjs/core";

export const File = ({ Reference, House, Master, Container, Ap }) => {
	const [isClient, setIsClient] = useState(false);
	const [ApType, setApType] = useState("CHECK");
	const { data, mutate } = useSWR("/api/file/list?ref=" + Reference);

	useEffect(() => {
		setIsClient(true);
	}, [Reference]);

	// function uploadFile(e) {
	// 	var uploadedFile = e.target.files[0];
	// 	if (uploadedFile) {
	// 		const formData = new FormData();
	// 		formData.append("userPhoto", uploadedFile);
	// 		const config = {
	// 			headers: {
	// 				"content-type": "multipart/form-data",
	// 				label: e.target.id,
	// 				level: "99",
	// 			},
	// 		};
	// 		try {
	// 			const upload = new Promise((res, rej) => {
	// 				try {
	// 					res(post(`/api/file/upload?ref=${Reference}`, formData, config));
	// 				} catch (err) {
	// 					console.log(err);
	// 					res("uploaded");
	// 				}
	// 			});
	// 			upload.then((ga) => {
	// 				// if (ga.status === 200) {
	// 				// }
	// 			});
	// 		} catch (err) {
	// 			if (err.response) {
	// 				console.log(err.response);
	// 			} else if (err.request) {
	// 				console.log(err.request);
	// 			} else {
	// 				console.log(err);
	// 			}
	// 		}
	// 	}
	// }

	// const acceptFileType =
	// 	"image/*, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, .msg, application/pdf";
	// const baseStyle = {
	// 	flex: 1,
	// 	display: "flex",
	// 	flexDirection: "column",
	// 	outline: "none",
	// 	transition: "border .1s ease-in-out",
	// };
	// const onDrop = React.useCallback(async (acceptedFiles) => {
	// 	acceptedFiles.map(async (data) => {
	// 		const formData = new FormData();
	// 		formData.append("userPhoto", data);
	// 		const config = {
	// 			headers: {
	// 				"content-type": "multipart/form-data",
	// 				reference: Reference,
	// 			},
	// 		};
	// 		try {
	// 			const upload = new Promise((res, rej) => {
	// 				try {
	// 					res(post(`/api/dashboard/uploadFile`, formData, config));
	// 				} catch (err) {
	// 					console.log(err);
	// 					res("uploaded");
	// 				}
	// 			});
	// 			upload.then((ga) => {
	// 				if (ga.status === 200) {
	// 					alert(`File Uploaded: ${data.name}`);
	// 					// getFiles();
	// 					// setShow(true);
	// 				}
	// 			});
	// 		} catch (err) {
	// 			if (err.response) {
	// 				console.log(err.response);
	// 			} else if (err.request) {
	// 				console.log(err.request);
	// 			} else {
	// 				console.log(err);
	// 			}
	// 		}
	// 	});
	// });
	// Define the functions from Dropzone package
	// const {
	// 	getRootProps,
	// 	getInputProps,
	// 	fileRejections,
	// 	isDragActive,
	// 	isDragAccept,
	// 	isDragReject,
	// 	acceptedFiles,
	// } = useDropzone({
	// 	accept: acceptFileType,
	// 	minSize: 0,
	// 	maxSize: 10485760,
	// 	onDrop,
	// });

	// const activeStyle = {
	// 	borderColor: "blue",
	// 	borderStyle: "dashed",
	// 	borderWidth: "thick",
	// };

	// const acceptStyle = {
	// 	borderColor: "green",
	// 	borderStyle: "dashed",
	// 	borderWidth: "thick",
	// };

	// const rejectStyle = {
	// 	borderColor: "red",
	// 	borderStyle: "dashed",
	// 	borderWidth: "thick",
	// };

	// Custom styles when the file is changed
	// const style = React.useMemo(
	// 	() => ({
	// 		...baseStyle,
	// 		...(isDragActive ? activeStyle : {}),
	// 		...(isDragAccept ? acceptStyle : {}),
	// 		...(isDragReject ? rejectStyle : {}),
	// 	}),
	// 	[isDragActive, isDragReject, isDragAccept]
	// );

	return (
		<div className="card my-4 shadow">
			<div className="card-body">
				<h5 className="h5 text-dark">Files</h5>
				<div className="row">
					<div className="col-lg-6">
						<div className="card shadow">
							<div className="card-body">
								<h6 className="h6 text-dark">Forms</h6>
								<Row>
									<Col lg="12" sm="12" className="mb-2">
										{isClient && (
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
														<Tag className="bg-primary bg-gray-600 text-white mr-4 px-4 py-2">
															<div className="d-flex justify-content-between font-weight-bold">
																<img
																	src="/image/icons/file-pdf-solid.svg"
																	width="15"
																	height="15"
																	style={{
																		filter:
																			"brightness(0.5) invert(0.7) sepia(0.9)",
																	}}
																></img>
																<span className="ml-2">
																	{loading || error
																		? "LOADING..."
																		: "FOLDER COVER"}
																</span>
															</div>
														</Tag>
													</a>
												)}
											</BlobProvider>
										)}
									</Col>
									<Col lg="12" sm="12" className="mb-2">
										<Tag
											role="button"
											id="pop"
											className="bg-primary bg-gray-500 text-white mr-4 px-4 py-2"
										>
											<i className="fa fa-window-restore mr-2"></i>TYPE:{" "}
											{ApType}
										</Tag>
										<UncontrolledPopover
											placement="right"
											trigger="legacy"
											target="pop"
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
										</UncontrolledPopover>
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
															payto={ga.F_SName}
															address={`${ga.F_Addr} ${ga.F_City} ${ga.F_State} ${ga.F_ZipCode}`}
															irs={`${ga.F_IRSType} ${ga.F_IRSNo}`}
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
															<Tag
																intent="success"
																className="text-truncate mr-4 px-4 py-2 font-weight-bold"
																interactive={true}
																fill={true}
															>
																<img
																	src="/image/icons/file-pdf-solid.svg"
																	width="15"
																	height="15"
																	className="mr-2"
																	style={{
																		filter:
																			"brightness(0.5) invert(0.7) sepia(0.9)",
																	}}
																></img>
																{loading || error
																	? "LOADING..."
																	: `${ga.F_SName} - $${Number.parseFloat(
																			ga.F_InvoiceAmt || 0
																	  ).toFixed(2)}`}
															</Tag>
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
											interactive={true}
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
									))
								) : (
									<Tag className="w-100 bg-gray-400 text-dark px-2 py-2 my-1 text-center">
										NO FILE
									</Tag>
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
