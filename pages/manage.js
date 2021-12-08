import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import BootstrapTable from "react-bootstrap-table-next";
import useSWR from "swr";
import { useState } from "react";
import moment from "moment";
import { Drawer, Classes } from "@blueprintjs/core";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import Notification from "../components/Toaster";

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
  const { data: companyList, mutate: updateCompanyList } = useSWR(
    "/api/manage/getAssignedCompany"
  );
  const { data: activeUsers } = useSWR("/api/dashboard/contacts");
  const [selectedCompany, setSelectedCompany] = useState(false);
  const [selectedNewCompany, setSelectedNewCompany] = useState(false);
  const [msg, setMsg] = useState(false);
  const [show, setShow] = useState(false);
  const { data: companyContacts, mutate: updateContacts } = useSWR(
    selectedCompany
      ? `/api/manage/getCompanyContacts?company=${selectedCompany.COMPANY_ID}`
      : null
  );
  const { data: companyDetail } = useSWR(
    selectedCompany
      ? `/api/company/detail?q=${selectedCompany.COMPANY_ID}`
      : null
  );

  // HEADER STYLE FLEX COLUMN
  function filterHeader(column, colIndex, { sortElement, filterElement }) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {column.text}
        {filterElement}
      </div>
    );
  }

  const columns = [
    {
      dataField: "PIC",
      text: "PIC",
      align: "left",
      headerAlign: "left",
      sort: true,
      classes: "py-2",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "COMPANY_NAME",
      text: "CUSTOMER",
      align: "left",
      headerAlign: "left",
      sort: true,
      classes: "py-2",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
    {
      dataField: "UPDATED",
      text: "UPDATED",
      align: "center",
      headerAlign: "center",
      sort: true,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).utc().format("MM-DD-YYYY");
        }
      },
      classes: "py-2",
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
    },
  ];
  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      setSelectedCompany(row);
    },
  };
  async function handlePicChange(e) {
    e.preventDefault();
    await fetch(
      `/api/manage/updateAssignedCompany?uid=${e.target.value}&company=${selectedCompany.COMPANY_ID}&puid=${selectedCompany.USER_ID}`
    )
      .then(async (ga) => {
        const res = await ga.json();

        setMsg(res.msg);
        setShow(true);
        updateCompanyList();
      })
      .catch((err) => {
        setMsg(JSON.stringify(err));
        setShow(true);
      });
  }
  async function handleAddEmail(e) {
    e.preventDefault();
    await fetch(
      `/api/company/addCompanyContact?id=${selectedCompany.COMPANY_ID}&email=${e.target[0].value}&name=${e.target[1].value}`
    )
      .then(async (ga) => {
        const res = await ga.json();
        setMsg(res.msg);
        setShow(true);
        updateContacts();
      })
      .catch((err) => {
        setMsg(JSON.stringify(err));
        setShow(true);
      });
  }
  async function handleRemoveContact(mail) {
    await fetch(
      `/api/company/removeCompanyContact?id=${selectedCompany.COMPANY_ID}&email=${mail}`
    )
      .then(async (ga) => {
        const res = await ga.json();
        setMsg(res.msg);
        setShow(true);
        updateContacts();
      })
      .catch((err) => {
        setMsg(JSON.stringify(err));
        setShow(true);
      });
  }
  return (
    <Layout TOKEN={props.token} TITLE="Manage" LOADING={!companyList}>
      <div className="flex flex-sm-row justify-between">
        <h3 className="dark:text-white mb-3">Manage</h3>
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        <div className="card p-3">
          <h4 className="m-3 font-bold">Person In Charge</h4>
          <div className="shadow overflow-auto border-b border-gray-200 sm:rounded-lg">
            <BootstrapTable
              keyField="F_ID"
              data={companyList ? companyList : []}
              columns={columns}
              rowEvents={rowEvents}
              headerClasses="dark:text-white bg-gray-50 text-xs text-gray-500 font-medium uppercase tracking-wider"
              rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer border-b border-gray-200 dark:bg-gray-700 dark:text-white"
              wrapperClasses="table-responsive text-xs"
              bordered={false}
              filter={filterFactory()}
            />
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
              <div className="p-2 text-gray-800 font-bold font-20 flex flex-row items-center">
                <svg
                  className="fill-current text-green-500 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597z" />
                </svg>
                Contact
              </div>
              {companyContacts && companyContacts.length ? (
                companyContacts.map((ga, i) => (
                  <div
                    key={`${i}-contacts`}
                    className="flex justify-between gap-5"
                  >
                    <dl
                      className="w-100 p-2 rounded text-gray-800 overflow-hidden hover:text-white hover:bg-indigo-500 cursor-pointer"
                      onClick={() =>
                        window.open(
                          `mailto:"${ga.NAME}" <${ga.EMAIL}>`,
                          "_blank"
                        )
                      }
                    >
                      <dt className="font-medium">{ga.NAME}</dt>
                      <dd className="sm:mt-0 sm:col-span-2">{ga.EMAIL}</dd>
                    </dl>
                    <div
                      className="flex items-center text-gray-400 hover:text-white hover:bg-indigo-500 cursor-pointer p-2 rounded"
                      onClick={(e) => handleRemoveContact(ga.EMAIL)}
                    >
                      <svg
                        className="fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z" />
                      </svg>
                    </div>
                  </div>
                ))
              ) : (
                <dl className="p-2 rounded text-gray-800 font-bold">
                  No Contact Found
                </dl>
              )}
              <form
                className="mt-2 card p-2 grid grid-cols-3 gap-2 dark:bg-gray-700 border border-gray-100"
                onSubmit={(e) => handleAddEmail(e)}
              >
                <input
                  type="email"
                  placeholder="Email Address"
                  className="dark:bg-gray-200 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-gray-50 p-1 rounded"
                />
                <input
                  type="text"
                  placeholder="Customer Name"
                  className="dark:bg-gray-200 focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 bg-gray-50 p-1 rounded"
                />
                <button className="content-center text-center font-bold bg-gray-100 rounded dark:bg-gray-800 hover:bg-indigo-500 hover:text-white">
                  <svg
                    className="fill-current w-100"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
                  </svg>
                </button>
              </form>
            </div>
            <div className="card p-2 mt-3">
              <div className="flex flex-row text-gray-800 font-20 justify-between">
                <div>
                  <div className="p-2 flex flex-row items-center font-bold">
                    <svg
                      className="fill-current text-green-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1 17l-5-5.299 1.399-1.43 3.574 3.736 6.572-7.007 1.455 1.403-8 8.597z" />
                    </svg>
                    Assigned Employee
                  </div>
                </div>
                <select
                  className="text-green-600 font-bold tracking-wider"
                  defaultValue={selectedCompany.USER_ID}
                  onChange={handlePicChange}
                >
                  {activeUsers &&
                    activeUsers.map((ga, i) => (
                      <option key={`${i}-users`} value={ga.F_ID}>
                        {ga.F_FNAME}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            {/* {JSON.stringify(companyDetail)} */}
            {companyDetail && (
              <div className="card p-2 mt-3">
                <iframe
                  className="w-100 h-100"
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/search?q=${encodeURIComponent(
                    companyDetail.F_Addr +
                      "+" +
                      companyDetail.F_City +
                      "+" +
                      companyDetail.F_State +
                      "+" +
                      companyDetail.F_ZipCode +
                      "+" +
                      companyDetail.F_Country
                  )}&key=AIzaSyDti1yLvLp4RYMBR2hHBDk7jltZU44xJqc`}
                ></iframe>
              </div>
            )}
            {/* {JSON.stringify(selectedCompany)} */}
            {/* {companyDetail && JSON.stringify(companyDetail[1])} */}
          </div>
        </div>
      </Drawer>
      <Notification show={show} msg={msg} setShow={setShow} />
    </Layout>
  );
}
