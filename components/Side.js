import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
const Sidebar = ({ Token, toggle, setToggle }) => {
  const router = useRouter();
  const [t1, setT1] = useState(false);
  const [t2, setT2] = useState(false);
  const collapse = () => setToggle(!toggle);
  return (
    <ul
      className={`navbar-nav bg-gradient-to-b from-blue-600 to-blue-500 dark:from-blue-900 dark:to-indigo-900 sidebar sidebar-dark accordion d-print-none ${
        toggle && "toggled"
      }`}
    >
      {/* <!-- Sidebar Logo --> */}
      <Link href="/dashboard">
        <a className="h-16 d-flex align-items-center justify-content-center">
          <div>
            <img
              src="/favicon/apple-touch-icon.png"
              className="avatar rounded-full w-9 h-9"
            />
          </div>
        </a>
      </Link>

      {/* Divider */}
      <hr className="border-t border-blue-500 mx-3 my-1" />

      {/* <!-- Nav Item --> */}
      <li className={`nav-item ${router.pathname == "/dashboard" && "active"}`}>
        <Link href="/dashboard">
          <a className="nav-link hover:no-underline">
            <i className="fa fa-clipboard"></i>
            <span className="font-light overflow-hidden">Dashboard</span>
          </a>
        </Link>
      </li>

      {/* <!-- Divider --> */}
      <hr className="border-t border-blue-500 mx-3 my-1" />

      {/* <!-- Heading --> */}
      <div className="sidebar-heading">FMS</div>

      {/* Forwarding */}

      <li
        className={`nav-item ${
          router.pathname.substring(1, 11) == "request" && "active"
        }`}
      >
        <Link href="/request">
          <a className="nav-link hover:no-underline">
            <i className="fa fa-thumbs-up"></i>
            <span>Request</span>
          </a>
        </Link>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/oim" && "active"
        }`}
      >
        <Link href="/forwarding/oim">
          <a className="nav-link hover:no-underline">
            <i className="fa fa-anchor"></i>
            <span>Ocean Import</span>
          </a>
        </Link>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/oex" && "active"
        }`}
      >
        <Link href="/forwarding/oex">
          <a className="nav-link hover:no-underline">
            <i className="fa fa-anchor fa-flip-vertical"></i>
            <span>Ocean Export</span>
          </a>
        </Link>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/aim" && "active"
        }`}
      >
        <Link href="/forwarding/aim">
          <a className="nav-link hover:no-underline">
            <i className="fa fa-plane"></i>
            <span>Air Import</span>
          </a>
        </Link>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/aex" && "active"
        }`}
      >
        <Link href="/forwarding/aex">
          <a className="nav-link hover:no-underline">
            <i className="fa fa-plane fa-flip-vertical"></i>
            <span>Air Export</span>
          </a>
        </Link>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/oth" && "active"
        }`}
      >
        <Link href="/forwarding/other">
          <a className="nav-link hover:no-underline">
            <i className="fa fa-link"></i>
            <span>Other</span>
          </a>
        </Link>
      </li>

      {/* Trucking */}
      {Token.group < 223 && (
        <li
          className={`nav-item ${
            router.pathname == "/forwarding/trucking" && "active"
          }`}
        >
          <Link href="/forwarding/trucking">
            <a className="nav-link hover:no-underline">
              <i className="fa fa-truck"></i>
              <span>Trucking</span>
            </a>
          </Link>
        </li>
      )}

      {/* Board */}

      <li
        className={`nav-item ${
          router.pathname.substring(1, 6) == "board" && "active"
        }`}
      >
        <Link href="/board">
          <a className="nav-link hover:no-underline">
            <i className="fa fa-pencil"></i>
            <span>Board</span>
          </a>
        </Link>
      </li>

      {Token.admin > 5 && (
        <li
          className={`nav-item ${
            router.pathname.substring(1, 11) == "manage" && "active"
          }`}
        >
          <Link href="/manage">
            <a className="nav-link hover:no-underline">
              <i className="fa fa-tasks"></i>
              <span>Manage</span>
            </a>
          </Link>
        </li>
      )}

      {Token.admin > 6 && (
        <li
          className={`nav-item ${
            router.pathname.substring(1, 11) == "accounting" && "active"
          }`}
        >
          <Link href="/accounting">
            <a className="nav-link hover:no-underline">
              <i className="fa fa-dollar"></i>
              <span>Accounting</span>
            </a>
          </Link>
        </li>
      )}
      {Token.admin > 3 && (
        <>
          <li
            className={`nav-item ${
              router.pathname.substring(1, 10) == "statistic" && "active"
            }`}
          >
            <a
              className={`nav-link hover:no-underline ${!t2 && "collapsed"}`}
              onClick={() => setT2(!t2)}
              data-toggle="collapse"
              data-target="#collapsePages"
              aria-expanded={`${t2 ? "true" : "false"}`}
              aria-controls="collapsePages"
            >
              <i className="fa fa-bar-chart"></i>
              <span>Statistic</span>
            </a>
            <div className={`collapse ${t2 && "show"}`}>
              <div className="bg-white py-2 collapse-inner rounded">
                <h6 className="collapse-header">Company</h6>
                <Link href="/statistic/custom">
                  <a className="collapse-item">Custom</a>
                </Link>
                <Link href="/statistic/house">
                  <a className="collapse-item">House</a>
                </Link>
                <Link href="/statistic/container">
                  <a className="collapse-item">Container</a>
                </Link>
              </div>
            </div>
          </li>
          {Token.admin === 9 && (
            <li className={`nav-item ${router.pathname == "/hr" && "active"}`}>
              <Link href="/hr">
                <a className="nav-link hover:no-underline">
                  <i className="fa fa-user"></i>
                  <span>Human Resource</span>
                </a>
              </Link>
            </li>
          )}
        </>
      )}
      {/* <!-- Divider --> */}
      <hr className="border-t border-blue-500 mx-3 my-1" />

      {/* <!-- Heading --> */}
      {/* <!-- Nav Item - Pages Collapse Menu --> */}
      {Token.uid == 5 && (
        <>
          <div className="sidebar-heading">Addons</div>
          <li className={`nav-item`}>
            <a
              className={`nav-link hover:no-underline ${!t1 && "collapsed"}`}
              href="#"
              onClick={() => setT1(!t1)}
              data-toggle="collapse"
              data-target="#collapsePages"
              aria-expanded={`${t1 ? "true" : "false"}`}
              aria-controls="collapsePages"
            >
              <i className="fa fa-folder"></i>
              <span>Pages</span>
            </a>
            <div className={`collapse ${t1 && "show"}`}>
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
            </div>
          </li>
          {/* <!-- Nav Item - Charts --> */}
          <li className="nav-item">
            <a
              className="nav-link hover:no-underline"
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
              className="nav-link hover:no-underline"
              href="#"
              onClick={() => alert("Tables page is under construction")}
            >
              <i className="fa fa-table"></i>
              <span>Tables</span>
            </a>
          </li>

          {/* <!-- Divider --> */}
          <hr className="border-t border-blue-500 mx-3 my-1" />
        </>
      )}

      {/* <!-- Mobile View --> */}
      {/* <!-- Sidebar Toggler (Sidebar) --> */}
      {/* <div className="text-center d-none d-md-inline">
				<button
					className="rounded-circle border-0"
					id="sidebarToggle"
					onClick={collapse}
				></button>
			</div> */}

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
          target="_blank"
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
