import Layout from "../../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import moment from "moment";
import BootstrapTable from "react-bootstrap-table-next";
import usdFormat from "../../lib/currencyFormat";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import { useRouter } from "next/router";

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    return {
      props: {
        token: token,
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

export default function invoice(props) {
  const router = useRouter();
  const { data } = useSWR("/api/invoice");

  function indication() {
    return <span>No Pending invoices from your account</span>;
  }

  const columns = [
    {
      dataField: "F_InvoiceNo",
      text: "INVOICE",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "CompanyName",
      text: "COMPANY",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "F_InvoiceAmt",
      text: "AMOUNT",
      align: "center",
      headerAlign: "center",
      formatter: (cell) => usdFormat(cell),
      sort: true,
    },
    {
      dataField: "F_PaidAmt",
      text: "PAID",
      align: "center",
      headerAlign: "center",
      formatter: (cell) => usdFormat(cell),
      sort: true,
    },
    {
      dataField: "F_DueDate",
      text: "DUE",
      align: "center",
      headerAlign: "center",
      formatter: (cell) => moment(cell).utc().format("L"),
      sort: true,
    },
  ];

  const defaultSorted = [
    {
      dataField: "F_InvoiceNo",
      order: "desc",
    },
  ];

  const options = {
    custom: true,
    totalSize: data ? data.length : 0,
  };

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      router.push(`/invoice/${row.F_ID}`);
    },
  };
  return (
    <Layout TOKEN={props.token} TITLE="Invoice">
      <PaginationProvider pagination={paginationFactory(options)}>
        {({ paginationProps, paginationTableProps }) => (
          <div className="flex flex-col">
            <div className="flex justify-between">
              <h3 className="dark:text-white">Invoice</h3>
              <PaginationListStandalone {...paginationProps} />
            </div>
            <div className="card my-4 -pb-5 rounded-xl">
              <BootstrapTable
                data={data || []}
                columns={columns}
                keyField="F_ID"
                headerClasses="dark:text-white text-black font-semibold"
                rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer border-b-2 border-gray-200 dark:bg-gray-700 dark:text-white"
                defaultSorted={defaultSorted}
                pagination={paginationFactory(options)}
                noDataIndication={indication}
                condensed
                rowEvents={rowEvents}
                bordered={false}
                {...paginationTableProps}
              />
            </div>
          </div>
        )}
      </PaginationProvider>
    </Layout>
  );
}
