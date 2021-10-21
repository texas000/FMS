import { useRouter } from "next/router";
import { useState } from "react";
const Sidebar = ({ Token, toggle, setToggle, setLoading }) => {
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

      <a
        className="h-16 d-flex align-items-center justify-content-center"
        onClick={() => {
          if (router.asPath != "/dashboard") {
            setLoading(true);
          }
          router.push("/dashboard");
        }}
      >
        <div>
          <img
            src="/favicon/apple-touch-icon.png"
            className="avatar rounded-full w-9 h-9"
          />
        </div>
      </a>

      {/* Divider */}
      <hr className="border-t border-blue-500 mx-3 my-1" />

      {/* <!-- Nav Item --> */}
      <li
        className={`nav-item ${
          router.asPath == "/dashboard" ? "active" : "inactive"
        }`}
      >
        <a
          className="nav-link hover:no-underline"
          onClick={() => {
            if (router.asPath != "/dashboard") {
              setLoading(true);
            }
            router.push("/dashboard");
          }}
        >
          <i className="fa fa-clipboard"></i>
          <span className="font-light overflow-hidden">Dashboard</span>
        </a>
      </li>

      {/* <!-- Divider --> */}
      <hr className="border-t border-blue-500 mx-3 my-1" />

      {/* <!-- Heading --> */}
      <div className="sidebar-heading">FMS</div>

      {/* Forwarding */}

      <li
        className={`nav-item ${
          router.asPath == "/request" ? "active" : "inactive"
        }`}
      >
        <a
          className="nav-link hover:no-underline"
          onClick={() => {
            if (router.asPath != "/request") {
              setLoading(true);
            }
            router.push("/request");
          }}
        >
          <i className="fa fa-thumbs-up"></i>
          <span>Request</span>
        </a>
      </li>

      <li
        className={`nav-item ${
          router.pathname.substring(1, 15) == "forwarding/oim" && "active"
        }`}
      >
        <a
          className="nav-link hover:no-underline"
          onClick={() => {
            if (router.asPath != "/forwarding/oim") {
              setLoading(true);
            }
            router.push("/forwarding/oim");
          }}
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
          className="nav-link hover:no-underline"
          onClick={() => {
            if (router.asPath != "/forwarding/oex") {
              setLoading(true);
            }
            router.push("/forwarding/oex");
          }}
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
          className="nav-link hover:no-underline"
          onClick={() => {
            if (router.asPath != "/forwarding/aim") {
              setLoading(true);
            }
            router.push("/forwarding/aim");
          }}
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
          className="nav-link hover:no-underline"
          onClick={() => {
            if (router.asPath != "/forwarding/aex") {
              setLoading(true);
            }
            router.push("/forwarding/aex");
          }}
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
          className="nav-link hover:no-underline"
          onClick={() => {
            if (router.asPath != "/forwarding/other") {
              setLoading(true);
            }
            router.push("/forwarding/other");
          }}
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
            className="nav-link hover:no-underline"
            onClick={() => {
              if (router.asPath != "/forwarding/trucking") {
                setLoading(true);
              }
              router.push("/forwarding/trucking");
            }}
          >
            <i className="fa fa-truck"></i>
            <span>Trucking</span>
          </a>
        </li>
      )}

      {/* Board */}

      <li
        className={`nav-item ${
          router.pathname.substring(1, 6) == "board" && "active"
        }`}
      >
        <a
          className="nav-link hover:no-underline"
          onClick={() => {
            if (router.asPath != "/board") {
              setLoading(true);
            }
            router.push("/board");
          }}
        >
          <i className="fa fa-pencil"></i>
          <span>Board</span>
        </a>
      </li>

      {Token.admin > 5 && (
        <li className={`nav-item ${router.asPath == "/manage" && "active"}`}>
          <a
            className="nav-link hover:no-underline"
            onClick={() => {
              if (router.asPath != "/manage") {
                setLoading(true);
              }
              router.push("/manage");
            }}
          >
            <i className="fa fa-tasks"></i>
            <span>Manage</span>
          </a>
        </li>
      )}

      {Token.admin > 6 && (
        <li
          className={`nav-item ${
            router.pathname.substring(1, 11) == "accounting" && "active"
          }`}
        >
          <a
            className="nav-link hover:no-underline"
            onClick={() => {
              if (router.asPath != "/accounting") {
                setLoading(true);
              }
              router.push("/accounting");
            }}
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

                <a
                  className="collapse-item"
                  onClick={() => {
                    if (router.asPath != "/statistic/custom") {
                      setLoading(true);
                    }
                    router.push("/statistic/custom");
                  }}
                >
                  Custom
                </a>

                <a
                  className="collapse-item"
                  onClick={() => {
                    if (router.asPath != "/statistic/house") {
                      setLoading(true);
                    }
                    router.push("/statistic/house");
                  }}
                >
                  House
                </a>

                <a
                  className="collapse-item"
                  onClick={() => {
                    if (router.asPath != "/statistic/container") {
                      setLoading(true);
                    }
                    router.push("/statistic/container");
                  }}
                >
                  Container
                </a>
              </div>
            </div>
          </li>
          {Token.admin > 5 && (
            <li className={`nav-item ${router.pathname == "/hr" && "active"}`}>
              <a
                className="nav-link hover:no-underline"
                onClick={() => {
                  if (router.asPath != "/hr") {
                    setLoading(true);
                  }
                  router.push("/hr");
                }}
              >
                <i className="fa fa-user"></i>
                <span>Human Resource</span>
              </a>
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
