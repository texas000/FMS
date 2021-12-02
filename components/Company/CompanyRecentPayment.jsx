import moment from "moment";

export default function CompanyRecentPayment({ depo }) {
  return (
    <div className="card col-span-2 md:col-span-2 lg:col-span-1 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              colSpan="3"
              className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
            >
              Recent Payment History
            </th>
          </tr>
        </thead>
        <tbody className="h-100 bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
          {depo &&
            depo.map((ga, i) => (
              <tr key={`${i}-depo`}>
                <td className="py-1 whitespace-nowrap pl-6">
                  {ga.F_Type == "C"
                    ? `Payment Sent by ${ga.F_CheckNo} at 
                          ${moment(ga.F_PostDate).utc().format("l")}`
                    : `Payment Recevied by ${ga.F_CheckNo} at ${moment(
                        ga.F_PostDate
                      )
                        .utc()
                        .format("l")}`}
                </td>
                <td className="py-1 whitespace-nowrap text-right pr-6">
                  {moment(ga.F_U1Date, "YYYY-MM-DD HH:mm:ss").fromNow()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
