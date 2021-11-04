import { Menu, MenuItem } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import moment from "moment";
import usdFormat from "../../lib/currencyFormat";
export default function Company({ data, contact, balance, invoice }) {
  if (data[0]) {
    return (
      <div>
        <h3 className="dark:text-white">{data[0].F_FName}</h3>
        <div className="grid grid-cols-3 gap-4 my-3">
          <div className="card col-span-2 p-3 gap-4">
            <h4 className="text-lg">Information</h4>
            <p>
              Address : <span>{data[0].F_Addr}</span>{" "}
              <span>{data[0].F_City}</span> <span>{data[0].F_State}</span>{" "}
              <span>{data[0].F_ZipCode}</span> <span>{data[0].F_Country}</span>
            </p>
            <p>
              Tax Information :{" "}
              {data[0].F_IRSNo
                ? `${data[0].F_IRSNo} (${data[0].F_IRSType})`
                : "EMPTY"}
            </p>
            <p>
              Created by <span className="uppercase">{data[0].F_U1ID}</span> at{" "}
              {new Date(data[0].F_U1Date).toLocaleDateString()}
            </p>
            <p>
              Modified by <span className="uppercase">{data[0].F_U2ID}</span> at{" "}
              {new Date(data[0].F_U2Date).toLocaleDateString()}
            </p>
          </div>
          <div className="card p-3">
            <iframe
              className="w-100 h-100"
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps/embed/v1/search?q=${encodeURIComponent(
                data[0].F_Addr +
                  "+" +
                  data[0].F_City +
                  "+" +
                  data[0].F_State +
                  "+" +
                  data[0].F_ZipCode +
                  "+" +
                  data[0].F_Country
              )}&key=AIzaSyDti1yLvLp4RYMBR2hHBDk7jltZU44xJqc`}
            ></iframe>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 my-3">
          <div className="card col-span-2 p-3">
            <h4 className="text-lg">Balance</h4>
            {balance ? (
              balance.map((ga) => (
                <div key={ga.f_id}>
                  <div className="flex justify-between gap-2">
                    <div className="bg-gray-200 font-semibold w-100 rounded p-2 text-center">
                      <span className="text-indigo-400">AR</span>{" "}
                      {usdFormat(ga.F_AR)}
                    </div>
                    <div className="bg-gray-200 font-semibold w-100 rounded p-2 text-center">
                      <span className="text-indigo-400">AP</span>{" "}
                      {usdFormat(ga.F_AP)}
                    </div>
                    <div className="bg-gray-200 font-semibold w-100 rounded p-2 text-center">
                      <span className="text-indigo-400">CRDR</span>{" "}
                      {usdFormat(ga.F_CrDr)}
                    </div>
                  </div>
                  <div className="bg-gray-200 font-semibold w-100 rounded p-2 mt-3 text-center">
                    <span className="text-indigo-400">BALANCE</span>{" "}
                    {usdFormat(ga.F_Balance)}
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
            <div className="grid grid-cols-4 gap-4 p-3">
              {invoice ? (
                invoice.map((ga) => (
                  <div
                    key={ga.F_ID}
                    className="flex justify-between border rounded-xl p-2"
                  >
                    <div className="flex flex-col">
                      <span>{ga.F_InvoiceNo}</span>
                      <span>{usdFormat(ga.F_InvoiceAmt)}</span>
                      <span>Due {moment(ga.F_DueDate).fromNow()}</span>
                    </div>
                    <button className="bg-gray-200 px-2 rounded" disabled>
                      Pay
                    </button>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="card p-3">
            <h4 className="text-lg">Contact</h4>
            {contact.map((ga) => (
              <ul key={ga.F_ID} className="divide-y divide-gray-300">
                <Popover2
                  content={
                    <Menu className="transition duration-150 ease-in-out bg-gray-100">
                      <MenuItem
                        text="EMAIL"
                        icon="envelope"
                        href={`mailto:${ga.F_EMail}`}
                        target="_blank"
                      />
                      <MenuItem
                        text="PHONE"
                        icon="phone"
                        href={`tel:${ga.F_Phone}`}
                        target="_blank"
                      />
                    </Menu>
                  }
                >
                  <li className="rounded w-100 cursor-pointer my-2 py-1 text-center hover:bg-indigo-500 hover:text-white">
                    {ga.F_Contact}
                  </li>
                </Popover2>
              </ul>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return <h1>NOT FOUND</h1>;
  }
}
