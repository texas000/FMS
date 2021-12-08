import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import moment from "moment";
import useSWR from "swr";
import usdFormat from "../../lib/currencyFormat";
import { useRouter } from "next/router";
import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import Files from "../../components/Accounting/Files";
import router from "next/router";
import Comments from "../../components/Utils/Comment";
export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    return {
      props: {
        token: token,
        q: query.detail,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}

function handleReferenceClick(type, ref) {
  switch (type) {
    case "OIH":
    case "OIM":
      router.push(`/forwarding/oim/${ref}`);
      break;
    case "OOH":
    case "OOM":
      router.push(`/forwarding/aex/${ref}`);
      break;
    case "AIH":
    case "AIM":
      router.push(`/forwarding/aim/${ref}`);
      break;
    case "AOH":
    case "AOM":
      router.push(`/forwarding/aex/${ref}`);
      break;
    case "GEN":
      router.push(`/forwarding/other/${ref}`);
      break;
    default:
      alert("ERROR: NO MATCHING TYPE");
  }
}

const Status = ({ data }) => {
  if (data == 101) {
    return <span className="font-bold">Requested</span>;
  }
  if (data == 110) {
    return <span className="font-bold">Director Rejected</span>;
  }
  if (data == 111) {
    return <span className="font-bold">Director Approved</span>;
  }
  if (data == 120) {
    return <span className="font-bold">Account Rejected</span>;
  }
  if (data == 121) {
    return <span className="font-bold">Account Approved</span>;
  }
  if (data == 131) {
    return <span className="font-bold">CEO Approved</span>;
  } else {
    return <span className="font-bold">{data}</span>;
  }
};

const MasterTable = ({ mas }) => (
  <div className="grid grid-cols-3 grid-flow-col gap-4 mt-4">
    <div className="card p-2 col-span-2 rounded-xl text-xs">
      <dl
        className="p-2 grid grid-cols-3 hover:text-indigo-500 cursor-pointer"
        onClick={() =>
          handleReferenceClick(mas.summary?.F_Type, mas.summary?.F_RefNo)
        }
      >
        <dt className="col-span-1">REFERENCE NUMBER :</dt>
        <dd className="col-span-2">{mas.summary?.F_RefNo}</dd>
      </dl>
      <dl
        className="p-2 grid grid-cols-3 hover:text-indigo-500 cursor-pointer"
        onClick={() => {
          router.push(`/company/${mas.F_PayTo}`);
        }}
      >
        <dt className="col-span-1">VENDOR :</dt>
        <dd className="col-span-2">{mas.VENDOR}</dd>
      </dl>
      <dl className="p-2 grid grid-cols-3">
        <dt className="col-span-1">CREATED BY :</dt>
        <dd className="col-span-2 uppercase">{mas.F_U1ID}</dd>
      </dl>
      <dl className="p-2 grid grid-cols-3">
        <dt className="col-span-1">INVOICE AMOUNT :</dt>
        <dd className="col-span-2 text-blue-500">
          {usdFormat(mas.F_InvoiceAmt)}
        </dd>
      </dl>
      <dl className="p-2 grid grid-cols-3">
        <dt className="col-span-1">PAID AMOUNT :</dt>
        <dd className="col-span-2 text-red-500">{usdFormat(mas.F_PaidAmt)}</dd>
      </dl>
    </div>
    <div className="card p-2 rounded-xl text-xs">
      <dl className="p-2 grid grid-cols-2">
        <dt>POST :</dt>
        <dd>{moment(mas.F_PostDate).utc().format("L")}</dd>
      </dl>
      <dl className="p-2 grid grid-cols-2">
        <dt>INVOICE DATE :</dt>
        <dd>{moment(mas.F_InvoiceDate).utc().format("L")}</dd>
      </dl>
      <dl className="p-2 grid grid-cols-2">
        <dt>DUE DATE :</dt>
        <dd>{moment(mas.F_DueDate).utc().format("L")}</dd>
      </dl>
      <dl className="p-2 grid grid-cols-2">
        <dt>CREATED :</dt>
        <dd>{moment(mas.F_U1Date).utc().format("L")}</dd>
      </dl>
      <dl className="p-2 grid grid-cols-2">
        <dt>UPDATED :</dt>
        <dd>{moment(mas.F_U2Date).utc().format("L")}</dd>
      </dl>
    </div>
  </div>
);

const HouseTable = ({ hus }) => (
  <div className="card col-span-2 rounded-xl mt-3 text-gray-800 overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="py-3">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-white uppercase tracking-wider">
            CODE
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-white uppercase tracking-wider">
            DESCRIPTION
          </th>

          <th className="px-6 py-3 text-left text-xs font-medium text-gray-800 dark:text-white uppercase tracking-wider">
            AMOUNT
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 text-gray-500 text-xs">
        {hus.map((ga) => (
          <tr key={ga.F_ID}>
            <td className="px-6 py-2 whitespace-nowrap dark:text-gray-300">
              {ga.F_BillingCode}
            </td>
            <td className="px-6 py-2 whitespace-nowrap dark:text-gray-300">
              {ga.F_Description}
            </td>
            <td className="px-6 py-2 whitespace-nowrap dark:text-gray-300">
              {usdFormat(ga.F_Amount)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Requested = ({ req }) => {
  if (req) {
    if (!req.error) {
      return (
        <div className="card col-span-2 rounded-xl mt-3 text-gray-800 overflow-hidden mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="py-3">
              <tr>
                <th
                  colSpan="4"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider dark:text-white"
                >
                  REQUEST
                </th>
              </tr>
            </thead>
            <tbody className="dark:text-white text-gray-500 divide-y divide-gray-200 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider">
              {req?.data?.map((ga, i) => (
                <tr key={`${i}-file`}>
                  <td className="px-6 py-2 whitespace-nowrap">
                    <Status data={ga.STATUS} />
                  </td>
                  <td>{ga.CREATOR}</td>
                  <td>{ga.REFNO}</td>
                  <td>{moment(ga.UPDATED).utc().format("lll")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <p>{req.message}</p>;
    }
  } else {
    return <p>Loading...</p>;
  }
};

export default function invoice(props) {
  const { data } = useSWR(`/api/invoice/ap?q=${props.q}`);
  const { data: request } = useSWR(
    data ? `/api/requests/ap/list_id?id=${props.q}` : null
  );
  const { data: files } = useSWR(
    data ? `/api/file/listFromDetail?tbid=${props.q}&tbname=T_APHD` : null
  );
  const router = useRouter();
  if (typeof window !== "undefined" && data?.F_InvoiceNo) {
    // Define an empty array
    var arr = [];
    // Initial value is null value but change to empty array string
    var history = localStorage.getItem("pageHistory");
    // If the page history is empty
    if (history == null) {
      arr.unshift({ path: router.asPath, ref: data?.F_InvoiceNo || props.q });
      localStorage.setItem("pageHistory", JSON.stringify(arr));
    } else {
      arr = JSON.parse(history);
      // If the page history is exist, check the most recent history
      // If the reference is same as current reference, do not store data
      if (arr[0].ref != (data?.F_InvoiceNo || props.q)) {
        arr.unshift({ path: router.asPath, ref: data?.F_InvoiceNo || props.q });
        localStorage.setItem("pageHistory", JSON.stringify(arr));
      }
    }
  }

  return (
    <Layout
      TOKEN={props.token}
      TITLE={data?.F_InvoiceNo || props.q}
      LOADING={!data}
    >
      {data && data.error ? (
        <section className="flex items-center justify-center py-10 text-white sm:py-16 md:py-24 lg:py-32">
          <div className="relative max-w-3xl px-10 text-center text-white auto lg:px-0">
            <div className="flex justify-between">
              <h1 className="relative flex flex-col text-6xl font-extrabold text-left text-black">
                {data.message}
              </h1>
            </div>

            <div className="my-16 border-b border-gray-300 lg:my-24"></div>

            <h2 className="text-left text-gray-500 xl:text-xl"></h2>
          </div>
        </section>
      ) : (
        <>
          <div className="flex justify-between">
            <div className="flex flex-row items-center">
              <h3 className="dark:text-white mr-2">
                {data?.F_InvoiceNo || "NO INVOICE NUMBER"}
              </h3>
              {data?.F_InvoiceAmt == data?.F_PaidAmt &&
              data?.F_PaidAmt !== 0 ? (
                <Popover2
                  content={
                    <div className="card p-2 rounded-sm">
                      Paid with {data?.F_CheckNo}
                    </div>
                  }
                  autoFocus={false}
                  minimal={true}
                  interactionKind="hover"
                  hoverOpenDelay={100}
                >
                  <svg
                    className="fill-current text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.334 11.96c-.713-.726-.872-1.829-.393-2.727.342-.64.366-1.401.064-2.062-.301-.66-.893-1.142-1.601-1.302-.991-.225-1.722-1.067-1.803-2.081-.059-.723-.451-1.378-1.062-1.77-.609-.393-1.367-.478-2.05-.229-.956.347-2.026.032-2.642-.776-.44-.576-1.124-.915-1.85-.915-.725 0-1.409.339-1.849.915-.613.809-1.683 1.124-2.639.777-.682-.248-1.44-.163-2.05.229-.61.392-1.003 1.047-1.061 1.77-.082 1.014-.812 1.857-1.803 2.081-.708.16-1.3.642-1.601 1.302s-.277 1.422.065 2.061c.479.897.32 2.001-.392 2.727-.509.517-.747 1.242-.644 1.96s.536 1.347 1.17 1.7c.888.495 1.352 1.51 1.144 2.505-.147.71.044 1.448.519 1.996.476.549 1.18.844 1.902.798 1.016-.063 1.953.54 2.317 1.489.259.678.82 1.195 1.517 1.399.695.204 1.447.072 2.031-.357.819-.603 1.936-.603 2.754 0 .584.43 1.336.562 2.031.357.697-.204 1.258-.722 1.518-1.399.363-.949 1.301-1.553 2.316-1.489.724.046 1.427-.249 1.902-.798.475-.548.667-1.286.519-1.996-.207-.995.256-2.01 1.145-2.505.633-.354 1.065-.982 1.169-1.7s-.135-1.443-.643-1.96zm-12.584 5.43l-4.5-4.364 1.857-1.857 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.642z" />
                  </svg>
                </Popover2>
              ) : (
                <Popover2
                  content={
                    <div className="card p-2 rounded-sm">
                      We have not made payment yet
                    </div>
                  }
                  autoFocus={false}
                  minimal={true}
                  interactionKind="hover"
                  hoverOpenDelay={100}
                >
                  <svg
                    className="fill-current text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.151 17.943l-4.143-4.102-4.117 4.159-1.833-1.833 4.104-4.157-4.162-4.119 1.833-1.833 4.155 4.102 4.106-4.16 1.849 1.849-4.1 4.141 4.157 4.104-1.849 1.849z" />
                  </svg>
                </Popover2>
              )}
            </div>
            <div className="flex flex-row">
              <svg
                className="fill-current text-gray-500 hover:text-indigo-500 cursor-pointer mr-2"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                onClick={() => {
                  if (!isNaN(props.q)) {
                    router.push(`${parseInt(props.q) - 1}`);
                  }
                }}
              >
                <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
              </svg>
              <svg
                className="fill-current text-gray-500 hover:text-indigo-500 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                onClick={() => {
                  if (!isNaN(props.q)) {
                    router.push(`${parseInt(props.q) + 1}`);
                  }
                }}
              >
                <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
              </svg>
            </div>
          </div>

          <MasterTable mas={data} />
          <HouseTable hus={data?.detail} />
          <Files files={files} />
          <Requested req={request} />
          <Comments tbname="T_APHD" tbid={data?.F_ID} uid={props.token.uid} />
        </>
      )}
    </Layout>
  );
}
