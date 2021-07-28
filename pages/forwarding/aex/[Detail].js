import cookie from "cookie";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import moment from "moment";
import jwt from "jsonwebtoken";
import Comment from "../../../components/Forwarding/All/Comment";
import { Button } from "@blueprintjs/core";
import Navigation from "../../../components/Forwarding/All/Navigation";
import Master from "../../../components/Forwarding/All/Master";
import House from "../../../components/Forwarding/All/House";
import Profit from "../../../components/Forwarding/All/Profit";
import File from "../../../components/Forwarding/Aex/File";
import Request from "../../../components/Forwarding/All/Request";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

const Detail = ({ Cookie, Reference, master }) => {
	// const { data, mutate } = useSWR("/api/file/list?ref=" + Reference);
	const router = useRouter();
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const [menu, setMenu] = useState(1);
	const [isReady, setIsReady] = useState(false);
	useEffect(() => {
		!TOKEN && router.push("/login");
		setIsReady(true);
	}, [Reference]);

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

	var mailSubject, mailBody, emailHref;
	if (master.M) {
		mailSubject = `[JW] ${master.H.length > 0 && master.H[0].CUSTOMER} `;
		mailSubject += `MBL# ${master.M.F_MawbNo} `;
		mailSubject += `HBL# ${master.H.map((na) => `${na.F_HAWBNo}`)} `;
		mailSubject += `ETD ${moment(master.M.F_ETD).utc().format("l")} `;
		mailSubject += `ETA ${moment(master.M.F_ETA).utc().format("l")} // ${
			master.M.F_RefNo
		}`;

		mailBody = `Dear ${master.H.length > 0 && master.H[0].CUSTOMER}
      \nPlease note that there is an OCEAN IMPORT SHIPMENT for ${
				master.H.length > 0 && master.H[0].CUSTOMER
			} scheduled to depart on ${moment(master.M.F_ETA).utc().format("LL")}.
      \n_______________________________________
      ETD:  ${moment(master.M.F_ETD).format("L")}
      POL:  ${master.M.F_LoadingPort}
      ETA:  ${moment(master.M.F_ETA).format("L")}
      POD:  ${master.M.F_Discharge}
      SHIPPER:  ${master.H.length > 0 && master.H[0].SHIPPER}
      CONSIGNEE:  ${master.H.length > 0 && master.H[0].CONSIGNEE}
      MBL:  ${master.M.F_MawbNo}
      HBL:  ${master.H.map((ga) => `${ga.F_HAWBNo} `)}`;

		emailHref = master.M
			? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
					mailSubject
			  )}&body=${encodeURIComponent(mailBody)}`
			: "";
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
								Clipboard={Clipboard}
								Email={emailHref}
								Closed={master.M.F_FileClosed}
								Created={master.M.F_U1Date}
								Updated={master.M.F_U2Date}
								Creator={master.M.F_U1ID}
								Updator={master.M.F_U2ID}
								Post={master.M.F_PostDate}
								ETA={master.M.F_ETA}
								ETD={master.M.F_ETD}
								Loading={master.M.F_LoadingPort}
								Discharge={master.M.F_Discharge}
								FETA={master.M.F_FETA}
								Destination={master.M.F_FinalDest}
								Express={master.M.F_ExpRLS}
								Empty="0"
								MBL={master.M.F_MawbNo}
								Carrier={master.M.CARRIER}
								Agent={master.M.AGENT}
								Vessel={master.M.F_FLTNo}
								Commodity={master.M.F_Description}
								CY={master.M.CYLOC}
								Reference={Reference}
							/>
						)}
						{/* MENU 2 - HOUSE */}
						{menu === 2 && <House house={master.H} />}
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
							<File
								Reference={Reference}
								Master={master.M}
								House={master.H}
								Ap={master.A}
							/>
						)}
						{/* MENU 5 - REQUEST */}
						{menu === 5 && (
							<Request
								Reference={Reference}
								ap={master.A}
								crdr={master.CR}
								profit={master.P}
								TOKEN={TOKEN}
							/>
						)}

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
		info = await fetch(`${process.env.BASE_URL}api/forwarding/aex/getDetail`, {
			method: "GET",
			headers: {
				key: cookies.jamesworldwidetoken,
				reference: query.Detail,
			},
		}).then((j) => j.json());
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
// import moment from "moment";

// import jwt from "jsonwebtoken";
// import { Comment } from "../../../components/Forwarding/Comment";
// import Info from "../../../components/Forwarding/AirInfo";
// import Forms from "../../../components/Forwarding/Forms";
// import Status from "../../../components/Forwarding/Status";

// const Detail = ({ Cookie, AOMMAIN, AOHMAIN, Firebase }) => {
//   const router = useRouter();
//   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

//   useEffect(() => {
//     !TOKEN && router.push("/login");
//     if (AOMMAIN) {
//       addLogData(AOMMAIN[0]);
//     }
//   }, []);

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
//       console.log("SUCCESS");
//     } else {
//       console.log(fetchPostLog.status);
//     }
//   }

//   var mailSubject, mailBody, emailHref;
//   if (AOMMAIN) {
//     mailSubject =
//       AOMMAIN.length > 0
//         ? `[JW] ${AOHMAIN[0].Customer_SName} MAWBNO# ${
//             AOMMAIN[0].MawbNo
//           } HAWBNO# ${AOHMAIN.map((na) => `${na.HAWBNo}`)} ETD ${moment(
//             AOMMAIN[0].ETD
//           )
//             .utc()
//             .format("l")} ETA ${moment(AOMMAIN[0].ETA).utc().format("l")} // ${
//             AOMMAIN[0].RefNo
//           }`
//         : "";

