import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import moment from "moment";
import useSWR from "swr";
import usdFormat from "../../lib/currencyFormat";

export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);

		return {
			props: {
				token: token,
				q: query.detail,
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

const MasterTable = ({ mas }) => (
	<div className="grid grid-cols-3 gap-4 mt-4">
		<div className="card p-3 col-span-2 rounded-xl">
			<dl className="p-2 grid grid-cols-2">
				<dt>REFERENCE NUMBER</dt>
				<dd>{mas.F_YourRef || "EMPTY"}</dd>
			</dl>
			<dl className="p-2 grid grid-cols-2">
				<dt>CREATED BY</dt>
				<dd className="uppercase">{mas.F_U1ID}</dd>
			</dl>
			<dl className="p-2 grid grid-cols-2">
				<dt>INVOICE AMOUNT</dt>
				<dd className="text-blue-500">{usdFormat(mas.F_InvoiceAmt)}</dd>
			</dl>
			<dl className="p-2 grid grid-cols-2">
				<dt>PAID AMOUNT</dt>
				<dd className="text-red-500">{usdFormat(mas.F_PaidAmt)}</dd>
			</dl>
		</div>
		<div className="p-3 card rounded-xl">
			<dl className="p-2 grid grid-cols-2">
				<dt>POST</dt>
				<dd>{moment(mas.F_PostDate).utc().format("L")}</dd>
			</dl>
			<dl className="p-2 grid grid-cols-2">
				<dt>INVOICE DATE</dt>
				<dd>{moment(mas.F_InvoiceDate).utc().format("L")}</dd>
			</dl>
			<dl className="p-2 grid grid-cols-2">
				<dt>DUE DATE</dt>
				<dd>{moment(mas.F_DueDate).utc().format("L")}</dd>
			</dl>
			<dl className="p-2 grid grid-cols-2">
				<dt>CREATED DATE</dt>
				<dd>{moment(mas.F_U1Date).utc().format("L")}</dd>
			</dl>
		</div>
	</div>
);

const HouseTable = ({ hus }) => (
	<div className="border-t border-gray-200 card col-span-2 rounded-xl mt-3 text-gray-800 overflow-hidden">
		<table className="min-w-full divide-y divide-gray-200">
			<thead className="bg-gray-100 py-3">
				<tr>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						CODE
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						DESCRIPTION
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						QTY
					</th>
					<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
						AMOUNT
					</th>
				</tr>
			</thead>
			<tbody className="bg-white divide-y divide-gray-200">
				{hus.map((ga) => (
					<tr key={ga.F_ID}>
						<td className="px-6 py-3 whitespace-nowrap">{ga.F_BillingCode}</td>
						<td className="px-6 py-3 whitespace-nowrap">{ga.F_Description}</td>
						<td className="px-6 py-3 whitespace-nowrap">{ga.F_Qty}</td>
						<td className="px-6 py-3 whitespace-nowrap">
							{usdFormat(ga.F_Amount)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	</div>
);

export default function invoice(props) {
	const { data } = useSWR(`/api/invoice/detail?q=${props.q}`);
	return (
		<Layout TOKEN={props.token} TITLE={props.q} LOADING={!data}>
			{data && data.length ? (
				<>
					<h3 className="dark:text-white">{props.q}</h3>

					<MasterTable mas={data[0]} />
					<HouseTable hus={data[1]} />
				</>
			) : (
				<h3 className="tracking-wider">Sorry, {props.q} is not found</h3>
			)}
		</Layout>
	);
}
