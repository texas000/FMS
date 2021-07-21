import cookie from "cookie";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import moment from "moment";
import jwt from "jsonwebtoken";
import Comment from "../../../components/Forwarding/All/Comment";
import { Button } from "@blueprintjs/core";
import Navigation from "../../../components/Forwarding/Other/Navigation";
import Master from "../../../components/Forwarding/Other/Master";
import Profit from "../../../components/Forwarding/All/Profit";
import Request from "../../../components/Forwarding/All/Request";
import File from "../../../components/Forwarding/Other/File";
import axios, { post } from "axios";
import useSWR from "swr";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

const Detail = ({ Cookie, Reference, master }) => {
	const { data, mutate } = useSWR("/api/file/list?ref=" + Reference);
	const router = useRouter();
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const [isReady, setIsReady] = useState(false);
	const [menu, setMenu] = useState(1);

	useEffect(() => {
		!TOKEN && router.push("/login");
		setIsReady(true);
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
					if (ga.status === 200) {
						mutate();
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
	// ADD LOG DATA WHEN USER ACCESS THE PAGE
	async function addLogData(Ref) {
		const fetchPostLog = await fetch("/api/forwarding/postFreightExtLog", {
			method: "POST",
			body: JSON.stringify({
				RefNo: Ref.RefNo,
				TBName: Ref.TBName,
				TBID: Ref.TBID,
				Title: `${TOKEN.username} ACCESS GRANTED`,
				Contents: JSON.stringify(TOKEN),
			}),
		});
		if (fetchPostLog.status === 200) {
			console.log("SUCCESS");
		} else {
			console.log(fetchPostLog.status);
		}
	}
	const Clipboard = () => {
		const routes = "jwiusa.com" + router.asPath;
		var tempInput = document.createElement("INPUT");
		document.getElementsByTagName("body")[0].appendChild(tempInput);
		tempInput.setAttribute("value", routes);
		tempInput.select();
		document.execCommand("copy");
		document.getElementsByTagName("body")[0].removeChild(tempInput);
		alert("COPIED");
	};

	if (TOKEN && TOKEN.group) {
		return (
			<Layout TOKEN={TOKEN} TITLE={Reference}>
				{master.M ? (
					<>
						{/* NAVIGATION BAR - STATE: MENU, SETMENU, REFERENCE */}
						<Navigation menu={menu} setMenu={setMenu} Reference={Reference} />

						{/* MENU 1 - MAIN */}
						{menu === 1 && (
							<Master
								Closed={master.M.F_FileClosed}
								Created={master.M.F_U1Date}
								Updated={master.M.F_U2Date}
								Creator={master.M.F_U1ID}
								Updator={master.M.F_U2ID}
								Post={master.M.F_PostDate}
								ETA={master.M.F_ETA}
								ETD={master.M.F_ETD}
								Loading={master.M.F_LoadingPort}
								Discharge={master.M.F_DisCharge}
								FETA={master.M.F_FETA}
								Destination={master.M.F_FinalDest}
								M={master.M}
							/>
						)}

						{/* MENU 3 - PROFIT */}
						{menu === 3 && (
							<Profit
								Reference={Reference}
								TOKEN={TOKEN}
								invoice={master.I}
								ap={master.A}
								crdr={master.CR}
								profit={master.P}
							/>
						)}
						{/* MENU 4 - FILE */}
						{menu === 4 && isReady && (
							<File Reference={Reference} Master={master.M} Ap={master.A} />
						)}

						{menu === 5 && (
							<Request
								Reference={Reference}
								ap={master.A}
								crdr={master.CR}
								profit={master.P}
								TOKEN={TOKEN}
							/>
						)}
						<div className="card shadow">
							<div className="card-body">
								<h5 className="h5 text-dark">Files</h5>

								<div className="row">
									<div className="col-lg-6 my-1">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text text-xs">DO/POD</span>
											</div>
											<div className="custom-file">
												<input
													type="file"
													id="do"
													className="custom-file-input"
													onChange={uploadFile}
												/>
												<label className="custom-file-label">Choose file</label>
											</div>
										</div>
									</div>
									<div className="col-lg-6 my-1">
										<div className="input-group">
											<div className="input-group-prepend">
												<span className="input-group-text text-xs">
													PACKING LIST
												</span>
											</div>
											<div className="custom-file">
												<input
													type="file"
													className="custom-file-input"
													id="packing"
													onChange={uploadFile}
												/>
												<label className="custom-file-label">Choose file</label>
											</div>
										</div>
									</div>
								</div>

								{!data || !data.length ? (
									<React.Fragment />
								) : (
									<ul
										className="list-group list-group-horizontal mt-4"
										style={{ overflowX: "scroll" }}
									>
										{data.map((ga) => (
											<li className="list-group-item py-1 mb-1" key={ga.F_ID}>
												<button
													type="button"
													className="btn btn-primary btn-sm text-white text-truncate"
													style={{ maxWidth: "180px" }}
													onClick={async () => {
														window.location.assign(
															`/api/file/get?ref=${Reference}&file=${ga.F_FILENAME}`
														);
													}}
												>
													<span className="text-uppercase mr-1">
														[{ga.F_LABEL}]
													</span>
													{ga.F_FILENAME}
												</button>
											</li>
										))}
									</ul>
								)}
							</div>
						</div>
						<Comment Reference={Reference} Uid={TOKEN.uid} />

						<p className="d-none d-print-block text-center">
							Printed at {moment().format("lll")}
						</p>
					</>
				) : (
					<div className="jumbotron jumbotron-fluid">
						<div className="container">
							<h1 className="display-4">{router.query.Detail} NOT FOUND!</h1>
							<p className="lead">
								Please make sure you have correct reference number
							</p>
							<div className="d-flex justify-content-center mt-4">
								<Button
									color="secondary"
									onClick={() => router.back()}
									icon="key-backspace"
								>
									Return To Previous Page
								</Button>
							</div>
						</div>
					</div>
				)}
			</Layout>
		);
	} else {
		return <p>Redirecting...</p>;
	}
};

export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	var info = false;
	if (cookies.jamesworldwidetoken) {
		info = await fetch(
			`${process.env.BASE_URL}api/forwarding/other/getDetail`,
			{
				method: "GET",
				headers: {
					key: cookies.jamesworldwidetoken,
					reference: query.Detail,
				},
			}
		).then((j) => j.json());
	}

	return { props: { Cookie: cookies, Reference: query.Detail, master: info } };
}

export default Detail;

// import cookie from "cookie";
// import Layout from "../../../components/Layout";
// import { Row, Col, Button, Alert } from "reactstrap";
// import { useRouter } from "next/router";
// import fetch from "node-fetch";
// import { useEffect } from "react";
// import Head from "../../../components/Forwarding/Head";
// import Route from "../../../components/Forwarding/Route";

// import jwt from "jsonwebtoken";
// import { Comment } from "../../../components/Forwarding/Comment";
// import Info from "../../../components/Forwarding/OtherInfo";
// import Forms from "../../../components/Forwarding/Forms";
// import Status from "../../../components/Forwarding/Status";
// import moment from "moment";

// const Detail = ({ Cookie, OTHER, GENMAIN, GENHOUSE, Firebase }) => {
//   const router = useRouter();
//   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

//   useEffect(() => {
//     !TOKEN && router.push("/login");
//     console.log(GENMAIN);
//     // addLogData(GENMAIN[0]);
//   });

//   async function addLogData(Ref) {
//     const fetchPostLog = await fetch("/api/forwarding/postFreightExtLog", {
//       method: "POST",
//       body: JSON.stringify({
//         RefNo: Ref.RefNo,
//         TBName: Ref.TBName,
//         TBID: Ref.TBID,
//         Title: `${TOKEN.username} ACCESS GRANTED`,
//         Contents: JSON.stringify(TOKEN),
//       }),
//     });
//     if (fetchPostLog.status === 200) {
//       console.log("log uploaded");
//     } else {
//       console.log(fetchPostLog.status);
//     }
//   }

//   if (TOKEN && TOKEN.group) {
//     return (
//       <>
//         {GENMAIN ? (
//           <Layout TOKEN={TOKEN} TITLE={GENMAIN[0].RefNo}>
//             <Head
//               REF={GENMAIN[0].RefNo}
//               POST={GENMAIN[0].PostDate}
//               CUSTOMER={GENMAIN[0].Customer_SName}
//             />
//             {/* Display only at print screen */}
//             <p className="d-none d-print-block">
//               Printed at {moment().format("lll")}
//             </p>
//             <Row>
//               <Col lg={10}>
//                 <Row>
//                   <Info Master={GENMAIN[0]} />
//                   <Col lg="6" className="mb-4">
//                     <Forms
//                       Master={GENMAIN[0]}
//                       House={GENHOUSE}
//                       User={TOKEN}
//                       Type="other"
//                     />
//                   </Col>
//                 </Row>
//               </Col>
//               <Col lg={2} className="mb-4">
//                 <Route
//                   ETA={GENMAIN[0].ETA}
//                   ETD={GENMAIN[0].ETD}
//                   FETA={GENMAIN[0].FETA}
//                   DISCHARGE={GENMAIN[0].DisCharge}
//                   LOADING={GENMAIN[0].LoadingPort}
//                   DEST={GENMAIN[0].FinalDest}
//                 />
//               </Col>
//             </Row>

//             <Comment
//               reference={GENMAIN[0].RefNo}
//               uid={TOKEN.uid}
//               main={GENMAIN[0]}
//               Firebase={Firebase}
//             />
//           </Layout>
//         ) : (
//           <Layout TOKEN={TOKEN} TITLE="Not Found">
//             <Row>
//               <Col className="text-center">
//                 <Alert color="danger">
//                   ERROR: {router.query.Detail} NOT FOUND!
//                 </Alert>
//                 <Button color="secondary" onClick={() => router.back()}>
//                   Return To Previous Page
//                 </Button>
//               </Col>
//             </Row>
//           </Layout>
//         )}
//         {/* IF THE REFERENCE NUMBER IS NOT FOUND, DISPLAY ERROR PAGE */}
//       </>
//     );
//   } else {
//     return <p>Redirecting...</p>;
//   }
// };

// export async function getServerSideProps({ req, query }) {
//   const cookies = cookie.parse(
//     req ? req.headers.cookie || "" : window.document.cookie
//   );

//   // FETCH OIM EXT (OIMMAIN DATA + STATUS DATA)
//   const fetchGenmainExt = await fetch(
//     `${process.env.FS_BASEPATH}genmain_ext?RefNo=${query.Detail}`,
//     {
//       headers: { "x-api-key": process.env.JWT_KEY },
//     }
//   );

//   // DEFINE FLASE VARIABLE
//   var MAIN = false;
//   var HOUSE = false;

//   if (fetchGenmainExt.status === 200) {
//     MAIN = await fetchGenmainExt.json();
//   }

//   // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
//   if (MAIN) {
//     // FETCH OIM DATA FROM FREIGHT STREAM;
//     const fetchAP = await fetch(
//       `${process.env.FS_BASEPATH}aphd?table=T_GENMAIN&tbid=${MAIN[0].ID}`,
//       {
//         headers: { "x-api-key": process.env.JWT_KEY },
//       }
//     );

//     if (fetchAP.status === 200) {
//       const Ap = await fetchAP.json();
//       HOUSE = [{ Customer_SName: MAIN[0].Customer_SName, AP: Ap }];
//       var ApInfo = Ap;
//       for (var j = 0; j < Ap.length; j++) {
//         const CompanyContactFetch = await fetch(
//           `${process.env.FS_BASEPATH}Company_CompanyContact/${Ap[j].PayTo}`,
//           {
//             headers: { "x-api-key": process.env.JWT_KEY },
//           }
//         );
//         if (CompanyContactFetch.status === 200) {
//           const Contact = await CompanyContactFetch.json();
//           ApInfo[j] = { ...Ap[j], PayToCustomer: Contact };
//         }
//       }
//       HOUSE = [{ Customer_SName: MAIN[0].Customer_SName, AP: ApInfo }];
//     }
//     return {
//       props: {
//         Cookie: cookies,
//         GENMAIN: MAIN,
//         GENHOUSE: HOUSE,
//         Firebase: process.env.FIREBASE_API_KEY,
//       },
//     };
//   }
//   return { props: { Cookie: cookies } };
// }

// export default Detail;
