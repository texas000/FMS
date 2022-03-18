import moment from "moment";
import { Fragment } from "react";
import { BlobProvider } from "@react-pdf/renderer";
import usdFormat from "../../lib/currencyFormat";
import CheckRequestForm from "./ApRequestForm";
import Loading from "../../components/Loader";
export default function ApManageDialog({ selected, ap }) {
	const Status = ({ data }) => {
		if (data == 101) {
			return <span className="text-green-500 font-bold">REQUESTED</span>;
		}
		if (data == 110) {
			return <span className="text-red-500 font-bold">DIRECTOR REJECTED</span>;
		}
		if (data == 111) {
			return (
				<span className="text-green-500 font-bold">DIRECTOR APPROVED</span>
			);
		}
		if (data == 120) {
			return (
				<span className="text-red-500 font-bold">ACCOUNTING REJECTED</span>
			);
		}
		if (data == 121) {
			return (
				<span className="text-green-500 font-bold">ACCOUNTING APPROVED</span>
			);
		}
		if (data == 131) {
			return <span className="text-green-500 font-bold">CEO APPROVED</span>;
		}
	};
	return (
		<Fragment>
			<div className="card rounded mb-2 py-1 text-center">
				<Status data={selected.STATUS} />
			</div>
			{ap ? (
				<div className="card my-2">
					{/* CARD HEADER   */}
					<div className="flex justify-between bg-gray-100 text-black dark:bg-gray-500 dark:text-white rounded-t shadow-inner font-semibold text-lg px-3 py-3">
						<span>{selected.REFNO}</span>
						<span>{selected.Creator}</span>
					</div>
					{/* CARD BODY */}
					<div className="leading-8 p-3">
						<li className="font-bold text-gray-700">Charge Summary</li>
						<ul className="my-2 px-2 divide-y divide-gray-300 rounded border border-gray-100">
							<li className="flex justify-between">
								<span>Invoice Number</span>
								<span
									className="text-indigo-500 font-bold tracking-wider hover:text-indigo-700 cursor-pointer"
									onClick={() => {
										window.open(`/ap/${selected.TBID}`, "_blank");
									}}
								>
									{selected.INVOICE || "EMPTY"}
								</span>
							</li>
							<li className="flex justify-between">
								<span>Payment method</span>
								<span className="text-indigo-500 font-bold tracking-wider">
									{selected.TYPE}
								</span>
							</li>
							{ap && (
								<Fragment>
									<li className="flex justify-between">
										<span>Customer</span>
										<span className="pl-3 truncate text-indigo-500 font-bold tracking-wider">
											{ap.Customer}
										</span>
									</li>
									<li className="flex justify-between">
										<span>Vendor</span>
										<span
											className="pl-3 truncate text-indigo-500 font-bold tracking-wider hover:text-indigo-700 cursor-pointer"
											onClick={() => {
												window.open(`/company/${ap.F_PayTo}`, "_blank");
											}}
										>
											{selected.VENDOR}
										</span>
									</li>
								</Fragment>
							)}
						</ul>
						<li className="font-bold text-gray-700 mt-4">Charge Detail</li>
						<ul className="my-2 px-2 divide-y-4 divide-double divide-gray-300 rounded border border-gray-100">
							<ul className="my-2 px-2 divide-y divide-gray-300">
								{ap &&
									ap.Detail.length &&
									ap.Detail.map((ga) => (
										<li
											key={ga.F_ID}
											className="flex justify-between text-gray-500 text-sm py-1"
										>
											<span>{ga.F_Description}</span>
											<span>{usdFormat(ga.F_Amount)}</span>
										</li>
									))}
							</ul>
							<li className="px-2 flex font-bold justify-between text-gray-500 text-sm py-2 border-t border-gray-300">
								<span>TOTAL</span>
								<span>{usdFormat(ap?.F_InvoiceAmt)}</span>
							</li>
						</ul>
						<li className="font-bold text-gray-700 mt-4">Attachments</li>
						<ul className="my-2 divide-y divide-gray-300 rounded overflow-hidden">
							{ap?.Files.length &&
								ap.Files.map((ga, i) => (
									<li
										key={`${i}-file`}
										className={`grid grid-cols-5 text-white rounded overflow-hidden ${
											ga.F_SECURITY ? "bg-indigo-500" : "bg-gray-400"
										}`}
									>
										<div
											className="grid place-items-center hover:opacity-50 active:bg-indigo-700 cursor-pointer"
											onClick={async () => {
												const data = await fetch(
													`/api/file/get?ref=${
														selected.REFNO
													}&file=${encodeURIComponent(ga.F_FILENAME)}`
												);
												const blob = await data.blob();
												var file = new Blob([blob], {
													type: blob.type,
												});
												var fileURL = URL.createObjectURL(file);
												// prevent safari browser block new tab open
												var ua = navigator.userAgent.toLowerCase();
												if (ua.indexOf("safari") != -1) {
													if (ua.indexOf("chrome") == -1) {
														window.location.assign(fileURL);
													}
												}
												window.open(fileURL, "_blank");
											}}
										>
											<svg
												width="24"
												viewBox="0 0 24 24"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												className="place-items-center"
											>
												<path
													className="fill-current"
													d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
												/>
												<path
													className="fill-current"
													fillRule="evenodd"
													clipRule="evenodd"
													d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
												/>
											</svg>
										</div>
										<div
											className="w-full text-center hover:opacity-50 active:bg-indigo-700 text-xs col-span-4 cursor-pointer p-1"
											onClick={() => {
												window.location.assign(
													`/api/file/get?ref=${
														selected.REFNO
													}&file=${encodeURIComponent(ga.F_FILENAME)}`
												);
											}}
										>
											<span className="uppercase">{ga.F_LABEL} -</span>
											<span className="font-bold"> {ga.F_FILENAME}</span>
										</div>
									</li>
								))}
							{selected && ap && (
								<BlobProvider
									document={
										<CheckRequestForm
											oim={selected.REFNO}
											pic={selected.Creator}
											payto={ap.Vendor}
											customer={ap.Customer}
											amt={ap.F_InvoiceAmt}
											type={selected.TYPE.toUpperCase()}
											desc={ap.Detail.map(
												(ga) => `\t\t${ga.F_Description}\n`
											).join("")}
											inv={ap.F_InvoiceNo}
											due={
												ap.F_DueDate
													? moment(ap.F_DueDate).utc().format("L")
													: ""
											}
											approved={
												selected.STATUS === 111 || selected.STATUS === 121
											}
											user2={selected.USER_2}
											user3={selected.USER_3}
										/>
									}
								>
									{({ blob, url, loading, error }) => (
										<li
											className="grid grid-cols-5 text-white rounded overflow-hidden bg-indigo-500 text-xs cursor-pointer"
											onClick={() => {
												window.open(url, "_blank");
											}}
										>
											<div className="grid place-items-center hover:opacity-50">
												<svg
													width="24"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														className="fill-current"
														d="M15.0856 12.5315C14.8269 12.2081 14.3549 12.1557 14.0315 12.4144L12.75 13.4396V10.0001C12.75 9.58585 12.4142 9.25006 12 9.25006C11.5858 9.25006 11.25 9.58585 11.25 10.0001V13.4396L9.96849 12.4144C9.64505 12.1557 9.17308 12.2081 8.91432 12.5315C8.65556 12.855 8.708 13.327 9.03145 13.5857L11.5287 15.5835C11.6575 15.6877 11.8215 15.7501 12 15.7501C12.1801 15.7501 12.3453 15.6866 12.4746 15.5809L14.9685 13.5857C15.2919 13.327 15.3444 12.855 15.0856 12.5315Z"
													/>
													<path
														className="fill-current"
														fillRule="evenodd"
														clipRule="evenodd"
														d="M8.46038 7.28393C9.40301 5.8274 11.0427 4.86182 12.9091 4.86182C15.7228 4.86182 18.024 7.05632 18.1944 9.82714C18.2506 9.825 18.307 9.82392 18.3636 9.82392C20.7862 9.82392 22.75 11.7878 22.75 14.2103C22.75 16.6328 20.7862 18.5966 18.3636 18.5966L7 18.5966C3.82436 18.5966 1.25 16.0223 1.25 12.8466C1.25 9.67101 3.82436 7.09665 7 7.09665C7.50391 7.09665 7.99348 7.16164 8.46038 7.28393ZM12.9091 6.36182C11.404 6.36182 10.1021 7.23779 9.48806 8.51108C9.31801 8.86369 8.90536 9.0262 8.54054 8.88424C8.0639 8.69877 7.54477 8.59665 7 8.59665C4.65279 8.59665 2.75 10.4994 2.75 12.8466C2.75 15.1939 4.65279 17.0966 7 17.0966L18.3627 17.0966C19.9568 17.0966 21.25 15.8044 21.25 14.2103C21.25 12.6162 19.9577 11.3239 18.3636 11.3239C18.1042 11.3239 17.8539 11.358 17.6164 11.4214C17.3762 11.4855 17.1198 11.4265 16.9319 11.2637C16.7439 11.1009 16.6489 10.8556 16.6781 10.6087C16.6955 10.461 16.7045 10.3103 16.7045 10.1573C16.7045 8.0611 15.0053 6.36182 12.9091 6.36182Z"
													/>
												</svg>
											</div>
											<div className="col-span-4 text-center py-1 hover:opacity-50">
												COVER
											</div>
										</li>
									)}
								</BlobProvider>
							)}
						</ul>
					</div>
				</div>
			) : (
				<Loading show={true} />
			)}

			<p className="text-center text-xs text-gray-300 mb-2">
				Requested: {moment(selected.CREATED).utc().format("LLL")} by{" "}
				{selected.Creator}
			</p>
			{selected.USER2 && (
				<p className="text-center text-xs text-gray-300">
					Approved: {moment(selected.UPDATED).utc().format("LLL")} by{" "}
					{selected.USER_3 || selected.USER_2}
				</p>
			)}
		</Fragment>
	);
}
