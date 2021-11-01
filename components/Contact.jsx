import { Dialog } from "@blueprintjs/core";
import useSWR from "swr";
import router from "next/router";

export default function Contact({ setOpen, open }) {
  const { data } = useSWR("/api/dashboard/contacts");

  return (
    <Dialog
      isOpen={open}
      onClose={() => {
        setOpen(false);
      }}
      title="Company Contact"
      className="dark:bg-gray-600 bg-white rounded-xl lg:w-1/2"
    >
      <div className="p-4">
        <div className="card overflow-hidden sm:rounded-lg">
          <div className="px-4 py-3 sm:px-6 bg-gray-200 dark:bg-gray-800">
            <h3 className="text-lg leading-6 font-medium font-bold dark:text-white">
              James Worldwide Contact List
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              {data &&
                data.length &&
                data.map((ga, i) => (
                  <div
                    className={`${
                      i % 2 == 1
                        ? "bg-gray-100 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-600"
                    } px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-6 hover:text-white hover:bg-indigo-500 cursor-pointer`}
                    key={ga.F_ID}
                    onClick={() => {
                      router.push(`/chat?user=${ga.F_ID}`);
                      setOpen(false);
                    }}
                  >
                    <dt className="text-sm font-semibold">
                      {ga.F_FNAME} {ga.F_LNAME}
                    </dt>
                    <dd className="mt-1 text-sm sm:mt-0">{ga.F_GROUP}</dd>
                    <dd className="mt-1 text-sm sm:mt-0">
                      {ga.F_GROUP > 1 && ga.F_GROUP < 200
                        ? "562-393-8800"
                        : ga.F_GROUP >= 200 && ga.F_GROUP < 300
                        ? "562-393-8900"
                        : ga.F_GROUP >= 300 && ga.F_GROUP < 400
                        ? "562-393-8877"
                        : ga.F_GROUP >= 400 && ga.F_GROUP < 500
                        ? "562-393-8899"
                        : ga.F_GROUP >= 500 && ga.F_GROUP < 600
                        ? "562-304-9988"
                        : ga.F_GROUP >= 600 && ga.F_GROUP < 700
                        ? "562-321-5400"
                        : ""}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
