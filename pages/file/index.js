import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import { useState } from "react";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Listing from "../../components/File/Listing";

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
	const { data, error } = useSWR(`/api/synology/list`);
	return (
		<Layout TOKEN={props.token} TITLE="Dashboard" LOADING={!data}>
			<Listing data={data} />
		</Layout>
	);
}