//     mailBody =
//       AOMMAIN.length === 1
//         ? `Dear ${AOHMAIN[0].Customer_SName}
//       \nPlease note that there is an AIR EXPORT SHIPMENT for ${
//         AOHMAIN[0].Customer_SName
//       } scheduled to depart on ${moment(AOMMAIN[0].ETA).utc().format("LL")}.`
//         : "";

//     emailHref =
//       AOHMAIN.length > 0
//         ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
//             mailSubject
//           )}&body=${encodeURIComponent(mailBody)}`
//         : "";
//   }

//   if (TOKEN && TOKEN.group) {
//     return (
//       <>
//         {AOMMAIN ? (
//           <Layout TOKEN={TOKEN} TITLE={AOMMAIN[0].RefNo}>
//             <Head
//               REF={AOMMAIN[0].RefNo}
//               POST={AOMMAIN[0].PostDate}
//               EMAIL={emailHref}
//               CUSTOMER={AOHMAIN && AOHMAIN[0].Customer_SName}
//             />
//             {/* Display only at print screen */}
//             <p className="d-none d-print-block">
//               Printed at {moment().format("lll")}
//             </p>
//             <Row>
//               <Col lg={10}>
//                 <Row>
//                   <Info Master={AOMMAIN[0]} House={AOHMAIN} Containers={[]} />
//                   <Col lg="6">
//                     <Forms
//                       Master={AOMMAIN[0]}
//                       House={AOHMAIN}
//                       User={TOKEN}
//                       Type="air"
//                     />
//                     <Status
//                       Ref={AOMMAIN[0].RefNo}
//                       Uid={TOKEN.uid}
//                       Main="aommain"
//                     />
//                   </Col>
//                 </Row>
//               </Col>
//               <Col lg={2} className="mb-4">
//                 <Route
//                   ETA={AOMMAIN[0].ETA}
//                   ETD={AOMMAIN[0].ETD}
//                   FETA={AOMMAIN[0].FETA}
//                   DISCHARGE={AOMMAIN[0].DisCharge}
//                   LOADING={AOMMAIN[0].LoadingPort}
//                   DEST={AOMMAIN[0].FinalDest}
//                 />
//               </Col>
//             </Row>

//             <Comment
//               reference={AOMMAIN[0].RefNo}
//               uid={TOKEN.uid}
//               main={AOMMAIN[0]}
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
//   const fetchAommainExt = await fetch(
//     `${process.env.FS_BASEPATH}aommain_ext?RefNo=${query.Detail}`,
//     {
//       headers: { "x-api-key": process.env.JWT_KEY },
//     }
//   );

//   // DEFINE FLASE VARIABLE
//   var MAIN = false;
//   var HOUSE = false;

//   if (fetchAommainExt.status === 200) {
//     MAIN = await fetchAommainExt.json();
//   }

//   // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
//   if (MAIN) {
//     // GET OIHMAIN FROM BLID
//     const fecthAohmain = await fetch(
//       `${process.env.FS_BASEPATH}aohmain?aomblid=${MAIN[0].ID}`,
//       {
//         headers: { "x-api-key": process.env.JWT_KEY },
//       }
//     );
//     if (fecthAohmain.status === 200) {
//       HOUSE = await fecthAohmain.json();

//       if (HOUSE.length > 0) {
//         for (var i = 0; i < HOUSE.length; i++) {
//           var APLIST = false;
//           const fetchAP = await fetch(
//             `${process.env.FS_BASEPATH}aphd?table=T_AOHMAIN&tbid=${HOUSE[i].ID}`,
//             {
//               headers: { "x-api-key": process.env.JWT_KEY },
//             }
//           );
//           // IF AP EXISTS
//           if (fetchAP.status === 200) {
//             const Ap = await fetchAP.json();
//             APLIST = Ap;
//             for (var j = 0; j < Ap.length; j++) {
//               const CompanyContactFetch = await fetch(
//                 `${process.env.FS_BASEPATH}Company_CompanyContact/${Ap[j].PayTo}`,
//                 {
//                   headers: { "x-api-key": process.env.JWT_KEY },
//                 }
//               );
//               if (CompanyContactFetch.status === 200) {
//                 const Contact = await CompanyContactFetch.json();
//                 //EACH HOUSE HAS AP MULTIPLE AP LIST
//                 APLIST[j] = { ...APLIST[j], PayToCustomer: Contact };
//               } else {
//                 APLIST[j] = { ...APLIST[j] };
//               }
//             }
//           }
//           HOUSE[i] = { ...HOUSE[i], AP: APLIST };
//         }
//       }
//     }

//     return {
//       props: {
//         Cookie: cookies,
//         AOMMAIN: MAIN,
//         AOHMAIN: HOUSE,
//         Firebase: process.env.FIREBASE_API_KEY,
//       },
//     };
//   }
//   return { props: { Cookie: cookies } };
// }

// export default Detail;
