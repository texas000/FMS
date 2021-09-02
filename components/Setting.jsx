import { Dialog, Classes } from "@blueprintjs/core";
import { useEffect } from "react";
import { useState } from "react";

export default function Setting({ setOpen, open }) {
	const [notiEnabled, setNotiEndabled] = useState("default");

	function requestNotification() {
		if (navigator.userAgent.search("Chrome")) {
			const title = `Message for testing purpose`;
			const option = {
				icon: "/image/JLOGO.png",
				body: "Hey there! How do you want the notification",
			};
			try {
				switch (Notification.permission) {
					case "granted":
						const noti = new Notification(title, option);
						noti.onclick = function () {
							window.open("https://jwiusa.com");
						};
						break;
					case "default":
						Notification.requestPermission().then((ga) => setNotiEndabled(ga));
						break;
					case "denied":
						Notification.requestPermission().then((ga) => setNotiEndabled(ga));
						break;
				}
			} catch (err) {
				console.log(err);
			}
		}
	}

	useEffect(() => {
		if (navigator.userAgent.search("Chrome")) {
			try {
				setNotiEndabled(Notification.permission);
			} catch (err) {
				console.log(err);
			}
		}
	}, []);

	return (
		<Dialog
			isOpen={open}
			onClose={() => {
				setOpen(false);
			}}
			title="Preference"
			className="dark:bg-gray-600 bg-white rounded-xl lg:w-1/2"
		>
			{/* <div className={Classes.DIALOG_BODY}> */}
			<div className="p-4 bg-white">
				<div className="shadow overflow-hidden sm:rounded-lg">
					<div className="px-4 py-3 sm:px-6">
						<h3 className="text-lg leading-6 font-medium text-gray-900">
							System Setting
						</h3>
					</div>
					<div className="border-t border-gray-200">
						<dl>
							<div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">
									Desktop Notification
								</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									<input
										className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
										type="checkbox"
										checked={notiEnabled == "granted"}
										onClick={requestNotification}
									/>
									<label
										className="ml-3 min-w-0 flex-1"
										onClick={requestNotification}
									>
										Notification {notiEnabled}
									</label>
								</dd>
							</div>
							{/* <div className="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">
									Application for
								</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									Backend Developer
								</dd>
							</div>
							<div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">
									Email address
								</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									margotfoster@example.com
								</dd>
							</div>
							<div className="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">
									Salary expectation
								</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									$120,000
								</dd>
							</div>
							<div className="bg-gray-50 px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">About</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim
									incididunt cillum culpa consequat. Excepteur qui ipsum aliquip
									consequat sint. Sit id mollit nulla mollit nostrud in ea
									officia proident. Irure nostrud pariatur mollit ad adipisicing
									reprehenderit deserunt qui eu.
								</dd>
							</div>
							<div className="bg-white px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
								<dt className="text-sm font-medium text-gray-500">
									Attachments
								</dt>
								<dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
									<ul
										role="list"
										className="border border-gray-200 rounded-md divide-y divide-gray-200"
									>
										<li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
											<div className="w-0 flex-1 flex items-center">
												<span className="ml-2 flex-1 w-0 truncate">
													resume_back_end_developer.pdf
												</span>
											</div>
											<div className="ml-4 flex-shrink-0">
												<a
													href="#"
													className="font-medium text-indigo-600 hover:text-indigo-500"
												>
													Download
												</a>
											</div>
										</li>
										<li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
											<div className="w-0 flex-1 flex items-center">
												<span className="ml-2 flex-1 w-0 truncate">
													coverletter_back_end_developer.pdf
												</span>
											</div>
											<div className="ml-4 flex-shrink-0">
												<a
													href="#"
													className="font-medium text-indigo-600 hover:text-indigo-500"
												>
													Download
												</a>
											</div>
										</li>
									</ul>
								</dd>
							</div>
						 */}
						</dl>
					</div>
				</div>
			</div>
		</Dialog>
	);
}
