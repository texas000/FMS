import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import router from "next/router";

export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		return {
			props: {
				token: token,
				word: query.q || null,
			},
		};
	} catch (err) {
		return {
			props: { token: false },
		};
	}
}

export default function search(props) {
	return (
		<Layout TOKEN={props.token} TITLE="Profile">
			<div className="flex flex-sm-row justify-between">
				<h3 className="dark:text-white">Profile</h3>
			</div>

			<div className="card flex justify-center items-center p-3 gap-2 mt-3">
				<img
					src="/image/icons/sarah.svg"
					className="object-cover h-20 w-20 rounded-full border-2 border-gray-200"
					width="128"
					height="128"
				/>

				<h3 className="my-2 font-bold dark:text-white">
					{props.token.first} {props.token.last}
				</h3>

				<p className="w-1/2 sm:w-100 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
					<span className="font-bold">EMAIL</span>
					<span className="truncate">{props.token.email}</span>
				</p>
				<p className="w-1/2 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
					<span className="font-bold">EXTENSION</span>
					<span>{props.token.group}</span>
				</p>
				<p className="w-1/2 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
					<span className="font-bold">ACCOUNT</span>
					<span>{props.token.username}</span>
				</p>
				<p className="w-1/2 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
					<span className="font-bold">EMPLOYEE CODE</span>
					<span>{props.token.uid}</span>
				</p>
				<p className="w-1/2 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
					<span className="font-bold">FS ACCOUNT</span>
					<span>{props.token.fsid}</span>
				</p>
			</div>
		</Layout>
	);
}
