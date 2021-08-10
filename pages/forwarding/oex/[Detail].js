import cookie from "cookie";
import Layout from "../../../components/Layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import moment from "moment";
import jwt from "jsonwebtoken";
import Comment from "../../../components/Forwarding/All/Comment";
import { Button } from "@blueprintjs/core";
import Navigation from "../../../components/Forwarding/All/Navigation";
import Master from "../../../components/Forwarding/All/Master";
import House from "../../../components/Forwarding/All/House";
import Profit from "../../../components/Forwarding/All/Profit";
import Request from "../../../components/Forwarding/All/Request";
import File from "../../../components/Forwarding/Oex/File";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import useSWR from "swr";

const Detail = ({ Cookie, Reference, master, token }) => {
	const { data } = useSWR(`/api/forwarding/oex/detail?ref=${Reference}`);

	const router = useRouter();
	// const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const [menu, setMenu] = useState(1);
	const [isReady, setIsReady] = useState(false);

	var mailSubject, mailBody, emailHref;
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

		emailHref = data.M
			? `mailto:?cc=${token && token.email}&subject=${encodeURIComponent(
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

	return (
		<Layout TOKEN={token} TITLE={Reference} LOADING={!data}>
			{data && data.M ? (
				<>
					{/* NAVIGATION BAR - STATE: MENU, SETMENU, REFERENCE */}
					<Navigation menu={menu} setMenu={setMenu} Reference={Reference} />

					{/* MENU 1 - MAIN */}
					{menu === 1 && (
						<Master
							Clipboard={Clipboard}
							Email={emailHref}
							Closed={data.M.F_FileClosed}
							Created={data.M.F_U1Date}
							Updated={data.M.F_U2Date}
							Creator={data.M.F_U1ID}
							Updator={data.M.F_U2ID}
							Post={data.M.F_PostDate}
							ETA={data.M.F_ETA}
							ETD={data.M.F_ETD}
							Loading={data.M.F_LoadingPort}
							Discharge={data.M.F_DisCharge}
							FETA={data.M.F_FETA}
							Destination={data.M.F_FinalDest}
							MoveType={data.M.F_MoveType}
							LCLFCL={data.M.F_LCLFCL}
							IT={data.M.F_ITNo}
							Express={data.M.F_ExpRLS}
							Empty={data.M.F_EmptyRtn}
							MBL={data.M.F_MBLNo}
							Carrier={data.M.CARRIER}
							Agent={data.M.AGENT}
							Vessel={`${data.M.F_Vessel} ${data.M.F_Voyage}`}
							Commodity={data.M.F_Description}
							Reference={Reference}
						/>
					)}
					{/* MENU 2 - HOUSE */}
					{menu === 2 && <House house={data.H} container={data.C} />}
					{/* MENU 3 - PROFIT */}
					{menu === 3 && (
						<Profit
							Reference={Reference}
							TOKEN={token}
							invoice={data.I}
							ap={data.A}
							crdr={data.CR}
							profit={data.P}
							customer={data.H.length ? data.H[0].CUSTOMER : "NO CUSTOMER"}
						/>
					)}
					{/* MENU 4 - FILE */}
					{menu === 4 && (
						<File
							Reference={Reference}
							Master={data.M}
							House={data.H}
							Ap={data.A}
							Container={data.C}
						/>
					)}
					{/* MENU 5 - REQUEST */}
					{menu === 5 && (
						<Request
							Reference={Reference}
							ap={data.A}
							crdr={data.CR}
							profit={data.P}
							TOKEN={token}
						/>
					)}

					<Comment Reference={Reference} Uid={token.uid} />

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
