import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../components/Layout";
import BootstrapTable from "react-bootstrap-table-next";
import cellEditFactory from "react-bootstrap-table2-editor";
import { Row, Col, Table, Input, Alert, Card } from "reactstrap";
import { useRouter } from "next/router";
import {
	InputGroup,
	Menu,
	MenuItem,
	Button,
	Divider,
	Dialog,
	Classes,
	Toaster,
	Toast,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

const Index = ({ Cookie }) => {
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	useEffect(() => {
		!TOKEN && router.push("/login");
	}, []);

	const [Search, setSearch] = useState(false);
	const [Result, setResult] = useState(false);
	const [Warning, setWarning] = useState(false);
	const [Select, setSelect] = useState([]);
	const [open, setOpen] = useState(0);
	const [show, setShow] = useState(false);
	const [msg, setMsg] = useState("");
	const [company, setCompany] = useState({});

	const router = useRouter();
	const columns = [
		{
			dataField: "F_PORT",
			text: "PORT",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "10%" },
			align: "center",
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_COMPANY",
			text: "COMPANY",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "15%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_EMAIL",
			text: "EMAIL",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "15%" },
			headerAlign: "center",
			sort: true,
			hidden: TOKEN && TOKEN.group > 212 ? true : false,
		},
		{
			dataField: "F_TYPE",
			text: "TYPE",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "5%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_PIC",
			text: "PIC",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "7%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_DG",
			text: "DG",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "5%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_OVERWEIGHT",
			text: "OW",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "5%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_RF",
			text: "RF",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "5%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_20MAX",
			text: "20M",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "5%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_20TRI_AXLE",
			text: "20TR",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "5%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_40MAX",
			text: "40M",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "5%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_40OW",
			text: "40OW",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "5%" },
			headerAlign: "center",
			sort: true,
		},
		{
			dataField: "F_REMARK",
			text: "NOTE",
			headerClasses: "text-white bg-primary font-weight-light",
			headerAlign: "center",
			sort: true,
		},
	];

	const handleOnSelectAll = (isSelect) => {
		if (isSelect) {
			setSelect(Result);
		} else {
			setSelect([]);
		}
	};

	const handleOnSelect = (row, isSelect) => {
		if (isSelect) {
			setSelect((prev) => [...prev, row]);
		} else {
			setSelect(Select.filter((x) => x !== row));
		}
	};

	const selectRow = {
		mode: "checkbox",
		onSelect: handleOnSelect,
		onSelectAll: handleOnSelectAll,
		clickToSelect: false,
		headerColumnStyle: {
			width: "39px",
			textAlign: "center",
			backgroundColor: "#4e73df",
		},
		bgColor: "#ced7f5",
	};

	const FormsToaster = () => {
		if (show) {
			return (
				<Toaster position="top">
					<Toast
						message={msg}
						intent="success"
						onDismiss={() => setShow(false)}
					></Toast>
				</Toaster>
			);
		} else {
			return <React.Fragment></React.Fragment>;
		}
	};

	async function postCompany() {
		const fetchs = await fetch("/api/trucking/postCompany", {
			method: "POST",
			body: JSON.stringify(company),
		});
		//IF SUCCESS SET RESULT
		if (fetchs.status === 200) {
			setMsg("SUCCESS");
			setShow(true);
		} else {
			setMsg(fetchs.status);
			setShow(true);
		}
	}

	async function getResult() {
		const fetchs = await fetch("/api/trucking/search", {
			headers: { query: Search },
		});
		//IF SUCCESS SET RESULT
		if (fetchs.status === 200) {
			setSelect([]);
			setWarning(false);
			const truck = await fetchs.json();
			setResult(truck);
		} else {
			setSelect([]);
			setResult(false);
			setWarning(true);
		}
	}

	const mailBCC = Select.map((ga) => ga.F_EMAIL);
	const mailSubject = `[JW] DRAYAGE INQUIRY; ${
		Search && Search.toUpperCase()
	} PORT - `;
	const mailBody = `All,
   \nPlease advise the drayage rate for below;
   Import shipment / Legal weight
   From: ${Search && Search.toUpperCase()} PORT
   Delivery To:`;

	const emailHref = `mailto:${TOKEN && TOKEN.first} ${
		TOKEN && TOKEN.last
	} [JW] <${TOKEN && TOKEN.email}>?bcc=${mailBCC}&subject=${encodeURIComponent(
		mailSubject
	)}&body=${encodeURIComponent(mailBody)}`;

	if (TOKEN && TOKEN.group) {
		return (
			<Layout TOKEN={TOKEN} TITLE="Trucking">
				<div className="d-flex flex-sm-row justify-content-between">
					<div className="flex-column">
						<h3 className="dark:text-white">Trucking</h3>
					</div>
					<div className="flex-column">
						<InputGroup
							large={true}
							className="w-100"
							leftIcon="search"
							placeholder="Search Port Name..."
							type="text"
							onChange={(e) => setSearch(e.target.value)}
							onKeyPress={(e) => {
								if (e.key == "Enter") getResult();
							}}
						></InputGroup>
					</div>
				</div>
				<div className="text-right mb-2">
					<Popover2
						content={
							<Menu>
								<MenuItem text="Add" icon="add" onClick={() => setOpen(1)} />
								<MenuItem text="Delete" icon="delete" />
								<Divider />
								<MenuItem
									text="Send Email"
									icon="envelope"
									target="__blank"
									href={Select.length > 0 ? emailHref : "#"}
									disabled={!Select.length}
								/>
							</Menu>
						}
						placement="bottom-end"
					>
						<Button rightIcon="caret-down" icon="truck">
							Action
						</Button>
					</Popover2>
				</div>
				{Warning && (
					<Row className="mt-4">
						<Col>
							<Alert color="warning">NO DATA FOUND</Alert>
						</Col>
					</Row>
				)}
				<Card className="bg-transparent border-0">
					{Result && (
						<BootstrapTable
							keyField="F_ID"
							data={Result}
							columns={columns}
							selectRow={selectRow}
							wrapperClasses="table-responsive text-xs rounded"
							cellEdit={cellEditFactory({
								mode: TOKEN.group < 213 && "click",
								afterSaveCell: async (oldValue, newValue, row) => {
									console.log("PRV VALUE: " + oldValue);
									console.log("NEW VALUE: " + newValue);
									var Query = "";
									Query += `F_COMPANY='${row.F_COMPANY}', F_EMAIL='${row.F_EMAIL}', F_PIC='${row.F_PIC}', F_TYPE='${row.F_TYPE}', F_DG='${row.F_DG}', F_OVERWEIGHT='${row.F_OVERWEIGHT}', F_RF='${row.F_RF}', F_20MAX='${row.F_20MAX}', F_20TRI_AXLE='${row.F_20TRI_AXLE}', F_40MAX='${row.F_40MAX}', F_40OW='${row.F_40OW}', F_REMARK=N'${row.F_REMARK}', F_PORT='${row.F_PORT}' WHERE F_ID='${row.F_ID}'`;
									const fetchs = await fetch("/api/trucking/update", {
										method: "POST",
										body: Query,
									});
									if (fetchs.status === 200) {
										setMsg(`UPDATED ${newValue}`);
										setShow(true);
									}
								},
							})}
						/>
					)}
				</Card>
				<Dialog
					isOpen={open}
					title="Add Trucking Company"
					icon="add"
					onClose={() => setOpen(0)}
				>
					<div className={Classes.DIALOG_BODY}>
						<InputGroup
							className="mb-2"
							leftIcon="locate"
							placeholder="Port"
							onChange={(e) => setCompany({ ...company, PORT: e.target.value })}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="office"
							placeholder="Company"
							onChange={(e) =>
								setCompany({ ...company, COMPANY: e.target.value })
							}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="bookmark"
							placeholder="Type"
							onChange={(e) => setCompany({ ...company, TYPE: e.target.value })}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="user"
							placeholder="PIC"
							onChange={(e) => setCompany({ ...company, PIC: e.target.value })}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="more"
							placeholder="DG"
							onChange={(e) => setCompany({ ...company, DG: e.target.value })}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="more"
							placeholder="OW"
							onChange={(e) =>
								setCompany({ ...company, OVERWEIGHT: e.target.value })
							}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="more"
							placeholder="RF"
							onChange={(e) => setCompany({ ...company, RF: e.target.value })}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="more"
							placeholder="20M"
							onChange={(e) =>
								setCompany({ ...company, _20MAX: e.target.value })
							}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="more"
							placeholder="20TR"
							onChange={(e) =>
								setCompany({ ...company, _20TRI_AXLE: e.target.value })
							}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="more"
							placeholder="40M"
							onChange={(e) =>
								setCompany({ ...company, _40MAX: e.target.value })
							}
						></InputGroup>
						<InputGroup
							className="mb-2"
							leftIcon="more"
							placeholder="20OW"
							onChange={(e) =>
								setCompany({ ...company, _40OW: e.target.value })
							}
						></InputGroup>
						<InputGroup
							leftIcon="annotation"
							placeholder="Note"
							type="textarea"
							onChange={(e) =>
								setCompany({ ...company, REMARK: e.target.value })
							}
						></InputGroup>
					</div>
					<div className={Classes.DIALOG_FOOTER}>
						<div className={Classes.DIALOG_FOOTER_ACTIONS}>
							<Button icon="add" onClick={postCompany}>
								Add
							</Button>
							<Button>Cancel</Button>
						</div>
					</div>
				</Dialog>
				<FormsToaster />
				<style jsx>
					{`
						.fa-search {
							position: absolute;
							top: 12px;
							left: 30px;
						}
					`}
				</style>
			</Layout>
		);
	} else {
		return <p>Redirecting...</p>;
	}
};

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	return { props: { Cookie: cookies } };
}

export default Index;
