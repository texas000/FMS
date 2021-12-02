import { Dialog } from "@blueprintjs/core";
import { useState } from "react";

export default function CompanyContact({ contact }) {
  const [selectedContact, setSelectedContact] = useState(false);
  return (
    <div className="card col-span-2 md:col-span-2 lg:col-span-1 overflow-hidden">
      <div className="h-44 overflow-y-scroll">
        <table className="min-w-full md:min-w-10 divide-y divide-gray-200">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">
                Contact
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
            {contact &&
              contact.map((ga, i) => (
                <tr
                  key={`${i}-contact`}
                  className="hover:text-white hover:bg-indigo-500 cursor-pointer"
                  onClick={() => setSelectedContact(ga)}
                >
                  <td className="px-6 py-2 whitespace-nowrap">
                    <span>{ga.F_Contact}</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <Dialog
        isOpen={selectedContact}
        onClose={() => setSelectedContact(false)}
        className="pb-0"
      >
        <div className="card overflow-hidden">
          <div className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider bg-gray-100">
            <h1>{selectedContact.F_Contact}</h1>
          </div>
          <ul className="divide-y divide-gray-300">
            <li className="px-6 text-xs py-2 tracking-wider">
              PHONE: {selectedContact.F_Phone}
            </li>
            <li
              className="px-6 text-xs py-2 tracking-wider hover:text-white hover:bg-indigo-500 cursor-pointer"
              onClick={() =>
                window.open(`mailto:${selectedContact.F_EMail}`, "_blank")
              }
            >
              EMAIL: {selectedContact.F_EMail}
            </li>
            <li className="px-6 text-xs py-2 tracking-wider">
              FAX: {selectedContact.F_Fax}
            </li>
          </ul>
        </div>
      </Dialog>
    </div>
  );
}
