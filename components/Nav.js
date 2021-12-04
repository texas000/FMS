import { useRouter } from "next/router";
import moment from "moment";
import firebase from "firebase/app";
import "firebase/auth";
import { useState, useEffect, createRef, useMemo } from "react";
import NavSearch from "./NavSearch";
import Setting from "./Setting";
import Contact from "./Contact";
import useSWR from "swr";
import Link from "next/link";
import { useHotkeys } from "@blueprintjs/core";

const Top = ({ Token, toggle, setToggle }) => {
  const { data: unread, mutate } = useSWR("/api/message/unread");
  const router = useRouter();
  const [search, setSearch] = useState(false);
  const [alertToggle, setalertToggle] = useState(false);
  const [searchAlertToggle, setSearchAlertToggle] = useState(false);
  const [userToggle, setuserToggle] = useState(false);
  const { data: msg } = useSWR(
    alertToggle ? "/api/message/getMessageList" : null
  );

  const [settingOpen, setSettingOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  async function markAsRead(id) {
    const res = await fetch(`/api/message/markAsRead?q=${id}`);
    console.log(res.status);
    mutate();
  }
  async function handleMarkAllasRead() {
    const res = await fetch(`/api/message/markAllAsRead`);
    console.log(res.status);
    mutate();
  }

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

  const hotkeys = useMemo(
    () => [
      {
        combo: "ctrl+shift+s",
        global: true,
        label: "Search Modal",
        onKeyDown: () => setSearchAlertToggle(!searchAlertToggle),
      },
      {
        combo: "shift+c",
        global: true,
        label: "Open Contact",
        onKeyDown: () => setContactOpen(!contactOpen),
      },
    ],
    [searchAlertToggle, contactOpen]
  );
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

  return (
    <nav className="flex content-between px-3 h-16 static-top w-100 bg-gray-100 d-print-none dark:bg-gray-600 dark:text-white">
      <div tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}></div>
      {/* navbar navbar-expand */}
      {/* <!-- Sidebar Toggle (Topbar) --> */}
      <button className="block md:hidden" onClick={collapse}>
        {/* HAMBURGER ICON */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.75 12C19.75 11.5858 19.4142 11.25 19 11.25H5C4.58579 11.25 4.25 11.5858 4.25 12C4.25 12.4142 4.58579 12.75 5 12.75H19C19.4142 12.75 19.75 12.4142 19.75 12Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.75 7C19.75 6.58579 19.4142 6.25 19 6.25H5C4.58579 6.25 4.25 6.58579 4.25 7C4.25 7.41421 4.58579 7.75 5 7.75H19C19.4142 7.75 19.75 7.41421 19.75 7Z"
            fill="black"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19.75 17C19.75 16.5858 19.4142 16.25 19 16.25H5C4.58579 16.25 4.25 16.5858 4.25 17C4.25 17.4142 4.58579 17.75 5 17.75H19C19.4142 17.75 19.75 17.4142 19.75 17Z"
            fill="black"
          />
        </svg>
      </button>

      {/* <!-- Topbar Navbar --> */}

      {/* topbar navbar-nav */}
      <ul className="ml-auto flex flex-row my-auto">
        <li className="flex-1 dropdown no-arrow d-sm-none">
          <a
            className="nav-link dropdown-toggle"
            id="searchDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          ></a>
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

        {/* SEARCH ICON */}
        <li
          className="nav-item dropdown no-arrow my-auto text-center"
          onClick={() => setSearchAlertToggle((prev) => !prev)}
        >
          <a
            className="nav-link dropdown-toggle"
            id="searchAlertDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded={searchAlertToggle}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current dark:text-white"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.385 15.4458C11.7348 17.5685 7.85532 17.4014 5.39854 14.9446C2.7625 12.3086 2.7625 8.0347 5.39854 5.39866C8.03458 2.76262 12.3084 2.76262 14.9445 5.39866C17.4013 7.85544 17.5683 11.7349 15.4457 14.3851L20.6013 19.5408C20.8942 19.8337 20.8942 20.3085 20.6013 20.6014C20.3084 20.8943 19.8335 20.8943 19.5407 20.6014L14.385 15.4458ZM6.4592 13.8839C4.40895 11.8337 4.40895 8.50957 6.4592 6.45932C8.50945 4.40907 11.8336 4.40907 13.8838 6.45932C15.9326 8.50807 15.9341 11.8288 13.8883 13.8794C13.8868 13.8809 13.8853 13.8824 13.8838 13.8839C13.8823 13.8854 13.8808 13.8869 13.8793 13.8884C11.8287 15.9342 8.50795 15.9327 6.4592 13.8839Z"
              />
            </svg>
          </a>
        </li>

        {/* ALARM */}
        <li
          className="nav-item dropdown no-arrow mx-3 my-auto text-center"
          onClick={() => setalertToggle((prev) => !prev)}
        >
          {unread && unread.COUNT ? (
            <span className="flex absolute h-4 w-4 top-0 right-0 left-auto -mt-1 text-cneter">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-blue-500">
                <div
                  className="flex-1 text-gray-100 font-semibold left-0"
                  style={{ fontSize: "0.7rem" }}
                >
                  {unread.COUNT}
                </div>
              </span>
            </span>
          ) : (
            <div></div>
          )}
          <a
            className="dropdown-toggle"
            id="alertsDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded={alertToggle}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current dark:text-white"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 3C13 2.44772 12.5523 2 12 2C11.4477 2 11 2.44772 11 3V3.75H10.4426C8.21751 3.75 6.37591 5.48001 6.23702 7.70074L6.01601 11.2342C5.93175 12.5814 5.47946 13.8797 4.7084 14.9876C4.01172 15.9886 4.63194 17.3712 5.84287 17.5165L9.25 17.9254V19C9.25 20.5188 10.4812 21.75 12 21.75C13.5188 21.75 14.75 20.5188 14.75 19V17.9254L18.1571 17.5165C19.3681 17.3712 19.9883 15.9886 19.2916 14.9876C18.5205 13.8797 18.0682 12.5814 17.984 11.2342L17.763 7.70074C17.6241 5.48001 15.7825 3.75 13.5574 3.75H13V3ZM10.4426 5.25C9.00958 5.25 7.82354 6.36417 7.73409 7.79438L7.51309 11.3278C7.41169 12.949 6.86744 14.5112 5.93959 15.8444C5.88924 15.9168 5.93406 16.0167 6.02159 16.0272L9.75925 16.4757C11.2477 16.6543 12.7523 16.6543 14.2407 16.4757L17.9784 16.0272C18.0659 16.0167 18.1108 15.9168 18.0604 15.8444C17.1326 14.5112 16.5883 12.949 16.4869 11.3278L16.2659 7.79438C16.1764 6.36417 14.9904 5.25 13.5574 5.25H10.4426ZM12 20.25C11.3096 20.25 10.75 19.6904 10.75 19V18.25H13.25V19C13.25 19.6904 12.6904 20.25 12 20.25Z"
              />
            </svg>
          </a>
          {/* dropdown-list dropdown-menu */}
          <div
            className={`absolute top-full left-auto right-0 z-50 bg-white list-none p-2 float-left text-left rounded-xl shadow-xl border border-gray-100 ${
              alertToggle ? "scale-100" : "hidden scale-0"
            }`}
            aria-labelledby="alertsDropdown"
          >
            <h6 className="p-2 font-semibold text-gray-800">Alarm</h6>
            <div className="overflow-y-scroll" style={{ maxHeight: "50vh" }}>
              {msg &&
                msg.map((ga) => (
                  <Link href={ga.F_LINK} key={ga.F_ID}>
                    <a
                      className="p-2 rounded max-w-20 whitespace-nowrap flex align-middle text-gray-700 hover:bg-indigo-50 hover:no-underline"
                      onClick={() => markAsRead(ga.F_ID)}
                    >
                      <div>
                        <span className="font-medium w-80">{ga.CREATOR}</span>
                        <div className="text-xs truncate w-80">{ga.F_BODY}</div>
                      </div>
                    </a>
                  </Link>
                ))}
            </div>
            <a
              className="p-2 bg-gray-50 rounded max-w-20 whitespace-nowrap flex text-center text-gray-700 hover:bg-indigo-50 hover:no-underline"
              onClick={handleMarkAllasRead}
            >
              Mark all notification as read
            </a>
          </div>
        </li>

        {/* <!-- Nav Item - Messages --> */}

        <div className="border-r h-10 my-auto"></div>

        {/* <!-- Nav Item - User Information --> */}
        <li
          className="dropdown my-auto"
          onClick={() => setuserToggle((prev) => !prev)}
        >
          <a
            className="hover:no-underline"
            id="userDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded={userToggle}
          >
            <span className="d-none d-lg-inline text-gray-700 px-2 text-xs font-medium dark:text-white">
              {Token
                ? Token.displayName || `${Token.first} ${Token.last}`
                : "Please Login"}
            </span>
            <img
              className="w-8 h-8 inline ml-2"
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
              onClick={() => router.push("/profile")}
            >
              <i className="fa fa-user fa-sm fa-fw mr-2 text-gray-400"></i>
              Profile
            </a>
            <a className="dropdown-item" onClick={() => setSettingOpen(true)}>
              <i className="fa fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i>
              Setting
            </a>
            <a className="dropdown-item" onClick={() => setContactOpen(true)}>
              <i className="fa fa-list fa-sm fa-fw mr-2 text-gray-400"></i>
              Company Contacts
            </a>
            <div className="dropdown-divider"></div>
            <a
              className="dropdown-item"
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
      <Setting setOpen={setSettingOpen} open={settingOpen} />
      <Contact setOpen={setContactOpen} open={contactOpen} />
    </nav>
  );
};

export default Top;
