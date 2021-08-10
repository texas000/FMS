import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import {
	Button,
	Breadcrumbs,
	InputGroup,
	Callout,
	FileInput,
} from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import readXlsxFile from "read-excel-file";
import moment from "moment";
import fetch from "node-fetch";
import Link from "next/link";
import React from "react";

export default function blank({ Cookie }) {
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const BREADCRUMBS = [{ href: "/dev", icon: "folder-close", text: "Dev" }];
	const [message, setMessage] = React.useState("");

	async function hello() {
		const fetchSlack = await fetch(`/api/slack/sendMessage`, {
			method: "POST",
			headers: {
				"Content-type": "application/json",
			},
			body: JSON.stringify({
				text: message,
			}),
		});
		if (fetchSlack.status === 200) {
			alert("SUCCESS");
			setMessage("");
		} else {
			alert("FAILED");
			console.log(fetchSlack.status);
		}
	}

	async function getFiles() {
		const fetchSlack = await fetch(`/api/sample`, {
			headers: {
				"Content-type": "application/json",
			},
		});
		console.log(fetchSlack);
	}

	const [xlsx, setXlsx] = React.useState([]);

	function handleUpload(e) {
		e.preventDefault();
		var f = e.target.files[0];

		if (
			f.type ==
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		) {
			readXlsxFile(f).then(async (row, i) => {
				setXlsx(row);
				const postExcel = await fetch(`/api/file/amazonExcel`, {
					method: "POST",
					body: JSON.stringify(row),
				});
				if (postExcel.status === 200) {
					const result = await postExcel.json();
					setXlsx(result);
				} else {
					alert("UPLOAD FAILED");
				}
			});
		} else {
			alert(`${f.type} is not supported`);
		}
	}

	return (
		<Layout TOKEN={TOKEN} TITLE="Dev">
			<Breadcrumbs items={BREADCRUMBS} />
			<div className="container-fluid mt-4">
				<div className="row">
					<div className="col">
						<div className="card">
							<div className="card-header">
								DEV PROJECTS{" "}
								<a href="https://jwiusa.com/api/sample" download>
									DOWNLOAD
								</a>
							</div>
							<div className="card-body">
								<div className="row">
									<Callout title={"Chat System"} icon="chat" intent="success">
										Real time chat is available by using firebase firestore
										database. User must be logged in with google account in
										order to read and write data.
									</Callout>
								</div>
								<div className="row my-2">
									<Callout
										title={"Purchase Order Management"}
										icon="dollar"
										intent="success"
									>
										Purchase Order Management page is available for tracking
										purhcase order.
										<br />
										<Link href="/dev/po">
											<Button intent="success" icon="document">
												Purchase Order
											</Button>
										</Link>
									</Callout>
								</div>
								<div className="row my-2">
									<Callout
										title={"Payment for Customer Portal"}
										icon="data-lineage"
										intent="success"
									>
										Credit Card payment system has been integrated with the
										system. User may pay the pending invoice at the company
										page. Payment is integrated with Stripe.
										<br />
										<Link href="/dev/payment">
											<Button intent="success" icon="dollar">
												Manual Payment
											</Button>
										</Link>
									</Callout>
								</div>
							</div>
						</div>
					</div>
					<div className="col">
						<div className="card">
							<div className="card-header">SEND MESSAGE TO SLACK</div>
							<div className="card-body row">
								<div className="col-md-8">
									<InputGroup
										disabled={false}
										leftIcon="emoji"
										placeholder="Please enter your message..."
										onChange={(e) => setMessage(e.target.value)}
										value={message}
										small={true}
									/>
								</div>
								<div className="col-md-4">
									<Button
										icon="send-message"
										intent="success"
										text="Send"
										onClick={hello}
										small={true}
									/>
								</div>
							</div>
						</div>
						<div className="card">
							<div className="card-header">IMPORT AMAZON FILE</div>
							<div className="card-body">
								<FileInput
									text="Choose Excel File..."
									onInputChange={handleUpload}
								/>
								{xlsx && xlsx.length > 0 && (
									<h2 className="text-success">{xlsx.length} ROWS UPLOADED</h2>
								)}
								{xlsx.map((ga, i) => {
									return <p key={i}>{`Settlement ID: ${ga.SettlementID}`}</p>;
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);

	// Pass data to the page via props
	return { props: { Cookie: cookies } };
}
