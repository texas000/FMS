// import { Button, Input, InputGroup, InputGroupAddon } from "reactstrap";
import { useRouter } from "next/router";
import moment from "moment";
import firebase from "firebase/app";
import "firebase/auth";
import AsyncSelect from "react-select/async";
import cookie from "cookie";
import { useState, useEffect } from "react";
import NavSearch from "./NavSearch";

const Top = ({ Token, toggle, setToggle }) => {
	const router = useRouter();
	const [search, setSearch] = useState(false);
	const [alertToggle, setalertToggle] = useState(false);
	const [messageToggle, setmessageToggle] = useState(false);
	const [searchAlertToggle, setSearchAlertToggle] = useState(false);

	const [userToggle, setuserToggle] = useState(false);
	const [selected, setSelected] = useState(null);
	const [searchType, setSearchType] = useState("oim");

	const [Notifications, setNotifications] = useState([]);
	const [Messages, setMessages] = useState([]);

	const loadOptions = async (inputValue, callback) => {
		if (inputValue.length > 1) {
			return fetch(`/api/forwarding/${searchType}/getList`, {
				headers: {
					key: cookie.parse(window.document.cookie).jamesworldwidetoken,
					search: inputValue,
				},
			}).then((res) => res.json());
		}
	};

	useEffect(() => {
		//When window type is defined, and local stroage is defined, get notification and board board data from local storage and set to state value, otherwise, set noti and message as empty array
		if (typeof window !== "undefined") {
			if (localStorage.length) {
				// get notification from local stroage,
				const noti = localStorage.getItem("notification");
				if (noti != "undefined") {
					//if notification is defined at the local storage, then set the notification to the state
					setNotifications(JSON.parse(noti));
				}
				// get board notification from local stroage
				const board = localStorage.getItem("board");
				if (board != "undefined") {
					// if board notification is defined at the local storage, then set the message to the state
					setMessages(JSON.parse(board));
				}
			}
		}
	}, []);

	// ROUTE TO THE FORWARDING SEARCH PAGE WHEN USER SUBMIT AT NAV SERCH BAR - /forwarding?query.search  (FORWARDING SEARCH PAGE)
	const getResult = async () => {
		router.push({ pathname: `/forwarding`, query: { search } });
	};

	// Small screen only, collapse the sidebar
	const collapse = () => setToggle(!toggle);

	// Logout from the navigation bar
	function logout() {
		// If user logged in with firebase, then sign out firebase
		if (firebase.apps.length > 0) {
			firebase.auth().signOut();
		}
		// Push to the login page and the token will be repfreshed
		router.push("/login");
	}

	return (
		<nav className="navbar navbar-expand h-16 mb-4 static-top shadow w-100 bg-white dark:bg-gray-700 dark:text-white">
			{/* <!-- Sidebar Toggle (Topbar) --> */}
			<button
				id="sidebarToggleTop"
				className="btn btn-link d-md-none rounded-circle mr-3"
				onClick={collapse}
			>
				<i className="fa fa-bars"></i>
			</button>

			{/* <!-- Topbar Search --> */}
			{/* <form className="d-none d-sm-inline-block form-inline mr-auto ml-md-3 my-2 my-md-0 mw-100 navbar-search w-1/3">
				
				<AsyncSelect
					instanceId="search"
					cacheOptions
					value={selected}
					getOptionLabel={(e) =>
						`${e.F_RefNo} - ${e.Customer || "NO CUSTOMER"}`
					}
					getOptionValue={(e) => e.F_ID}
					onInputChange={(e) => setSearch(e)}
					onChange={(e) => {
						setSelected(e);
						router.push(`/forwarding/${searchType}/${e.F_RefNo}`);
					}}
					placeholder={`Search ${searchType.toUpperCase()}...`}
					loadOptions={loadOptions}
					className="w-100"
					onKeyDown={(e) => {
						if (e.key == "Enter") {
							if (!e.target.value) {
								e.preventDefault();
							}
						}
					}}
				/>
			</form> */}

			{/* <!-- Topbar Navbar --> */}
			{/* topbar navbar-nav */}
			<ul className="ml-auto flex flex-row my-auto">
				{/* <!-- Nav Item - Search Dropdown (Visible Only XS) --> */}
				<li className="flex-1 dropdown no-arrow d-sm-none">
					<a
						className="nav-link dropdown-toggle"
						href="#"
						id="searchDropdown"
						role="button"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded="false"
					>
						{/* USE THIS FOR SERACH ON XS DEVICES */}
						{/* <i className="fa fa-search fa-fw"></i> */}
					</a>
					{/* <!-- Dropdown - Messages --> */}
					<div
						className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
						aria-labelledby="searchDropdown"
					>
						<form className="form-inline mr-auto navbar-search w-auto">
							<div className="input-group">
								<input
									type="text"
									className="form-control bg-light border-0 small"
									placeholder="Search for..."
									aria-label="Search"
									aria-describedby="basic-addon2"
									onChange={(e) => setSearch(e.target.value)}
								/>
								<div className="input-group-append">
									<button
										className="btn btn-primary"
										type="button"
										onClick={getResult}
									>
										<i className="fas fa-search fa-sm"></i>
									</button>
								</div>
							</div>
						</form>
					</div>
				</li>

				<li
					className="flex-1 nav-item dropdown no-arrow my-auto text-center"
					// onMouseEnter={() => setSearchAlertToggle(true)}
					// onMouseLeave={() => setSearchAlertToggle(false)}
					onClick={() => setSearchAlertToggle((prev) => !prev)}
				>
					<a
						className="nav-link dropdown-toggle"
						href="#"
						id="searchAlertDropdown"
						role="button"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded={searchAlertToggle}
					>
						<i className="fa fa-search fa-fw"></i>
						{/* <!-- Counter - Alerts --> */}
						{/* <span className="badge badge-danger badge-counter">5</span> */}
					</a>
					{/* <div
						className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${
							searchAlertToggle && "show"
						}`}
						aria-labelledby="alertsDropdown"
					>
						<h6 className="dropdown-header">Search Option</h6>
						<a
							className="dropdown-item d-flex align-items-center"
							href="#"
							onClick={() => setSearchType("oim")}
						>
							<div className="mr-3">
								<div className="icon-circle bg-primary">
									<i className="fa fa-ship text-white"></i>
								</div>
							</div>
							<div>
								<div className="small text-gray-500">Forwarding OIM search</div>
								<span className="font-weight-bold text-primary">OIM</span>
							</div>
						</a>
						<a
							className="dropdown-item d-flex align-items-center"
							href="#"
							onClick={() => setSearchType("oex")}
						>
							<div className="mr-3">
								<div className="icon-circle bg-primary">
									<i className="fa fa-ship text-white"></i>
								</div>
							</div>
							<div>
								<div className="small text-gray-500">Forwarding OEX search</div>
								<span className="font-weight-bold text-primary">OEX</span>
							</div>
						</a>
						<a
							className="dropdown-item d-flex align-items-center"
							href="#"
							onClick={() => setSearchType("aim")}
						>
							<div className="mr-3">
								<div className="icon-circle bg-primary">
									<i className="fa fa-plane text-white"></i>
								</div>
							</div>
							<div>
								<div className="small text-gray-500">Forwarding AIM search</div>
								<span className="font-weight-bold text-primary">AIM</span>
							</div>
						</a>
						<a
							className="dropdown-item d-flex align-items-center"
							href="#"
							onClick={() => setSearchType("aex")}
						>
							<div className="mr-3">
								<div className="icon-circle bg-primary">
									<i className="fa fa-plane text-white"></i>
								</div>
							</div>
							<div>
								<div className="small text-gray-500">Forwarding AEX search</div>
								<span className="font-weight-bold text-primary">AEX</span>
							</div>
						</a>
						<a
							className="dropdown-item d-flex align-items-center"
							href="#"
							onClick={() => setSearchType("other")}
						>
							<div className="mr-3">
								<div className="icon-circle bg-primary">
									<i className="fa fa-flag text-white"></i>
								</div>
							</div>
							<div>
								<div className="small text-gray-500">
									Forwarding OTHER search
								</div>
								<span className="font-weight-bold text-primary">OTHER</span>
							</div>
						</a>
					</div> */}
				</li>

				{/* <!-- Nav Item - Alerts --> */}
				<li
					className="flex-1 nav-item dropdown no-arrow mx-3 my-auto text-center"
					onClick={() => setalertToggle((prev) => !prev)}
				>
					<a
						className="dropdown-toggle"
						href="#"
						id="alertsDropdown"
						role="button"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded={alertToggle}
					>
						<i className="fa fa-bell fa-fw"></i>
						{/* <!-- Counter - Alerts --> */}
						{/* {Notifications && (
							<span
								className={`badge ${
									Notifications.length ? "badge-danger" : "badge-secondary"
								} badge-counter`}
							>
								{Notifications.length}
							</span>
						)} */}
					</a>
					{/* <!-- Dropdown - Alerts --> */}
					<div
						className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${
							alertToggle && "show"
						}`}
						aria-labelledby="alertsDropdown"
					>
						<h6 className="dropdown-header">Alerts Center</h6>
						{/* {navAlert &&
              navAlert.map((ga, i) => (
                <a
                  key={ga.id + i}
                  className="dropdown-item d-flex align-items-center"
                  href="#"
                >
                  <div>
                    <span className="font-weight-bold">{ga.title}</span>
                    <div className="small text-gray-500">
                      {moment(ga.created.seconds * 1000).fromNow()}
                    </div>
                  </div>
                </a>
              ))} */}
						{Notifications &&
							Notifications.map((ga) => (
								<a
									key={ga.ID}
									className="dropdown-item d-flex align-items-center"
									href="#"
									onClick={() => router.push(`/forwarding/oim/${ga.RefNo}`)}
								>
									<div className="mr-3">
										<div className="icon-circle bg-primary">
											<i className="fa fa-ship text-white"></i>
										</div>
									</div>
									<div>
										<span className="font-weight-bold">{ga.RefNo}</span>
										<div className="small text-gray-500">
											{ga.Customer}
											<br />
											Arrival {moment(ga.ETA).fromNow()}
										</div>
									</div>
								</a>
							))}
						<a
							className="dropdown-item text-center small text-gray-500"
							href="#"
							onClick={() => router.push("/dashboard")}
						>
							Read More Messages
						</a>
					</div>
				</li>

				{/* <!-- Nav Item - Messages --> */}
				<li
					className="flex-1 nav-item dropdown no-arrow my-auto mr-3 text-center"
					onClick={() => setmessageToggle((prev) => !prev)}
				>
					<a
						className="nav-link dropdown-toggle"
						href="#"
						id="messagesDropdown"
						role="button"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded={messageToggle}
					>
						<i className="fa fa-envelope fa-fw"></i>
						{/* <!-- Counter - Messages --> */}
						{/* <span className="badge badge-secondary badge-counter">
							{Messages && Messages.length}
						</span> */}
					</a>
					{/* <!-- Dropdown - Messages --> */}
					<div
						className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in ${
							messageToggle && "show"
						}`}
						aria-labelledby="messagesDropdown"
					>
						<h6 className="dropdown-header">Message Center</h6>
						{/* {Messages &&
              Messages.length &&
              Messages.map((ga) => (
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="#"
                  onClick={() => router.push(`/board/${ga.ID}`)}
                  key={ga.ID}
                >
                  <div className="dropdown-list-image mr-3">
                    <img
                      className="rounded-circle"
                      src="/image/icons/sarah.svg"
                      alt=""
                    />
                    <div className="status-indicator bg-success"></div>
                  </div>
                  <div className="font-weight-bold">
                    <div className="text-truncate">{ga.TITLE}</div>
                    <div className="small text-gray-500">
                      {moment(ga.TIME).format("LL")}
                    </div>
                  </div>
                </a>
              ))} */}
						<a
							className="dropdown-item text-center small text-gray-500"
							href="#"
							onClick={() => router.push("/board")}
						>
							Read More Messages
						</a>
					</div>
				</li>

				<div className="border-r h-10 my-auto"></div>

				{/* <!-- Nav Item - User Information --> */}
				<li
					className="flex-1 nav-item dropdown no-arrow mx-2"
					onClick={() => setuserToggle((prev) => !prev)}
				>
					<a
						className="nav-link dropdown-toggle inline-flex mr-2"
						href="#"
						id="userDropdown"
						role="button"
						data-toggle="dropdown"
						aria-haspopup="true"
						aria-expanded={userToggle}
					>
						<span className="d-none d-lg-inline text-gray-700 text-xs pt-1 my-auto mr-2 dark:text-white">
							{Token
								? Token.displayName || `${Token.first} ${Token.last}`
								: "Please Login"}
						</span>
						<img
							className="w-8 min-w-max h-8"
							src={Token.photoURL || "/image/icons/sarah.svg"}
						/>
					</a>
					{/* <!-- Dropdown - User Information --> */}
					<div
						className={`dropdown-menu dropdown-menu-right shadow animated--grow-in ${
							userToggle && "show"
						}`}
						aria-labelledby="userDropdown"
					>
						<a
							className="dropdown-item"
							href="#"
							onClick={() =>
								router.push({
									pathname: "/user/setting",
									query: { page: 1 },
								})
							}
						>
							<i className="fa fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
							Profile
						</a>
						<a
							className="dropdown-item"
							href="#"
							onClick={() =>
								router.push({
									pathname: "/user/setting",
									query: { page: 2 },
								})
							}
						>
							<i className="fa fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
							Change Password
						</a>
						<a
							className="dropdown-item"
							href="#"
							onClick={() =>
								router.push({
									pathname: "/user/setting",
									query: { page: 3 },
								})
							}
						>
							<i className="fa fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
							Company Contacts
						</a>
						<div className="dropdown-divider"></div>
						<a
							className="dropdown-item"
							href="#"
							onClick={logout}
							data-toggle="modal"
							data-target="#logoutModal"
						>
							<i className="fa fa-power-off fa-sm fa-fw mr-2 text-gray-400"></i>
							Logout
						</a>
					</div>
				</li>
			</ul>
			{searchAlertToggle && <NavSearch setValue={setSearchAlertToggle} />}
		</nav>
	);
};

export default Top;
