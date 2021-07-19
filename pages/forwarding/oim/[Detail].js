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
import File from "../../../components/Forwarding/All/File";
import Request from "../../../components/Forwarding/All/Request";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

const Detail = ({ Cookie, Reference, master }) => {
	const router = useRouter();
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const [isReady, setIsReady] = useState(false);
	const [menu, setMenu] = useState(1);

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
		mailSubject += `MBL# ${master.M.F_MBLNo} `;
		mailSubject += `HBL# ${master.H.map((na) => `${na.F_HBLNo}`)} `;
		mailSubject += `CNTR# ${
			master.C && master.C.map((ga) => `${ga.F_ContainerNo} `)
		}`;
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
      POD:  ${master.M.F_DisCharge}
      SHIPPER:  ${master.H.length > 0 && master.H[0].SHIPPER}
      CONSIGNEE:  ${master.H.length > 0 && master.H[0].CONSIGNEE}
      MBL:  ${master.M.F_MBLNo}
      HBL:  ${master.H.map((ga) => `${ga.F_HBLNo} `)}
      CONTAINER:  ${master.C.map(
				(ga) => `${ga.F_ContainerNo}${ga.F_SealNo && `(${ga.F_SealNo})`} `
			)}`;

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
								Discharge={master.M.F_DisCharge}
								FETA={master.M.F_FETA}
								Destination={master.M.F_FinalDest}
								MoveType={master.M.F_MoveType}
								LCLFCL={master.M.F_LCLFCL}
								IT={master.M.F_ITNo}
								Express={master.M.F_ExpRLS}
								Empty={master.M.F_EmptyRtn}
								MBL={master.M.F_MBLNo}
								Carrier={master.M.CARRIER}
								Agent={master.M.AGENT}
								Vessel={`${master.M.F_Vessel} ${master.M.F_Voyage}`}
								CY={master.M.CYLOC}
								Commodity={master.M.F_mCommodity}
								Reference={Reference}
							/>
						)}
						{/* MENU 2 - HOUSE */}
						{menu === 2 && <House house={master.H} container={master.C} />}
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
								Container={master.C}
							/>
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
		info = await fetch(`${process.env.BASE_URL}api/forwarding/oim/getDetail`, {
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

// // DEFINE FLASE VARIABLE, WHEN THE DATA IS NOT FETCHED, RETURN FALSE
// var MAIN = false;
// var HOUSE = false;
// var CONTAINER = false;

// // ----- FETCH OIM EXT (OIMMAIN DATA + STATUS DATA)
// const fetchOimmainExt = await fetch(
//   `${process.env.FS_BASEPATH}oimmain_ext?RefNo=${query.Detail}`,
//   {
//     headers: { "x-api-key": process.env.JWT_KEY },
//   }
// );
// // ASSIGN MAIN
// if (fetchOimmainExt.status === 200) {
//   MAIN = await fetchOimmainExt.json();
//   // ----- GET OIHMAIN FROM BLID
//   const fecthOihmain = await fetch(
//     `${process.env.FS_BASEPATH}oihmain?oimblid=${MAIN[0].ID}`,
//     {
//       headers: { "x-api-key": process.env.JWT_KEY },
//     }
//   );
//   if (fecthOihmain.status === 200) {
//     HOUSE = await fecthOihmain.json();

//     if (HOUSE.length > 0) {
//       for (var i = 0; i < HOUSE.length; i++) {
//         var APLIST = false;
//         const fetchAP = await fetch(
//           `${process.env.FS_BASEPATH}aphd?table=T_OIHMAIN&tbid=${HOUSE[i].ID}`,
//           {
//             headers: { "x-api-key": process.env.JWT_KEY },
//           }
//         );
//         // IF AP EXISTS
//         if (fetchAP.status === 200) {
//           const Ap = await fetchAP.json();
//           APLIST = Ap;
//           for (var j = 0; j < Ap.length; j++) {
//             const CompanyContactFetch = await fetch(
//               `${process.env.FS_BASEPATH}Company_CompanyContact/${Ap[j].PayTo}`,
//               {
//                 headers: { "x-api-key": process.env.JWT_KEY },
//               }
//             );
//             if (CompanyContactFetch.status === 200) {
//               const Contact = await CompanyContactFetch.json();
//               //EACH HOUSE HAS AP MULTIPLE AP LIST
//               APLIST[j] = { ...APLIST[j], PayToCustomer: Contact };
//             } else {
//               APLIST[j] = { ...APLIST[j] };
//             }
//           }
//         }
//         HOUSE[i] = { ...HOUSE[i], AP: APLIST };
//       }
//     }
//   }
//   // ----- FETCH CONTAINER FROM BLID
//   const fecthOimContainer = await fetch(
//     `${process.env.FS_BASEPATH}oimcontainer_leftjoin_oihcontainer?oimblid=${MAIN[0].ID}`,
//     {
//       headers: { "x-api-key": process.env.JWT_KEY },
//     }
//   );
//   // ASSIGN CONTAINER
//   if (fecthOimContainer.status === 200) {
//     CONTAINER = await fecthOimContainer.json();
//   }
//   return {
//     props: {
//       Cookie: cookies,
//       Reference: query.Detail,
//       OIMMAIN: MAIN,
//       OIHMAIN: HOUSE,
//       Firebase: process.env.FIREBASE_API_KEY,
//       CONTAINER,
//     },
//   };
