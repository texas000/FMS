import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
// import Select from "react-select";
import AsyncSelect from "react-select/async";
import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import router from "next/router";
import moment from "moment";
import { Drawer, Classes } from "@blueprintjs/core";

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    return {
      props: {
        token: token,
        word: query.q || null,
      },
    };
  } catch (err) {
    return {
      props: { token: false },
    };
  }
}

export default function search(props) {
  const { data: companyList } = useSWR("/api/manage/getAssignedCompany");
  const [selectedCompany, setSelectedCompany] = useState(false);
  const { data: companyContacts } = useSWR(
    selectedCompany
      ? `/api/manage/getCompanyContacts?company=${selectedCompany.COMPANY_ID}`
      : null
  );
  return (
    <Layout TOKEN={props.token} TITLE="Manage" LOADING={!companyList}>
      <div className="flex flex-sm-row justify-between">
        <h3 className="dark:text-white mb-3">Manage</h3>
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        <div className="card p-3">
          <h4 className="m-3 font-bold">JW Account Person In Charge Summary</h4>
          <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    PIC
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {companyList &&
                  companyList.map((com, i) => (
                    <tr
                      key={i}
                      onClick={() => setSelectedCompany(com)}
                      className="cursor-pointer hover:bg-indigo-500 hover:text-white"
                    >
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="flex items-center text-xs">
                          {com.PIC}
                        </div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        <div className="text-xs">{com.COMPANY_NAME}</div>
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap text-xs">
                        {moment(com.UPDATED).utc().format("LLL")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Drawer
        isOpen={selectedCompany}
        onClose={() => setSelectedCompany(false)}
        icon="info-sign"
        title={selectedCompany.COMPANY_NAME}
      >
        <div className={Classes.DRAWER_BODY}>
          <div className={Classes.DIALOG_BODY}>
            <div className="card p-2">
              {companyContacts && companyContacts.length ? (
                companyContacts.map((ga, i) => (
                  <dl
                    key={i}
                    className="p-2 rounded text-gray-800 overflow-hidden hover:text-white hover:bg-indigo-500 cursor-pointer"
                    onClick={() =>
                      window.open(`mailto:"${ga.NAME}" <${ga.EMAIL}>`, "_blank")
                    }
                  >
                    <dt className="font-medium">{ga.NAME}</dt>
                    <dd className="sm:mt-0 sm:col-span-2">{ga.EMAIL}</dd>
                  </dl>
                ))
              ) : (
                <dl className="p-2 rounded text-gray-800 font-bold">
                  No Contact Found
                </dl>
              )}
            </div>
          </div>
        </div>
      </Drawer>
    </Layout>
  );
}
