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
// import axios, { post } from "axios";
import useSWR from "swr";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

const Detail = ({ Reference, token }) => {
	const { data } = useSWR(`/api/forwarding/other/detail?ref=${Reference}`);

	const router = useRouter();
	const [menu, setMenu] = useState(1);

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
							M={data.M}
						/>
					)}

					{/* MENU 3 - PROFIT */}
					{menu === 3 && (
						<Profit
							Reference={Reference}
							TOKEN={token}
							invoice={data.I}
							ap={data.A}
							crdr={data.CR}
							profit={data.P}
							customer={data.M.CUSTOMER}
						/>
					)}
					{/* MENU 4 - FILE */}
					{menu === 4 && (
						<File Reference={Reference} Master={data.M} Ap={data.A} />
					)}

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
