import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		return {
			props: {
				token: token,
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

export default function file(props) {
	const { data } = useSWR(`/api/synology/list`);
	const router = useRouter();
	return (
		<Layout TOKEN={props.token} TITLE="Dashboard" LOADING={false}>
			{/* {JSON.stringify(props.token)} */}
			{data &&
				data.data &&
				data.data.shares?.map((ga) => {
					return (
						<div
							key={ga.path}
							className={`cursor-pointer hover:text-gray-300 ${
								ga.isdir ? "text-blue-500" : "text-gray-500"
							}`}
							onClick={() => {
								router.push(`/file/${encodeURIComponent(ga.path)}`);
							}}
						>
							{ga.name}
						</div>
					);
				})}
		</Layout>
	);
}
