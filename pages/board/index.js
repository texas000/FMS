import cookie from "cookie";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import {
	Button,
	Card,
	Col,
	Input,
	Row,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import "quill/dist/quill.snow.css";
import moment from "moment";

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		const Fetch = await fetch(`${process.env.BASE_URL}api/board/getPost`);
		const Data = await Fetch.json();
		return {
			props: {
				token: token,
				Board: Data,
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

const Index = ({ token, Board }) => {
	const router = useRouter();
	const [title, setTitle] = useState(false);
	const [body, setBody] = useState(false);
	const [modal, setModal] = useState(false);
	const [Text, setText] = useState("");
	const ReactQuill =
		typeof window === "object" ? require("react-quill") : () => false;

	const toggle = () => setModal(!modal);

	const columns = [
		{
			dataField: "TITLE",
			text: "TITLE",
			align: "center",
			headerClasses: "text-white bg-primary font-weight-light",
			classes: "btn-link",
			headerAlign: "center",
		},
		{
			dataField: "WRITER",
			text: "WRITER",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "10%" },
			align: "center",
			headerAlign: "center",
		},
		{
			dataField: "VIEWS",
			text: "VIEWS",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "10%" },
			align: "center",
			headerAlign: "center",
			formatter: (cell) => (cell ? cell : 0),
		},
		{
			dataField: "TIME",
			text: "TIME",
			headerClasses: "text-white bg-primary font-weight-light",
			headerStyle: { width: "30%" },
			align: "center",
			headerAlign: "center",
			formatter: (cell) => moment(cell).utc().format("LLL"),
		},
	];

	const defaultSorted = [
		{
			dataField: "ID",
			order: "desc",
		},
	];

	const rowEvents = {
		onClick: (e, row, rowIndex) => {
			router.push(`board/${row.ID}`);
		},
	};
	const addNew = async () => {
		const Write = {
			Title: title,
			body: encodeURIComponent(Text),
			UserID: token.uid,
		};
		const fetchs = await fetch("/api/board/postBoard", {
			method: "POST",
			body: JSON.stringify(Write),
		});
		if (fetchs.status === 200) {
			const Info = await fetchs.json();
			console.log(Info);
		} else {
			console.log(fetchs);
		}
	};

	return (
		<>
			<Head>
				<meta charSet="utf-8" />
			</Head>
			<Layout TOKEN={token} TITLE="Board">
				<div className="d-flex flex-sm-row justify-content-between">
					<div className="flex-column">
						<h3 className="mb-4 font-weight-light">Board</h3>
					</div>
					<div className="flex-column">
						<Button
							onClick={() => setModal(true)}
							size="sm"
							color="primary"
							outline
						>
							Write <i className="fa fa-edit fa-lg ml-2"></i>
						</Button>
					</div>
				</div>

				<Modal isOpen={modal} toggle={toggle} size="lg">
					<ModalHeader toggle={toggle} className="pl-4">
						Share your idea..
					</ModalHeader>
					<ModalBody className="pt-4 px-4">
						<InputGroup className="mb-2">
							<Input
								placeholder="TITLE"
								onChange={(e) => setTitle(e.target.value)}
							/>
						</InputGroup>
					</ModalBody>
					<ModalBody className="px-4">
						<InputGroup className="mb-4">
							{ReactQuill && (
								<ReactQuill
									value={Text}
									onChange={setText}
									style={{ width: "100%" }}
								/>
							)}
							{/* <Input
                    type="textarea"
                    placeholder="TYPE HERE"
                    style={{ height: "20rem" }}
                    onChange={(e) =>
                      setBody(encodeURIComponent(e.target.value))
                    }
                  /> */}
						</InputGroup>
					</ModalBody>
					<Button className="mx-4 my-4" color="success" onClick={addNew}>
						SUBMIT
					</Button>
				</Modal>

				<Card className="bg-transparent border-0">
					<Row className="my-4">
						<Col>
							<BootstrapTable
								data={Board}
								columns={columns}
								rowEvents={rowEvents}
								wrapperClasses="table-responsive text-xs rounded"
								keyField="ID"
								striped
								hover
								condensed={true}
								bordered={false}
								defaultSorted={defaultSorted}
							/>
						</Col>
					</Row>
				</Card>
			</Layout>
		</>
	);
};

export default Index;
