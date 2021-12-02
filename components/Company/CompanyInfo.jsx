import { Fragment } from "react";

export default function CompanyInfo({ data }) {
  return (
    <Fragment>
      <div className="card sm:col-span-2 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                colSpan="2"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
              >
                Information
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
            <tr>
              <td className="px-6 py-2 whitespace-nowrap">Address</td>
              <td className="px-6 py-2 whitespace-nowrap">
                <span>{data.F_Addr}</span> <span>{data.F_City}</span>{" "}
                <span>{data.F_State}</span> <span>{data.F_ZipCode}</span>{" "}
                <span>{data.F_Country}</span>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-2 whitespace-nowrap">Tax Info</td>
              <td className="px-6 py-2 whitespace-nowrap">
                {`${data.F_IRSNo} ${data.F_IRSType}`}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-2 whitespace-nowrap">Created</td>
              <td className="px-6 py-2 whitespace-nowrap">
                Created by <span className="uppercase">{data.F_U1ID}</span> at{" "}
                {new Date(data.F_U1Date).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-2 whitespace-nowrap">Updated</td>
              <td className="px-6 py-2 whitespace-nowrap">
                Updated by <span className="uppercase">{data.F_U2ID}</span> at{" "}
                {new Date(data.F_U2Date).toLocaleDateString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card w-100 overflow-hidden">
        <iframe
          className="min-w-full h-100"
          loading="lazy"
          allowFullScreen
          src={`https://www.google.com/maps/embed/v1/search?q=${encodeURIComponent(
            `${data.F_Addr ? data.F_Addr + "+" : ""}
                ${data.F_City ? data.F_City + "+" : ""}
                ${data.F_State ? data.F_State + "+" : ""}
                ${data.F_ZipCode ? data.F_ZipCode + "+" : ""}
                ${data.F_Country}
              `
          )}&key=AIzaSyDti1yLvLp4RYMBR2hHBDk7jltZU44xJqc`}
        ></iframe>
      </div>
    </Fragment>
  );
}
