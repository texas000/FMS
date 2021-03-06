import { useRouter } from "next/router";

const Sidebar = ({ Token, toggle, setToggle }) => {
  const router = useRouter();
  const [t1, setT1] = React.useState(false);
  const [t2, setT2] = React.useState(false);
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
        onClick={() => {
          console.log(router.pathname.substring(1, 15));
          // router.push("/dashboard");
        }}
      >
        <div className="sidebar-brand-icon">
          <img
            src="/favicon/apple-touch-icon.png"
            className="avatar"
            style={{ borderRadius: "50%", width: "35px", height: "35px" }}
          />
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
      <div className="sidebar-heading">JW MENU</div>

      {/* Forwarding */}

      {/* <li
        className={`nav-item ${router.pathname == "/forwarding" && "active"}`}
      >
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/forwarding")}
        >
          <i className="fa fa-ship"></i>
          <span>FS Search</span>
        </a>
      </li> */}

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/oim" && "active"
        }`}
      >
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/forwarding/oim")}
        >
          <i className="fa fa-anchor"></i>
          <span>Ocean Import</span>
        </a>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/oex" && "active"
        }`}
      >
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/forwarding/oex")}
        >
          <i className="fa fa-anchor fa-flip-vertical"></i>
          <span>Ocean Export</span>
        </a>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/aim" && "active"
        }`}
      >
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/forwarding/aim")}
        >
          <i className="fa fa-plane"></i>
          <span>Air Import</span>
        </a>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/aex" && "active"
        }`}
      >
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/forwarding/aex")}
        >
          <i className="fa fa-plane fa-flip-vertical"></i>
          <span>Air Export</span>
        </a>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/oth" && "active"
        }`}
      >
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/forwarding/other")}
        >
          <i className="fa fa-link"></i>
          <span>Other</span>
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
      <li
        className={`nav-item ${
          router.pathname.substring(1, 8) == "company" && "active"
        }`}
      >
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/company")}
        >
          <i className="fa fa-address-card"></i>
          <span>Company</span>
        </a>
      </li>

      {/* Board */}

      <li
        className={`nav-item ${
          router.pathname.substring(1, 6) == "board" && "active"
        }`}
      >
        <a className="nav-link" href="#" onClick={() => router.push("/board")}>
          <i className="fa fa-pencil"></i>
          <span>Board</span>
        </a>
      </li>

      {/* <li className={`nav-item ${router.pathname == "/dev/chat" && "active"}`}>
        <a
          className="nav-link"
          href="#"
          onClick={() => router.push("/dev/chat")}
        >
          <i className="fa fa-comment"></i>
          <span>Chat</span>
        </a>
      </li> */}

      {Token.admin > 6 && (
        <li
          className={`nav-item ${
            router.pathname.substring(1, 11) == "accounting" && "active"
          }`}
        >
          <a
            className="nav-link"
            href="#"
            onClick={() => router.push("/accounting")}
          >
            <i className="fa fa-dollar"></i>
            <span>Accounting</span>
          </a>
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
              className={`nav-link ${!t2 && "collapsed"}`}
              href="#"
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
                <a
                  className="collapse-item"
                  href="#"
                  onClick={() => router.push("/statistic/custom")}
                >
                  Custom
                </a>
                <a
                  className="collapse-item"
                  href="#"
                  onClick={() => router.push("/statistic/house")}
                >
                  House
                </a>
                <a
                  className="collapse-item"
                  href="#"
                  onClick={() => router.push("/statistic/container")}
                >
                  Container
                </a>
              </div>
            </div>
          </li>
          {Token.admin === 9 && (
            <li className={`nav-item ${router.pathname == "/hr" && "active"}`}>
              <a
                className="nav-link"
                href="#"
                onClick={() => router.push("/hr")}
              >
                <i className="fa fa-user"></i>
                <span>Human Resource</span>
              </a>
            </li>
          )}
        </>
      )}
      {/* <!-- Divider --> */}
      <hr className="sidebar-divider" />

      {/* <!-- Heading --> */}
      {/* <!-- Nav Item - Pages Collapse Menu --> */}
      {Token.uid == 5 && (
        <>
          <div className="sidebar-heading">Addons</div>
          <li className={`nav-item`}>
            <a
              className={`nav-link ${!t1 && "collapsed"}`}
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
