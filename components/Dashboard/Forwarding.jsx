import moment from "moment";
import router from "next/router";
import { Fragment } from "react";

export default function Forwarding({ data, title, path, loading }) {
  if (loading) {
    if (data.length) {
      return (
        <div className="card h-80 max-h-80 overflow-auto">
          <div className="p-3 flex justify-between">
            <div>
              <h3 className="text-base leading-6 dark:text-white">{title}</h3>
              <p className="text-xs">Total of {data.length}</p>
            </div>
          </div>
          <div className="border-t border-gray-200">
            {data.map((ga, i) => (
              <dl
                className={`${
                  i % 2
                    ? "bg-gray-200 dark:bg-gray-800"
                    : "bg-gray-50 dark:bg-gray-500"
                } p-2 text-xs text-gray-800 dark:text-white hover:text-white hover:bg-indigo-500 group`}
                key={i + "oim"}
              >
                <a
                  className="flex justify-between hover:text-white"
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    router.push(`/forwarding/${path}/${ga.F_RefNo}`);
                  }}
                >
                  <dt className="w-1/4 truncate font-semibold">{ga.F_RefNo}</dt>
                  <dd className="w-1/2 truncate">
                    {ga.Customer || "NO CUSTOMER"}
                  </dd>
                  <dd
                    className={`font-weight-bold ${
                      moment()
                        .startOf("day")
                        .diff(moment(new Date(ga.F_ETA)).utc(), "days") < 0
                        ? "text-danger"
                        : "text-primary"
                    }`}
                  >
                    {moment(ga.F_ETA)
                      .utc()
                      .add(1, "days")
                      .startOf("day")
                      .diff(new Date().toDateString(), "days")}
                  </dd>
                </a>
              </dl>
            ))}
          </div>
        </div>
      );
    } else {
      return <></>;
    }
  } else {
    return (
      <div className="border border-blue-300 shadow rounded-md p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-400 rounded w-3/4"></div>
            <div className="space-y-2 mt-5">
              <div className="h-4 bg-gray-400 rounded"></div>
              <div className="h-4 bg-gray-400 rounded"></div>
              <div className="h-4 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
