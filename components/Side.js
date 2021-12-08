import { useRouter } from "next/router";
import { useState } from "react";
const Sidebar = ({ Token, toggle, setLoading }) => {
  const router = useRouter();

  const [t2, setT2] = useState(false);
  return (
    <ul
      className={`navbar-nav bg-gradient-to-b from-blue-600 to-blue-500 dark:from-blue-900 dark:to-indigo-900 sidebar sidebar-dark accordion d-print-none ${
        toggle && "toggled"
      }`}
    >
      {/* <!-- JW LOGO --> */}
      <a
        onClick={() => {
          if (router.asPath != "/") {
            setLoading(true);
          }
          router.push("/");
        }}
      >
        <img
          src="/favicon/apple-touch-icon.png"
          className="rounded-full w-9 h-9 mx-auto my-3"
        />
      </a>

      {/* Divider */}
      <hr className="border-t border-blue-500 mx-3 my-1" />

      {/* <!-- Nav Item --> */}
      <div className="my-3 flex flex-column gap-6">
        {/* DASHBOARD */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.asPath == "/"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/") {
              setLoading(true);
            }
            router.push("/");
          }}
        >
          <i className="fa fa-clipboard mx-auto"></i>
          <span className="mx-auto overflow-hidden">Dashboard</span>
        </li>
        {/* REQUEST */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.asPath == "/request"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/request") {
              setLoading(true);
            }
            router.push("/request");
          }}
        >
          <i className="fa fa-thumbs-up mx-auto"></i>
          <span className="mx-auto overflow-hidden">Request</span>
        </li>
        {/* OIM */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.pathname.substring(1, 15) == "forwarding/oim"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/forwarding/oim") {
              setLoading(true);
            }
            router.push("/forwarding/oim");
          }}
        >
          <i className="fa fa-anchor mx-auto"></i>
          <span className="mx-auto overflow-hidden">Ocean Import</span>
        </li>
        {/* OEX */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.pathname.substring(1, 15) == "forwarding/oex"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/forwarding/oex") {
              setLoading(true);
            }
            router.push("/forwarding/oex");
          }}
        >
          <i className="fa fa-anchor fa-flip-vertical mx-auto"></i>
          <span className="mx-auto overflow-hidden">Ocean Export</span>
        </li>
        {/* AIM */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.pathname.substring(1, 15) == "forwarding/aim"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/forwarding/aim") {
              setLoading(true);
            }
            router.push("/forwarding/aim");
          }}
        >
          <i className="fa fa-anchor plane mx-auto"></i>
          <span className="mx-auto overflow-hidden">Air Import</span>
        </li>
        {/* AEX */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.pathname.substring(1, 15) == "forwarding/aex"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/forwarding/aex") {
              setLoading(true);
            }
            router.push("/forwarding/aex");
          }}
        >
          <i className="fa fa-anchor plane fa-flip-vertical mx-auto"></i>
          <span className="mx-auto overflow-hidden">Air Export</span>
        </li>
        {/* OTHER */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.pathname.substring(1, 15) == "forwarding/oth"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/forwarding/other") {
              setLoading(true);
            }
            router.push("/forwarding/other");
          }}
        >
          <i className="fa fa-link mx-auto"></i>
          <span className="mx-auto overflow-hidden">Other</span>
        </li>
        {/* BOARD */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.pathname.substring(1, 6) == "board"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/board") {
              setLoading(true);
            }
            router.push("/board");
          }}
        >
          <i className="fa fa-bullhorn mx-auto"></i>
          <span className="mx-auto overflow-hidden">Board</span>
        </li>
        {/* CHAT */}
        <li
          className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
            router.pathname.substring(1, 5) == "chat"
              ? "text-white opacity-100 font-bold"
              : "text-gray-200 opacity-75"
          }`}
          onClick={() => {
            if (router.asPath != "/chat") {
              setLoading(true);
            }
            router.push("/chat");
          }}
        >
          <i className="fa fa-comment mx-auto"></i>
          <span className="mx-auto overflow-hidden">Chat</span>
        </li>
        {/* AUTH HIGHER THAN OPERATOR */}
        {Token.admin > 4 && (
          <>
            {/* TRUCKING */}
            <li
              className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
                router.pathname == "/forwarding/trucking"
                  ? "text-white opacity-100 font-bold"
                  : "text-gray-200 opacity-75"
              }`}
              onClick={() => {
                if (router.asPath != "/forwarding/trucking") {
                  setLoading(true);
                }
                router.push("/forwarding/trucking");
              }}
            >
              <i className="fa fa-truck mx-auto"></i>
              <span className="mx-auto overflow-hidden">Trucking</span>
            </li>
            {/* ANALYSIS */}
            <li
              className={`nav-item flex flex-column cursor-pointer hover:text-white hover:opacity-100 ${
                router.pathname.substring(1, 10) == "statistic" && "active"
              }`}
            >
              <a
                className={`nav-link hover:no-underline text-xs m-0 p-0 ${
                  !t2 && "collapsed"
                }`}
                onClick={() => setT2(!t2)}
                data-toggle="collapse"
                data-target="#collapsePages"
                aria-expanded={`${t2 ? "true" : "false"}`}
                aria-controls="collapsePages"
              >
                <i className="fa fa-bar-chart mx-auto"></i>
                <span className="mx-auto mt-2 overflow-hidden">Analysis</span>
              </a>
              <div className={`collapse ${t2 && "show"}`}>
                <div className="bg-white py-2 collapse-inner rounded">
                  <h6 className="collapse-header">Analysis</h6>
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
            <li
              className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
                router.pathname == "/hr"
                  ? "text-white opacity-100 font-bold"
                  : "text-gray-200 opacity-75"
              }`}
              onClick={() => {
                if (router.asPath != "/hr") {
                  setLoading(true);
                }
                router.push("/hr");
              }}
            >
              <i className="fa fa-users mx-auto"></i>
              <span className="mx-auto overflow-hidden">HR</span>
            </li>
            {/* MANAGE */}
            <li
              className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
                router.pathname == "/manage"
                  ? "text-white opacity-100 font-bold"
                  : "text-gray-200 opacity-75"
              }`}
              onClick={() => {
                if (router.asPath != "/manage") {
                  setLoading(true);
                }
                router.push("/manage");
              }}
            >
              <i className="fa fa-tasks mx-auto"></i>
              <span className="mx-auto overflow-hidden">Manage</span>
            </li>
          </>
        )}
        {/* AUTH HIGHER THAN DIRECTOR */}
        {Token.admin > 6 && (
          <li
            className={`flex flex-column gap-2 text-xs cursor-pointer hover:text-white hover:opacity-100 ${
              router.pathname == "/accounting"
                ? "text-white opacity-100 font-bold"
                : "text-gray-200 opacity-75"
            }`}
            onClick={() => {
              if (router.asPath != "/accounting") {
                setLoading(true);
              }
              router.push("/accounting");
            }}
          >
            <i className="fa fa-dollar mx-auto"></i>
            <span className="mx-auto overflow-hidden">Accounting</span>
          </li>
        )}
      </div>

      {/* <!-- Divider --> */}
      {/* <hr className="border-t border-blue-500 mx-3 my-1" /> */}
    </ul>
  );
};

export default Sidebar;
