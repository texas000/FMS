import { Dialog } from "@blueprintjs/core";
import router from "next/router";
import { Fragment, useState } from "react";
import { Spinner } from "reactstrap";
import useSWR from "swr";
import usdFormat from "../../lib/currencyFormat";

export default function CompanyBalance({ balance, pendingSum, id }) {
  const [selectedTerm, setSelectedTerm] = useState(false);
  const { data } = useSWR(
    selectedTerm
      ? `/api/company/invoiceByTerms?term=${selectedTerm.term}&bill=${id}`
      : null
  );
  function handleInvoiceClick(inv) {
    switch (inv.F_TBName) {
      case "T_INVOHD":
        router.push(`/invoice/${inv.F_ID}`);
        break;
      case "T_APHD":
        router.push(`/ap/${inv.F_ID}`);
        break;
      case "T_CRDBHD":
        router.push(`/crdr/${inv.F_ID}`);
        break;
      default:
        alert(inv.F_TBName);
    }
  }
  return (
    <div className="card col-span-2 md:col-span-2 lg:col-span-1 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
            >
              Balance
            </th>
            <th className="px-6 py-1 font-bold uppercase tracking-wider text-right">
              {balance && usdFormat(balance[0].F_Balance)}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
          {balance &&
            balance.map((ga) => (
              <Fragment key={ga.f_id}>
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap font-semibold">
                    AR BALANCE
                  </td>
                  <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                    {usdFormat(ga.F_AR)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap font-semibold">
                    AP BALANCE
                  </td>
                  <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                    {usdFormat(ga.F_AP)}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-2 whitespace-nowrap font-semibold">
                    CREDIT BALANCE
                  </td>
                  <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                    {usdFormat(ga.F_CrDr)}
                  </td>
                </tr>
              </Fragment>
            ))}
          {pendingSum && (
            <Fragment>
              <tr
                className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                onClick={() =>
                  setSelectedTerm({
                    term: 1,
                    value: pendingSum.term1,
                    title: "Current",
                  })
                }
              >
                <td className="px-6 py-2 whitespace-nowrap uppercase">
                  CURRENT
                </td>
                <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                  {usdFormat(pendingSum.term1)}
                </td>
              </tr>
              <tr
                className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                onClick={() =>
                  setSelectedTerm({
                    term: 2,
                    value: pendingSum.term2,
                    title: "Over 1-30 Days",
                  })
                }
              >
                <td className="px-6 py-2 whitespace-nowrap uppercase">
                  Over 1-30 Days
                </td>
                <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                  {usdFormat(pendingSum.term2)}
                </td>
              </tr>
              <tr
                className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                onClick={() =>
                  setSelectedTerm({
                    term: 3,
                    value: pendingSum.term3,
                    title: "Over 31-60 Days",
                  })
                }
              >
                <td className="px-6 py-2 whitespace-nowrap uppercase">
                  Over 31-60 Days
                </td>
                <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                  {usdFormat(pendingSum.term3)}
                </td>
              </tr>
              <tr
                className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                onClick={() =>
                  setSelectedTerm({
                    term: 4,
                    value: pendingSum.term4,
                    title: "Over 61-90 Days",
                  })
                }
              >
                <td className="px-6 py-2 whitespace-nowrap uppercase">
                  Over 61-90 Days
                </td>
                <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                  {usdFormat(pendingSum.term4)}
                </td>
              </tr>
              <tr
                className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                onClick={() =>
                  setSelectedTerm({
                    term: 5,
                    value: pendingSum.term5,
                    title: "Over 90 Days",
                  })
                }
              >
                <td className="px-6 py-2 whitespace-nowrap uppercase">
                  Over 90 Days
                </td>
                <td className="px-6 py-2 text-right whitespace-nowrap truncate max-w-sm">
                  {usdFormat(pendingSum.term5)}
                </td>
              </tr>
            </Fragment>
          )}
        </tbody>
      </table>
      <Dialog
        isOpen={selectedTerm}
        onClose={() => setSelectedTerm(false)}
        className="pb-0"
      >
        <div className="card overflow-hidden">
          <div className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider bg-gray-100 flex justify-between">
            <h1>{selectedTerm.title}</h1>
            <span>{usdFormat(selectedTerm.value)}</span>
          </div>
          {data ? (
            <ul className="divide-y divide-gray-300">
              {/* {JSON.stringify(data)} */}
              {data.map((ga) => (
                <Fragment>
                  <li
                    className="px-6 text-xs py-2 tracking-wider flex justify-between hover:bg-indigo-500 hover:text-white"
                    onClick={() => handleInvoiceClick(ga)}
                  >
                    <div>{ga.F_InvoiceNo}</div>
                    <div>{ga.PIC}</div>
                    <div>{usdFormat(ga.F_InvoiceAmt)}</div>
                  </li>
                </Fragment>
              ))}
            </ul>
          ) : (
            <Spinner />
          )}
        </div>
      </Dialog>
    </div>
  );
}
