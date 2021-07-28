import { useDropzone } from "react-dropzone";
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

export const File = ({ Reference, House, Master, Container, Ap }) => {
	const [isClient, setIsClient] = useState(false);
	const [ApType, setApType] = useState("CHECK");
	// const ApMenu = (
	// 	<Menu>
	// 		<MenuItem
	// 			icon="book"
	// 			text="CHECK"
	// 			onClick={() => {
	// 				setApType("CHECK");
	// 			}}
	// 		/>
	// 		<MenuItem
	// 			icon="credit-card"
	// 			text="CARD"
	// 			onClick={() => {
	// 				setApType("CARD");
	// 			}}
	// 		/>
	// 		<MenuItem
	// 			icon="send-to"
	// 			text="ACH"
	// 			onClick={() => {
	// 				setApType("ACH");
	// 			}}
	// 		/>
	// 		<MenuItem
	// 			icon="bank-account"
	// 			text="WIRE"
	// 			onClick={() => {
	// 				setApType("WIRE");
	// 			}}
	// 		/>
	// 	</Menu>
	// );

	useEffect(() => {
		setIsClient(true);
	}, [Reference]);

	function uploadFile(e) {
		var uploadedFile = e.target.files[0];
		if (uploadedFile) {
			const formData = new FormData();
			formData.append("userPhoto", uploadedFile);
			const config = {
				headers: {
					"content-type": "multipart/form-data",
					label: e.target.id,
					level: "99",
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
					// if (ga.status === 200) {
					// }
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
													<a href={url} target="__blank">
														<Button
															outline
															color="primary"
															disabled={!isClient}
															size="sm"
														>
															<img
																src="/image/icons/file-pdf-solid.svg"
																width="15"
																height="15"
																style={{
																	filter:
																		"brightness(0.5) invert(0.7) sepia(0.9)",
																	marginBottom: "5px",
																	marginRight: "3px",
																}}
															></img>
															FOLDER COVER
														</Button>
													</a>
												)}
											</BlobProvider>
										)}

										<Button
											color="primary"
											size="sm"
											id="pop"
											className="float-right"
										>
											<i className="fa fa-window-restore mr-2"></i>TYPE:{" "}
											{ApType}
										</Button>
										<UncontrolledPopover
											placement="right"
											trigger="legacy"
											target="pop"
										>
											<PopoverBody>
												<ButtonGroup>
													<button
														className="btn btn-primary"
														onClick={() => setApType("CHECK")}
													>
														Check
													</button>
													<button
														className="btn btn-primary"
														onClick={() => setApType("CARD")}
													>
														Card
													</button>
													<button
														className="btn btn-primary"
														onClick={() => setApType("ACH")}
													>
														ACH
													</button>
													<button
														className="btn btn-primary"
														onClick={() => setApType("WIRE")}
													>
														Wire
													</button>
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
															amt={Number.parseFloat(
																ga.F_InvoiceAmt || 0
															).toFixed(2)}
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
														<a href={url} target="__blank">
															<Button
																outline
																color="success"
																className="text-truncate"
																size="sm"
																disable={loading}
															>
																<img
																	src="/image/icons/file-pdf-solid.svg"
																	width="15"
																	height="15"
																	style={{
																		filter:
																			"brightness(0.5) invert(0.7) sepia(0.9)",
																		marginBottom: "5px",
																		marginRight: "3px",
																	}}
																></img>
																{`${ga.F_SName} - $${Number.parseFloat(
																	ga.F_InvoiceAmt || 0
																).toFixed(2)}`}
															</Button>
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
								<h6 className="h6 text-dark">Public</h6>
								<Row>
									{[
										"isf",
										"invoice",
										"packing",
										"hbl",
										"an",
										"pod",
										"7501",
										"other",
									].map((ga) => (
										<Col key={ga} className="my-1" lg="6">
											<div className="input-group">
												<div className="input-group-prepend">
													<span className="input-group-text text-xs text-uppercase">
														{ga}
													</span>
												</div>
												<div className="custom-file">
													<input
														type="file"
														id={ga}
														className="custom-file-input"
														onChange={uploadFile}
													/>
													<label className="custom-file-label">
														Choose file
													</label>
												</div>
											</div>
										</Col>
									))}
								</Row>
								<h6 className="h6 text-dark mt-3">Internal</h6>
								<Row>
									{["mbl", "invo-vendor", "crdr", "do"].map((ga) => (
										<Col key={ga} className="my-1" lg="6">
											<div className="input-group">
												<div className="input-group-prepend">
													<span className="input-group-text text-xs text-uppercase">
														{ga}
													</span>
												</div>
												<div className="custom-file">
													<input
														type="file"
														id={ga}
														className="custom-file-input"
														onChange={uploadFile}
													/>
													<label className="custom-file-label">
														Choose file
													</label>
												</div>
											</div>
										</Col>
									))}
								</Row>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default File;
