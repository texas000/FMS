import { Fragment } from "react";
import usdFormat from "../../lib/currencyFormat";

export default function FreightPayment({
  Invoice,
  CrDr,
  Ap,
  setSelectedPayment,
  apRequested,
}) {
  return (
    <Fragment>
      <div className="card overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="border-b border-gray-200">
              <th
                scope="col"
                className="px-6 py-3 text-left font-bold uppercase tracking-wider"
              >
                INVOICE
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
              >
                {/* <span className="bg-indigo-300 text-indigo-600 rounded-xl p-2">
                          PAID
                        </span> */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs dark:text-white">
            {Invoice.map((ga) => (
              <tr
                key={ga.F_ID}
                onClick={() => setSelectedPayment({ ...ga, type: 10 })}
                className="hover:bg-indigo-500 hover:text-white cursor-pointer"
              >
                <td className="px-6 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{ga.F_InvoiceNo}</span>
                    <span className="truncate max-w-sm">{ga.BILLTO}</span>
                  </div>
                </td>
                <td
                  className={`px-6 py-2 text-right whitespace-nowrap ${
                    ga.F_PaidAmt ? "line-through" : "font-bold"
                  }`}
                >
                  {usdFormat(ga.F_InvoiceAmt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex bg-gray-50 dark:bg-gray-800 justify-between px-4 py-2 border-t border-gray-200 mt-auto">
          <div className="flex flex-col">
            <span className="text-gray-300 text-xs">number of invoice</span>
            <span className="text-xl font-bold">{Invoice.length}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-300 text-xs">invoice total</span>
            <span className="text-xl font-bold">
              {usdFormat(
                Invoice.reduce((sum, item) => {
                  return (sum = sum + item.F_InvoiceAmt || 0);
                }, 0)
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="card overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="border-b border-gray-200">
              <th
                scope="col"
                className="px-6 py-3 text-left font-bold uppercase tracking-wider"
              >
                CRDR
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
              >
                {/* <span className="bg-indigo-300 text-indigo-600 rounded-xl p-2">
                          PAID
                        </span> */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs dark:text-white">
            {CrDr.map((ga) => (
              <tr
                key={ga.F_ID}
                onClick={() => setSelectedPayment({ ...ga, type: 20 })}
                className="hover:bg-indigo-500 hover:text-white cursor-pointer"
              >
                <td className="px-6 py-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{ga.F_CrDbNo}</span>
                    <span>{ga.AGENT}</span>
                  </div>
                </td>
                <td
                  className={`px-6 py-2 text-right whitespace-nowrap ${
                    ga.F_PaidAmt ? "line-through" : "font-bold"
                  }`}
                >
                  {usdFormat(ga.F_Total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex bg-gray-50 dark:bg-gray-800 justify-between px-4 py-2 border-t border-gray-200 mt-auto">
          <div className="flex flex-col">
            <span className="text-gray-300 text-xs">
              number of credit debit
            </span>
            <span className="text-xl font-bold">{CrDr.length}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-300 text-xs">credit debit total</span>
            <span className="text-xl font-bold">
              {usdFormat(
                CrDr.reduce((sum, item) => {
                  return (sum = sum + item.F_Total || 0);
                }, 0)
              )}
            </span>
          </div>
        </div>
      </div>
      <div className="card overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="border-b border-gray-200">
              <th
                scope="col"
                className="px-6 py-3 text-left font-bold uppercase tracking-wider"
              >
                ACCOUNT PAYABLE
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
              >
                {/* <span className="bg-indigo-300 text-indigo-600 rounded-xl p-2">
                          PAID
                        </span> */}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs dark:text-white">
            {Ap.map((ga) => (
              <tr
                key={ga.F_ID}
                onClick={() => setSelectedPayment({ ...ga, type: 30 })}
                className="hover:bg-indigo-500 hover:text-white cursor-pointer w-100"
              >
                <td className="px-6 py-2">
                  <div className="flex flex-col">
                    <div className="flex flex-row items-center">
                      <span className="text-sm font-bold">
                        {ga.F_InvoiceNo}
                      </span>
                      {apRequested.filter(
                        (ref) => ref.INVOICE == ga.F_InvoiceNo
                      ).length ? (
                        <svg
                          className="fill-current text-green-500 ml-2"
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597z" />
                        </svg>
                      ) : (
                        <span></span>
                      )}
                    </div>
                    <span>{ga.VENDOR}</span>
                  </div>
                </td>
                <td
                  className={`px-6 py-2 text-right whitespace-nowrap ${
                    ga.F_PaidAmt ? "line-through" : "font-bold"
                  }`}
                >
                  {usdFormat(ga.F_InvoiceAmt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex bg-gray-50 dark:bg-gray-800 justify-between px-4 py-2 border-t border-gray-200 mt-auto">
          <div className="flex flex-col">
            <span className="text-gray-300 text-xs">
              number of account payable
            </span>
            <span className="text-xl font-bold">{Ap.length}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-gray-300 text-xs">account payable total</span>
            <span className="text-xl font-bold">
              {usdFormat(
                Ap.reduce((sum, item) => {
                  return (sum = sum + item.F_InvoiceAmt || 0);
                }, 0)
              )}
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
