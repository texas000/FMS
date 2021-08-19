import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import Company from "../../components/Company/Company";

export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		return {
			props: {
				token: token,
				q: query.Detail,
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

export default function company({ token, q }) {
	const { data } = useSWR(`/api/company/detail?q=${q}`);
	const { data: balance } = useSWR(`/api/company/balance?q=${q}`);
	const { data: invoice } = useSWR(`/api/company/pending?q=${q}`);

	return (
		<Layout
			TOKEN={token}
			TITLE={(data && data[0] && data[0][0].F_FName) || "Company"}
			LOADING={!data}
		>
			{!data ? (
				<></>
			) : (
				<Company
					data={data[0]}
					contact={data[1]}
					balance={balance}
					invoice={invoice}
				/>
			)}
		</Layout>
	);
}
