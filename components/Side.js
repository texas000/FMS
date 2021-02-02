import { Collapse } from "reactstrap";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Sidebar = ({ Token, toggle, setToggle }) => {
  const router = useRouter();
  // Toggle the side navigation
  // const [toggle, setToggle] = React.useState(false)
  const [t1, setT1] = React.useState(false);
  const collapse = () => setToggle(!toggle);
  return (
    <ul
      className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion d-print-none ${
        toggle && "toggled"
      }`}
      id="accordionSidebar"
    >
      {/* <!-- Sidebar - Brand --> */}
      <a
        className="sidebar-brand d-flex align-items-center justify-content-center"
        href="#"
        onClick={() => router.push("/dashboard")}
      >
        <div className="sidebar-brand-icon">
          <img
            src="/favicon/apple-touch-icon.png"
            className="avatar"
            style={{ borderRadius: "50%", width: "35px", height: "35px" }}
          />
          {/* <i className="fa fa-user"></i> */}
        </div>
        <div className="sidebar-brand-text mx-3">
          JWI FMS <sup>1.0.1</sup>
        </div>
      </a>

      {/* <!-- Divider --> */}
      <hr className="sidebar-divider my-0" />

      {/* <!-- Nav Item - Dashboard --> */}
      <li className={`nav-item ${router.pathname == "/dashboard" && "active"}`}>
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/dashboard")}
        >
          <i className="fa fa-clipboard"></i>
          <span>Dashboard</span>
        </a>
      </li>

      {/* <!-- Divider --> */}
      <hr className="sidebar-divider" />

      {/* <!-- Heading --> */}
      <div className="sidebar-heading">Interface</div>

      {/* Forwarding */}

      <li
        className={`nav-item ${router.pathname == "/forwarding" && "active"}`}
      >
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/forwarding")}
        >
          <i className="fa fa-ship"></i>
          <span>Forwarding</span>
        </a>
      </li>

      {/* Trucking */}
      {Token.group < 223 && (
        <li
          className={`nav-item ${
            router.pathname == "/forwarding/trucking" && "active"
          }`}
        >
          <a
            className="nav-link"
            href="#"
            onClick={() => router.push("/forwarding/trucking")}
          >
            <i className="fa fa-truck"></i>
            <span>Trucking</span>
          </a>
        </li>
      )}

      {/* Board */}

      <li className={`nav-item ${router.pathname == "/board" && "active"}`}>
        <a className="nav-link" href="#" onClick={() => router.push("/board")}>
          <i className="fa fa-pencil"></i>
          <span>Board</span>
        </a>
      </li>

      {/* <!-- Nav Item - Pages Collapse Menu --> */}
      {/* <li className="nav-item">
			<a
				className="nav-link collapsed"
				onClick={() => setT1(!t1)}
				href="#"
				data-toggle="collapse"
				data-target="#collapseTwo"
				aria-expanded="true"
				aria-controls="collapseTwo"
			>
				<i className="fa fa-cog"></i>
				<span>Components</span>
			</a>
			<Collapse isOpen={t1}>
				<div className="bg-white py-2 collapse-inner rounded">
					<h6 className="collapse-header">Custom Components:</h6>
					<a className="collapse-item" href="buttons.html">
						Buttons
					</a>
					<a className="collapse-item" href="cards.html">
						Cards
					</a>
				</div>
			</Collapse>
		</li> */}

      {/* <!-- Divider --> */}
      <hr className="sidebar-divider" />

      {/* <!-- Heading --> */}
      {/* <!-- Nav Item - Pages Collapse Menu --> */}
      {Token.uid == 5 && (
        <>
          <div className="sidebar-heading">Addons</div>
          <li className={`nav-item`}>
            <a
              className="nav-link collapsed"
              href="#"
              onClick={() => setT1(!t1)}
              data-toggle="collapse"
              data-target="#collapsePages"
              aria-expanded="true"
              aria-controls="collapsePages"
            >
              <i className="fa fa-folder"></i>
              <span>Pages</span>
            </a>
            <Collapse isOpen={t1}>
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Developing Pages</h6>
                <a
                  className="collapse-item"
                  href="#"
                  onClick={() => router.push("/warehouse/staff")}
                >
                  Staff Manage
                </a>
                <a
                  className="collapse-item"
                  href="#"
                  onClick={() => router.push("/calendar")}
                >
                  Calendar
                </a>
                <div className="collapse-divider"></div>
                <h6 className="collapse-header">Other Pages:</h6>
                <a
                  className="collapse-item"
                  href="#"
                  onClick={() => router.push("/dev/404")}
                >
                  404 Page
                </a>
                <a
                  className="collapse-item"
                  href="#"
                  onClick={() => router.push("/dev/blank")}
                >
                  Blank Page
                </a>
              </div>
            </Collapse>
          </li>
          {/* <!-- Nav Item - Charts --> */}
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              onClick={() => alert("Chart page is under construction")}
            >
              <i className="fa fa-desktop"></i>
              <span>Charts</span>
            </a>
          </li>

          {/* <!-- Nav Item - Tables --> */}
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              onClick={() => alert("Tables page is under construction")}
            >
              <i className="fa fa-table"></i>
              <span>Tables</span>
            </a>
          </li>

          {/* <!-- Divider --> */}
          <hr className="sidebar-divider d-none d-md-block" />
        </>
      )}

      {/* <!-- Mobile View --> */}
      {/* <!-- Sidebar Toggler (Sidebar) --> */}
      <div className="text-center d-none d-md-inline">
        <button
          className="rounded-circle border-0"
          id="sidebarToggle"
          onClick={collapse}
        ></button>
      </div>

      {/* <!-- Sidebar Message --> */}
      <div className="sidebar-card">
        <p className="text-center mb-2">
          <strong>JWI FMS</strong> Dev Version <br />
          {Token && <span>{`Auth Level - ${Token.group}\n`}</span>}
          {Token && Token.admin ? (
            <span>Admin Granted</span>
          ) : (
            <span>Welcome User</span>
          )}
        </p>
        <a
          className="btn btn-success btn-sm"
          href="mailto:it@jamesworldwide.com"
        >
          Send Request
        </a>
      </div>
      <style jsx>{`
        @font-face {
          font-family: "Font Awesome 5 Free";
          src: url("/css/webfonts/fa-solid-900.eot?#iefix")
              format("embedded-opentype"),
            url("/css/webfonts/fa-solid-900.woff2") format("woff2"),
            url("/css/webfonts/fa-solid-900.woff") format("woff"),
            url("/css/webfonts/fa-solid-900.ttf") format("truetype"),
            url("./webfonts/fa-solid-900.svg#fontawesome") format("svg");
        }
        @font-face {
          font-family: "Font Awesome 5 Free";
          src: url("/css/webfonts/fa-regular-400.eot?#iefix")
              format("embedded-opentype"),
            url("/css/webfonts/fa-regular-400.woff2") format("woff2"),
            url("/css/webfonts/fa-regular-400.woff") format("woff"),
            url("/css/webfonts/fa-regular-400.ttf") format("truetype"),
            url("./webfonts/fa-regular-400.svg#fontawesome") format("svg");
        }
        @font-face {
          font-family: "Font Awesome 5 Free";
          src: url("/css/webfonts/fa-solid-900.eot?#iefix")
              format("embedded-opentype"),
            url("/css/webfonts/fa-solid-900.woff2") format("woff2"),
            url("/css/webfonts/fa-solid-900.woff") format("woff"),
            url("/css/webfonts/fa-solid-900.ttf") format("truetype"),
            url("./webfonts/fa-solid-900.svg#fontawesome") format("svg");
        }
      `}</style>
    </ul>
  );
};

export default Sidebar;
