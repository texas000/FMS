import cookie from "cookie";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import {
	Button,
	Input,
	InputGroup,
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
			headerAlign: "center",
		},
		{
			dataField: "WRITER",
			text: "WRITER",
			headerStyle: { width: "10%" },
			align: "center",
			headerAlign: "center",
		},
		{
			dataField: "VIEWS",
			text: "VIEWS",
			headerStyle: { width: "10%" },
			align: "center",
			headerAlign: "center",
			formatter: (cell) => (cell ? cell : 0),
		},
		{
			dataField: "TIME",
			text: "TIME",
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
			router.push(`/board/${row.ID}`);
		},
	};
	const addNew = async () => {
		const Write = {
			Title: title,
			body: Text,
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
			<Layout TOKEN={token} TITLE="Board">
				<div className="flex justify-between">
					<h3 className="dark:text-white">Board</h3>

					<button
						onClick={() => setModal(true)}
						className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
					>
						Write <i className="fa fa-edit fa-lg ml-2"></i>
					</button>
				</div>

				<Modal isOpen={modal} toggle={toggle} size="lg">
					<ModalHeader toggle={toggle} className="pl-4">
						Share your idea..
					</ModalHeader>
					<ModalBody className="pt-4 px-4">
						<input
							className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 py-2 pr-12 sm:text-sm border border-gray-300 rounded-md"
							placeholder="Type Title..."
							onChange={(e) => setTitle(e.target.value)}
						></input>
						{ReactQuill && (
							<ReactQuill
								value={Text}
								onChange={setText}
								className="w-100 h-20 my-3"
							/>
						)}
						<button
							className="mt-5 w-100 bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
							onClick={addNew}
						>
							SUBMIT
						</button>
					</ModalBody>
				</Modal>

				<div className="card my-3 pb-0">
					<BootstrapTable
						data={Board}
						columns={columns}
						rowEvents={rowEvents}
						wrapperClasses="w-auto"
						headerClasses="dark:text-white text-black font-semibold"
						rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer border-b-2 border-gray-200 bg-gray-100 dark:bg-gray-700 dark:text-white"
						keyField="ID"
						condensed={true}
						bordered={false}
						defaultSorted={defaultSorted}
					/>
				</div>
			</Layout>
		</>
	);
};

export default Index;
