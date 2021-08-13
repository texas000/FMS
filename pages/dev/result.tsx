import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import { fetchGetJSON } from "../../components/Utils/api-helper";
import Cart from "../../components/Cart";
import { useShoppingCart } from "use-shopping-cart";
import usdFormat from "../../lib/currencyFormat";
const ResultPage = ({ Cookie }) => {
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const router = useRouter();
	const { data, error } = useSWR(
		router.query.session_id
			? `/api/stripe/checkout_sessions/${router.query.session_id}`
			: null,
		fetchGetJSON
	);

	if (error) return <div>failed to load</div>;

	const PrintObject = (content) => {
		const formattedContent: string = JSON.stringify(content, null, 2);
		return (
			<div>
				{content.content.payment_intent.charges.data.map((ga) => (
					<div
						key={ga.id}
						className="relative flex flex-col sm:flex-row sm:items-center bg-white shadow rounded-md py-5 pl-6 pr-8 sm:pr-6 my-3"
					>
						<div className="flex flex-row items-center border-b sm:border-b-0 w-full sm:w-auto pb-2 sm:pb-0">
							<div className="text-green-500">
								<svg
									className="w-6 sm:w-5 h-6 sm:h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
							</div>
							<div className="text-sm font-medium ml-3 text-black">
								{ga.paid ? "Payment Successful!" : "Payment Failed"}
							</div>
							<div className="text-sm font-medium ml-3 text-green-500">
								{usdFormat(ga.amount / 100)}
							</div>
							<div
								className="text-sm font-medium ml-3 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded cursor-pointer"
								onClick={() => window.open(ga.receipt_url, "_blank")}
							>
								{`Receipt Number ${ga.receipt_number}`}
							</div>
							<div
								className="text-sm font-medium ml-3 text-white bg-blue-500 hover:bg-blue-700 p-2 rounded cursor-pointer"
								onClick={() =>
									window.open(`mailto:${ga.billing_details.email}`, "_blank")
								}
							>
								{ga.billing_details.name}
							</div>
						</div>
					</div>
				))}
			</div>
			// <pre>{formattedContent}</pre>
		);
	};

	const ClearCart = () => {
		const { clearCart } = useShoppingCart();
		useEffect(() => clearCart(), [clearCart]);
		return <></>;
	};

	return (
		<Layout TOKEN={TOKEN} TITLE="Payment Result" LOADING={!data}>
			<div className="page-container">
				<h1 className="text-black">Checkout Payment Result</h1>
				<PrintObject content={data ?? "loading..."} />
				<Cart>
					<ClearCart />
				</Cart>
			</div>
		</Layout>
	);
};

export default ResultPage;

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);

	// Pass data to the page via props
	return { props: { Cookie: cookies } };
}
