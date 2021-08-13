import { Button } from "@blueprintjs/core";
import moment from "moment";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import useSWR from "swr";

export const Comment = ({ Reference, Uid }) => {
	const { data, mutate } = useSWR(`/api/comment/list?ref=${Reference}`);
	const ReactQuill =
		typeof window === "object" ? require("react-quill") : () => false;
	const [html, setHtml] = useState("");
	const [comments, setComment] = useState([]);
	const [isOpen, setOpen] = useState(false);

	const CommentList = ({ first, last, content, uid, date }) => (
		<div className="media my-1">
			<div
				className="avatar text-xs mr-3 text-uppercase"
				style={{
					display: "inline-block",
					verticalAlign: "middle",
					width: "35px",
					height: "35px",
					position: "relative",
					backgroundColor: "rgba(0,0,0,0.3)",
					color: "#FFF",
					borderRadius: "50%",
				}}
			>
				<span
					className="text-center"
					style={{
						left: "50%",
						top: "50%",
						position: "absolute",
						transform: "translate(-50%, -50%)",
					}}
				>
					{first.charAt(0)}
					{last.charAt(0)}
				</span>
			</div>
			<div className="content media-body text-xs">
				<div className="metadata">
					<span className="text-gray-900 text-uppercase">
						{first} {last}{" "}
					</span>
					<span className="ml-2 text-gray-500">{moment(date).fromNow()}</span>
					<span>{uid && <i className="fa fa-times ml-2 text-danger"></i>}</span>
				</div>
				<span className="text-gray-800">
					<div dangerouslySetInnerHTML={{ __html: content }}></div>
				</span>
			</div>
		</div>
	);

	useEffect(() => {
		getComment();
		setOpen(true);
	}, [Reference]);

	async function getComment() {
		const comment = await fetch("/api/dashboard/comment", {
			headers: {
				ref: Reference,
			},
		}).then(async (j) => await j.json());
		setComment(comment);
	}

	async function uploadComment() {
		const post = await fetch(`/api/comment/post?ref=${Reference}`, {
			method: "POST",
			headers: {
				"Content-type": "application/json; charset=UTF-8",
			},
			body: JSON.stringify({ content: html }),
		});
		console.log(post.status);
		setHtml("");
		mutate();
	}

	return (
		<div className="card my-4 shadow py-3 px-3">
			<h4 className="text-lg">Comments</h4>

			{data ? (
				data.map((ga) => (
					<CommentList
						key={ga.F_ID}
						last={ga.LNAME}
						first={ga.FNAME}
						content={ga.F_Content}
						date={ga.F_Date}
					/>
				))
			) : (
				<></>
			)}

			{isOpen && ReactQuill && (
				<ReactQuill
					className="my-3 w-100 dark:text-white"
					value={html}
					placeholder="Type here..."
					modules={{
						toolbar: {
							container: [
								[{ header: [1, 2, 3, 4, 5, 6, false] }],
								// [{ font: [] }],
								// [{ align: [] }],
								["bold", "italic", "underline"],
								[
									{ list: "ordered" },
									{ list: "bullet" },
									{
										color: [
											"#000000",
											"#e60000",
											"#ff9900",
											"#ffff00",
											"#008a00",
											"#0066cc",
											"#9933ff",
											"#ffffff",
											"#facccc",
											"#ffebcc",
											"#ffffcc",
											"#cce8cc",
											"#cce0f5",
											"#ebd6ff",
											"#bbbbbb",
											"#f06666",
											"#ffc266",
											"#ffff66",
											"#66b966",
											"#66a3e0",
											"#c285ff",
											"#888888",
											"#a10000",
											"#b26b00",
											"#b2b200",
											"#006100",
											"#0047b2",
											"#6b24b2",
											"#444444",
											"#5c0000",
											"#663d00",
											"#666600",
											"#003700",
											"#002966",
											"#3d1466",
											"custom-color",
										],
									},
									{ background: [] },
									"link",
									// "image",
								],
							],
						},
						keyboard: {
							bindings: {
								// handleEnter: {
								//   key: 13,
								//   handler: function (e) {
								//     setHtml("");
								//   },
								// },
							},
						},
					}}
					theme="snow"
					onChange={setHtml}
				/>
			)}
			<div className="mt-2">
				<button
					onClick={uploadComment}
					className="mr-2 mb-2 bg-blue-500 px-4 py-1 rounded-sm border text-white hover:bg-blue-600"
				>
					Save
				</button>
				<button
					className="mb-2 px-3 py-1 rounded-sm text-gray-600 dark:text-white hover:bg-gray-300"
					onClick={() => setHtml("")}
				>
					Cancel
				</button>
			</div>
		</div>
	);
};

export default Comment;
