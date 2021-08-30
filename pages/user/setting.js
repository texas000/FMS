import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";

const Index = ({ Cookie, Page }) => {
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
	const router = useRouter();
	const [activeTab, setActiveTab] = useState(Page);
	useEffect(() => {
		!TOKEN && router.push("/login");
		setActiveTab(Page);
	}, [Page]);

	if (TOKEN && TOKEN.group) {
		return (
			<Layout TOKEN={TOKEN} TITLE="User">
				<div className="row ml-2">
					<h3>User Information</h3>
				</div>

				<div className="row">
					<div className="col-md-3 col-xl-2 my-3">
						<div className="card border-left-primary shadow h-100 py-2">
							<div className="card-header bg-white" style={{ borderRadius: 0 }}>
								<h5 className="card-title mb-0">Profile Settings</h5>
							</div>
							<div
								className="list-group listgroup-flush"
								role="tablist"
								style={{ borderRadius: 0 }}
							>
								<a
									className={`list-group-item list-group-item-action ${
										activeTab == 1 && "active"
									}`}
									data-toggle="list"
									onClick={() => setActiveTab(1)}
									role="tab"
									aria-selected="false"
								>
									Account
								</a>
							</div>
						</div>
					</div>
					<div className="col-md-9 col-xl-10 my-3">
						<div className="tab-content">
							<div
								className={`tab-pane fade ${activeTab == 1 && "show active"}`}
								id="account"
								role="tabpanel"
							>
								<div className="card shadow h-100 mb-2">
									<div className="card-header">
										<h5 className="card-title mb-0">Public Info</h5>
									</div>
									<div className="card-body">
										<form>
											<div className="row">
												<div className="col-md-8">
													<div className="form-group">
														<label htmlFor="username">Username</label>
														<input
															type="text"
															className="form-control"
															id="username"
															placeholder="username"
															defaultValue={TOKEN.username}
														/>
													</div>
													<div className="form-group">
														<label htmlFor="group">Group</label>
														<input
															type="text"
															className="form-control"
															id="group"
															placeholder="group"
															defaultValue={TOKEN.group}
														/>
													</div>
												</div>
												<div className="col-md-4">
													<div className="text-center">
														<img
															src="/image/icons/sarah.svg"
															className="img-fluid mt-2"
															width="128"
															height="128"
														/>
														<br />
														<small>Customzied profile picture</small>
													</div>
												</div>
											</div>
											<button
												type="submit"
												className="btn btn-primary btn-sm mt-2"
												onClick={() => alert("Please Contact Manager")}
											>
												Save Changes
											</button>
										</form>
									</div>
								</div>
								<div className="card shadow h-100">
									<div className="card-header">
										<h5 className="card-title mb-0">Private Info</h5>
									</div>
									<div className="card-body">
										<form>
											<div className="row">
												<div className="col-md-6">
													<div className="form-group">
														<label htmlFor="fname">First Name</label>
														<input
															type="text"
															className="form-control"
															id="fname"
															placeholder="First Name"
															defaultValue={TOKEN.first}
														/>
													</div>
												</div>
												<div className="col-md-6">
													<div className="form-group">
														<label htmlFor="lname">Last Name</label>
														<input
															type="text"
															className="form-control"
															id="lname"
															placeholder="Last Name"
															defaultValue={TOKEN.last}
														/>
													</div>
												</div>
											</div>
											<div className="row">
												<div className="col-md-12">
													<div className="form-group">
														<label htmlFor="email">Email</label>
														<input
															type="text"
															className="form-control"
															id="email"
															placeholder="E-mail"
															defaultValue={TOKEN.email}
														/>
													</div>
												</div>
												<div className="col-md-12">
													<div className="form-group">
														<label htmlFor="fsid">
															Freight Stream Username
														</label>
														<input
															type="text"
															className="form-control"
															id="fsid"
															placeholder="Freight Stream"
															defaultValue={TOKEN.fsid}
														/>
													</div>
												</div>
											</div>
											<button
												type="submit"
												className="btn btn-primary btn-sm mt-2"
												onClick={() => alert("Please Contact Manager")}
											>
												Save Changes
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		);
	} else {
		return <p>Redirecting...</p>;
	}
};

export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);

	var page = query.page || 1;
	// Pass data to the page via props
	return {
		props: { Cookie: cookies, Page: page },
	};
}

export default Index;
