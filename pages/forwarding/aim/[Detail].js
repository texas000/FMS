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
import File from "../../../components/Forwarding/Aim/File";
import Request from "../../../components/Forwarding/All/Request";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import useSWR from "swr";
// import axios, { post } from "axios";

const Detail = ({ Reference, token }) => {
	const { data } = useSWR(`/api/forwarding/aim/detail?ref=${Reference}`);
	const router = useRouter();
	if (typeof window !== "undefined") {
		// Define an empty array
		var arr = [];
		// Initial value is null value but change to empty array string
		var history = localStorage.getItem("pageHistory");
		// If the page history is empty
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
	const [menu, setMenu] = useState(1);

	var mailSubject, mailBody, emailHref;
	if (data && data.M) {
		mailSubject = `[JW] ${data.H.length > 0 && data.H[0].CUSTOMER} `;
		mailSubject += `MBL# ${data.M.F_MawbNo} `;
		mailSubject += `HBL# ${data.H.map((na) => `${na.F_HawbNo}`)} `;
		mailSubject += `ETD ${moment(data.M.F_ETD).utc().format("l")} `;
		mailSubject += `ETA ${moment(data.M.F_ETA).utc().format("l")} // ${
			data.M.F_RefNo
		}`;

		mailBody = `Dear ${data.H.length > 0 && data.H[0].CUSTOMER}
      \nPlease note that there is an OCEAN IMPORT SHIPMENT for ${
				data.H.length > 0 && data.H[0].CUSTOMER
			} scheduled to depart on ${moment(data.M.F_ETA).utc().format("LL")}.
      \n_______________________________________
      ETD:  ${moment(data.M.F_ETD).format("L")}
      POL:  ${data.M.F_LoadingPort}
      ETA:  ${moment(data.M.F_ETA).format("L")}
      POD:  ${data.M.F_DisCharge}
      SHIPPER:  ${data.H.length > 0 && data.H[0].SHIPPER}
      CONSIGNEE:  ${data.H.length > 0 && data.H[0].CONSIGNEE}
      MBL:  ${data.M.F_MawbNo}
      HBL:  ${data.H.map((ga) => `${ga.F_HawbNo} `)}`;

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
							Discharge={data.M.F_Discharge}
							FETA={data.M.F_FETA}
							Destination={data.M.F_FinalDest}
							Express={data.M.F_ExpRLS}
							Empty="0"
							MBL={data.M.F_MawbNo}
							Carrier={data.M.CARRIER}
							Agent={data.M.AGENT}
							Vessel={data.M.F_FLTno}
							Commodity={data.M.F_Description}
							CY={data.M.CYLOC}
							Reference={Reference}
							PPCC={data.M.F_PPCC}
						/>
					)}
					{/* MENU 2 - HOUSE */}
					{menu === 2 && <House house={data.H} />}
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
