import moment from "moment";
import { useState } from "react";
import useSWR from "swr";

export default function FreightDetailDialog({ house, container }) {
  return (
    <>
      {house.map((ga, i) => (
        <div className="card overflow-hidden mb-2" key={`${i}-house`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                >
                  HBL
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                >
                  {ga.F_HBLNo || ga.F_HawbNo || ga.F_HAWBNo}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">CUSTOMER</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.CUSTOMER}
                </td>
              </tr>
              {ga.BROKER && (
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap">BROKER</td>
                  <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                    {ga.BROKER}
                  </td>
                </tr>
              )}
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">SHIPPER</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.SHIPPER}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">CONSIGNEE</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.CONSIGNEE}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">NOTIFY</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.NOTIFY}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">COMMODITY</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.F_Commodity}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">PACKAGE</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.F_PKGS || ga.F_Pkgs} {ga.F_Punit || ga.F_PUnit}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      {/* {JSON.stringify(house)} */}
      {container.map((ga, i) => (
        <div className="card overflow-hidden mb-2" key={`${i}-container`}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase text-indigo-500 tracking-wider cursor-pointer"
                  onClick={() =>
                    window.open(
                      `https://www.searates.com/container/tracking/?container=${ga.F_ContainerNo}`,
                      "_blank"
                    )
                  }
                >
                  {ga.F_ContainerNo}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                >
                  {ga.F_ConType}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
              <tr>
                <td className="px-6 py-2 whitespace-nowrap">{ga.F_SealNo}</td>
                <td className="px-6 py-2 whitespace-nowrap truncate max-w-sm">
                  {ga.F_PKGS || ga.F_Pkgs} PACKAGE
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
      {/* <div className="card">{JSON.stringify(container)}</div> */}
    </>
  );
}
