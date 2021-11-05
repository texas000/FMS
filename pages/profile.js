import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
// import Select from "react-select";
import AsyncSelect from "react-select/async";
import useSWR from "swr";
import Link from "next/link";
import { useState } from "react";
import router from "next/router";

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
  const [companySelected, setCompanySelected] = useState(false);
  const { data: assignedCustomer, mutate } = useSWR(
    "/api/company/getAssignedCustomer"
  );

  const handleInputChange = (newValue) => {
    // var inputValue = newValue.replace(/'/g, "");
    return newValue;
  };
  const loadOptions = async (inputValue, callback) => {
    if (inputValue.length > 1) {
      return fetch(
        `/api/company/getCompanyList?search=${encodeURIComponent(inputValue)}`
      ).then((res) => res.json());
    }
  };

  async function handleAddCompany() {
    const check = confirm(
      `Would you like to add an account ${companySelected.label}?`
    );
    if (check) {
      const res = await fetch(
        `/api/company/postCompanyList?id=${
          companySelected.value
        }&company=${encodeURIComponent(companySelected.label)}`
      );
      if (res.status === 200) {
        // alert(`${companySelected.label} successfully added!`);
        setCompanySelected(false);
        mutate();
      } else {
        alert(`ERROR ${res.status}`);
      }
    }
  }
  async function handleAddEmail(e, customer) {
    e.preventDefault();
    await fetch(
      `/api/company/addCompanyContact?id=${customer.COMPANY_ID}&email=${e.target[0].value}&name=${e.target[1].value}`
    )
      .then(() => {
        mutate();
      })
      .catch((err) => {
        alert(JSON.stringify(err));
      });
  }

  async function handleRemoveCompany(customer) {
    const check = confirm(
      `Would you like to remove an account ${customer.COMPANY_NAME}?`
    );
    if (check) {
      const res = await fetch(
        `/api/company/removeCompanyList?id=${customer.COMPANY_ID}`
      );
      if (res.status === 200) {
        alert(`${customer.COMPANY_NAME} successfully removed!`);
        mutate();
      } else {
        alert(`ERROR ${res.status}`);
      }
    }
  }
  async function handleDeleteContact(contact) {
    const check = confirm(
      `Would you like to remove contact for ${contact.NAME}?`
    );
    if (check) {
      const res = await fetch(
        `/api/company/removeCompanyContact?id=${
          contact.COMPANY_ID
        }&email=${encodeURIComponent(contact.EMAIL)}`
      );
      if (res.status === 200) {
        mutate();
      } else {
        alert(`ERROR ${res.status}`);
      }
    }
  }
  return (
    <Layout TOKEN={props.token} TITLE="Profile">
      <div className="flex flex-sm-row justify-between">
        <h3 className="dark:text-white mb-3">Profile</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card flex justify-center items-center p-3 gap-2">
          <img
            src="/image/icons/sarah.svg"
            className="object-cover h-20 w-20 rounded-full border-2 border-gray-200"
            width="128"
            height="128"
          />

          <h3 className="my-2 font-bold dark:text-white">
            {props.token.first} {props.token.last}
          </h3>

          <p className="w-1/2 sm:w-100 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
            <span className="font-bold">EMAIL</span>
            <span className="truncate">{props.token.email}</span>
          </p>
          <p className="w-1/2 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
            <span className="font-bold">EXTENSION</span>
            <span>{props.token.group}</span>
          </p>
          <p className="w-1/2 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
            <span className="font-bold">ACCOUNT</span>
            <span>{props.token.username}</span>
          </p>
          <p className="w-1/2 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
            <span className="font-bold">EMPLOYEE CODE</span>
            <span>{props.token.uid}</span>
          </p>
          <p className="w-1/2 flex justify-between p-2 rounded bg-gray-100 dark:bg-gray-600 uppercase">
            <span className="font-bold">FS ACCOUNT</span>
            <span>{props.token.fsid}</span>
          </p>
        </div>
        <div className="card p-3 mb-3">
          <h3 className="dark:text-white mb-3 text-center">Manage Customer</h3>
          <label>Company</label>
          <AsyncSelect
            instanceId="companySearch"
            className="dark:text-gray-800"
            cacheOptions
            onInputChange={handleInputChange}
            loadOptions={loadOptions}
            placeholder="SEARCH CUSTOMER NAME"
            onChange={(e) => setCompanySelected(e)}
          />
          {companySelected && (
            <div
              className="p-3 mt-4 bg-gray-200 rounded flex justify-between border-2 border-indigo-400 hover:bg-gray-300 cursor-pointer"
              onClick={handleAddCompany}
            >
              <span className="dark:text-gray-800">
                {companySelected.label}
              </span>
              <img
                className="object-cover w-4 h-4"
                src="https://cdn-icons-png.flaticon.com/512/1237/1237946.png"
              />
            </div>
          )}
          {assignedCustomer ? (
            assignedCustomer.map((ga) => (
              <div key={ga.COMPANY_ID}>
                <div
                  className="p-2 mt-4 bg-gray-200 rounded shadow flex justify-between hover:bg-gray-300 cursor-pointer dark:text-gray-800"
                  onClick={() => handleRemoveCompany(ga)}
                >
                  <span>{ga.COMPANY_NAME}</span>
                  <img
                    className="object-cover h-4 w-4"
                    src="https://cdn-icons-png.flaticon.com/512/126/126497.png"
                  />
                </div>
                {ga.CONTACT.length != 0 && (
                  <ul className="bg-gray-100 rounded p-1 dark:bg-gray-600">
                    {ga.CONTACT.map((na) => (
                      <li
                        key={na.EMAIL}
                        className="ml-3 tracking-wider list-disc uppercase flex justify-between"
                      >
                        <div>
                          {na.NAME} &#60;{na.EMAIL}&#62;
                        </div>
                        <div>
                          <button
                            onClick={() =>
                              window.open(
                                `mailto:"${na.NAME}" <${na.EMAIL}>`,
                                "_blank"
                              )
                            }
                            className="bg-gray-200 mx-1 px-1 hover:bg-indigo-600 hover:text-white rounded"
                          >
                            Mail
                          </button>
                          <button
                            className="bg-gray-200 px-1 hover:bg-indigo-600 hover:text-white rounded"
                            onClick={() => handleDeleteContact(na)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <form
                  className="card p-2 grid grid-cols-3 gap-2 dark:bg-gray-700"
                  onSubmit={(e) => handleAddEmail(e, ga)}
                >
                  <input
                    type="email"
                    placeholder="email"
                    className="dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="name"
                    className="dark:bg-gray-700"
                  />
                  <button className="bg-gray-100 rounded dark:bg-gray-800">
                    Add
                  </button>
                </form>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </Layout>
  );
}
