import Layout from "../../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import { ContextMenu2 } from "@blueprintjs/popover2";
import { Menu, MenuItem } from "@blueprintjs/core";
import { post } from "axios";
export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		return {
			props: {
				token: token,
				q: query.paths,
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

const File = ({ file, path }) => (
	<ContextMenu2
		content={
			<Menu>
				<MenuItem
					text="Open"
					onClick={async () => {
						const data = await fetch(
							`/api/synology/download?path=${encodeURIComponent(`["${path}"]`)}`
						);
						const blob = await data.blob();
						var fileBlob = new Blob([blob], {
							type: blob.type,
						});
						var fileURL = URL.createObjectURL(fileBlob);
						window.open(fileURL, "_blank");
					}}
				/>
				<MenuItem
					text="Save"
					onClick={async () => {
						const data = await fetch(
							`/api/synology/download?path=${encodeURIComponent(`["${path}"]`)}`
						);
						const blob = await data.blob();
						var fileBlob = new Blob([blob], {
							type: blob.type,
						});
						var fileURL = URL.createObjectURL(fileBlob);

						const link = document.createElement("a");
						link.target = "_blank";
						link.href = fileURL;
						link.download = file;

						// Append to html link element page
						document.body.appendChild(link);

						// Start download
						link.click();

						// Clean up and remove the link
						link.parentNode.removeChild(link);
					}}
				/>
				<MenuItem text="Delete..." intent="danger" />
			</Menu>
		}
	>
		<div className="my-context-menu-target">{file}</div>
	</ContextMenu2>
);

export default function file(props) {
	const router = useRouter();
	const [path, setPath] = useState("");
	const { data, mutate } = useSWR(
		`/api/synology/list?path=${props.q ? decodeURIComponent(props.q) : ""}`
	);
	async function handleFileUpload(e) {
		var uploadFile = e.target.files[0];
		if (uploadFile) {
			var formData = new FormData();
			formData.append("file", uploadFile);
			post(`/api/synology/upload`, formData, {
				headers: {
					path: decodeURIComponent(props.q),
				},
			}).then((res) => {
				console.log(res);
				mutate();
			});
		}
	}
	return (
		<Layout TOKEN={props.token} TITLE="Dashboard" LOADING={false}>
			<h1 className="text-2xl">{decodeURIComponent(props.q)}</h1>
			<label className="block">
				<span className="sr-only">Choose file</span>
				<input
					type="file"
					className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
					onChange={handleFileUpload}
				/>
			</label>

			{/* <input
				type="file"
				id="formFile"
				className="custom-file-input"
				placeholder="Upload file"
				onChange={handleFileUpload}
			></input> */}
			{data &&
				data.data &&
				data.data.files?.map((ga) => {
					return (
						<div
							key={ga.path}
							className={`cursor-pointer hover:text-gray-300 ${
								ga.isdir ? "text-blue-500" : "text-gray-500"
							}`}
							onClick={async () => {
								if (ga.isdir) {
									router.push(`/file/${encodeURIComponent(ga.path)}`);
								}
							}}
						>
							<File file={ga.name} path={ga.path}></File>
						</div>
					);
				})}
		</Layout>
	);
}
