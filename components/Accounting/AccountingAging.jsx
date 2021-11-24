import moment from "moment";
import usdFormat from "../../lib/currencyFormat";

export default function AccountingAging({ aging }) {
  if (aging) {
    return (
      <div className="card my-4 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100 dark:bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider"
              >
                Pending Amount
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-xs font-bold uppercase tracking-wider"
              >
                Collect Rate
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
              >
                The Oldest Due
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
            {aging &&
              aging.map((ga, i) => (
                <tr
                  key={`${i}-aging`}
                  className="hover:bg-indigo-500 hover:text-white cursor-pointer"
                  onClick={() =>
                    window.open(
                      `/company/${ga.F_BillTo}`,
                      "_blank",
                      "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=700,height=1000"
                    )
                  }
                >
                  <td className="pl-6 py-1 whitespace-nowrap">
                    {ga.CompanyName}
                  </td>
                  <td className="text-right pr-4 py-1">
                    {usdFormat(ga.Pending)}
                  </td>
                  <td
                    className={`text-left pl-4 font-bold py-1 whitespace-nowrap ${
                      ga.Pending / ga.Summary < 0.1
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  >
                    {parseFloat((ga.Pending / ga.Summary) * 100).toFixed(1)}%
                  </td>
                  <td>{moment(ga.Due).utc().fromNow()}</td>
                </tr>
              ))}
            {/* ga.Summary */}
            {/* {JSON.stringify(ga)} */}
          </tbody>
        </table>

        {/* {JSON.stringify(aging)} */}
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
}
