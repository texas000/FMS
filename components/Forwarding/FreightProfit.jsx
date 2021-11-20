import { Fragment, useState } from "react";
import usdFormat from "../../lib/currencyFormat";
import { HorizontalBar } from "react-chartjs-2";

export default function FreightProfit({ Profit, Invoice, CrDr, Ap }) {
  return (
    <Fragment>
      <div className="card overflow-hidden">
        <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2">
          PROFIT
        </div>
        <div className="flex items-center justify-between h-100 p-2">
          <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg w-1/2">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left font-bold uppercase tracking-wider"
                  >
                    TOTAL
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
                  >
                    {usdFormat(
                      Profit.reduce((sum, item) => {
                        return (sum = sum + item.F_HouseTotal || 0);
                      }, 0)
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs dark:text-white">
                <tr className="hover:bg-indigo-500 hover:text-white cursor-pointer w-100">
                  <td className="px-6 py-2">
                    <div className="flex flex-col">INVOICE</div>
                  </td>
                  <td className="px-6 py-2 text-right whitespace-nowrap">
                    {usdFormat(
                      Profit.reduce((sum, item) => {
                        return (sum = sum + item.F_AR || 0);
                      }, 0)
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-indigo-500 hover:text-white cursor-pointer w-100">
                  <td className="px-6 py-2">
                    <div className="flex flex-col">CRDR</div>
                  </td>
                  <td className="px-6 py-2 text-right whitespace-nowrap">
                    {usdFormat(
                      Profit.reduce((sum, item) => {
                        return (sum = sum + item.F_CrDr || 0);
                      }, 0)
                    )}
                  </td>
                </tr>
                <tr className="hover:bg-indigo-500 hover:text-white cursor-pointer w-100">
                  <td className="px-6 py-2">
                    <div className="flex flex-col">AP</div>
                  </td>
                  <td className="px-6 py-2 text-right whitespace-nowrap">
                    {usdFormat(
                      Profit.reduce((sum, item) => {
                        return (sum = sum + item.F_AP || 0);
                      }, 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center">
            <HorizontalBar
              data={{
                labels: ["INVOICE", "CRDR", "AP"],
                datasets: [
                  {
                    label: "Amount",
                    data: [
                      Invoice.reduce((sum, item) => {
                        return (sum = sum + item.F_InvoiceAmt || 0);
                      }, 0),
                      CrDr.reduce((sum, item) => {
                        return (sum = sum + item.F_Total || 0);
                      }, 0),
                      Ap.reduce((sum, item) => {
                        return (sum = sum + item.F_InvoiceAmt || 0);
                      }, 0),
                    ],
                    backgroundColor: ["#059669", "#10B981", "#FBBF24"],
                    hoverOffset: 4,
                  },
                ],
              }}
              options={{
                legend: {
                  display: false,
                },
              }}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
