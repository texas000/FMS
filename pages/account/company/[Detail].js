import cookie from "cookie";
import Layout from "../../../components/Layout";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { useEffect } from "react";
import moment from "moment";

export default function Detail({ Cookie, Query, Company, Acc, Sum, Balance }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    console.log(Acc);
  }, []);

  function indication() {
    return <span>NO DATA</span>;
  }

  function numberWithCommas(x) {
    var num = parseFloat(x).toFixed(2);
    return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const MyExportCSV = (props) => {
    const handleClick = () => {
      props.onExport();
    };
    return (
      <div className="text-right mb-2">
        <button className="btn btn-success" onClick={handleClick}>
          Export to CSV
        </button>
      </div>
    );
  };
  // Acc property names
  // F_BillTo
  // F_DueDate
  // F_ID
  // F_InvoiceAmt
  // F_PaidAmt
  // F_TBName
  // PIC

  const column = [
    {
      dataField: "F_DueDate",
      text: "DUE",
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).utc().isSameOrBefore(moment())) {
            return (
              <div className="text-danger">
                {moment(cell).utc().format("L")}
              </div>
            );
          } else {
            return (
              <div className="text-primary">
                {moment(cell).utc().format("L")}
              </div>
            );
          }
        }
      },
    },
    {
      dataField: "F_InvoiceNo",
      text: "REF",
    },
    {
      dataField: "F_InvoiceAmt",
      text: "AMOUNT",
      formatter: (cell) => {
        if (cell) {
          return numberWithCommas(cell);
        }
      },
      sort: true,
    },
    {
      dataField: "F_PaidAmt",
      text: "PAID",
      formatter: (cell) => {
        if (cell) {
          return numberWithCommas(cell);
        }
      },
      sort: true,
    },
    {
      dataField: "PIC",
      text: "PIC",
    },
  ];

  return (
    <Layout TOKEN={TOKEN} TITLE={Company.F_SName || Query}>
      {Company.hasOwnProperty("F_ID") ? (
        <h3>{Company.F_SName}</h3>
      ) : (
        <h3>{Query} does not exist</h3>
      )}
      {Balance.length && (
        <div>
          <p className="text-danger">AP: {numberWithCommas(Balance[0].F_AP)}</p>
          <p className="text-primary">
            AR: {numberWithCommas(Balance[0].F_AR)}
          </p>
          <p className="text-success">
            BALANCE: {numberWithCommas(Balance[0].F_Balance)}
          </p>
          <p className="text-success">
            CREDIT DEBIT: {numberWithCommas(Balance[0].F_CrDr)}
          </p>
          <p>
            Last Deposit Amount:{" "}
            {numberWithCommas(Balance[0].F_LastDepositAmount)}
          </p>
        </div>
      )}
      {Sum && (
        <p className="text-danger">
          {numberWithCommas(Sum)} - {Acc.length} Records
        </p>
      )}
      {Acc.length && (
        <ToolkitProvider
          keyField="F_ID"
          bordered={false}
          columns={column}
          data={Acc}
          exportCSV
          search
        >
          {(props) => (
            <>
              <MyExportCSV {...props.csvProps}>Export CSV!!</MyExportCSV>
              <BootstrapTable
                {...props.baseProps}
                hover
                striped
                condensed
                wrapperClasses="table-responsive text-xs"
                filter={filterFactory()}
                noDataIndication={indication}
              />
            </>
          )}
        </ToolkitProvider>
      )}
      {/* {Acc && Acc.map((ga) => <p key={ga.F_ID}>{ga.F_InvoiceAmt}</p>)} */}
    </Layout>
  );
}

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  const comRes = await fetch(
    `${process.env.BASE_URL}api/accounting/getCompanyDetail`,
    {
      headers: {
        customer: query.Detail,
        key: cookies.jamesworldwidetoken,
      },
    }
  );
  const com = await comRes.json();

  const balanceRes = await fetch(
    `${process.env.BASE_URL}api/accounting/getBalance`,
    {
      headers: {
        customer: query.Detail,
        key: cookies.jamesworldwidetoken,
      },
    }
  );
  const balance = await balanceRes.json();

  if (com.hasOwnProperty("F_ID")) {
    const accRes = await fetch(
      `${process.env.BASE_URL}api/accounting/getAccView`,
      {
        headers: {
          company: com.F_SName,
          key: cookies.jamesworldwidetoken,
        },
      }
    );
    var acc = await accRes.json();
    var sum = 0;
    acc.map((ga) => {
      var amount = ga.F_InvoiceAmt - ga.F_PaidAmt;
      sum += amount;
    });
  }

  // Pass data to the page via props
  return {
    props: {
      Cookie: cookies,
      Query: query.Detail,
      Company: com,
      Acc: acc || false,
      Balance: balance,
      Sum: sum || false,
    },
  };
}
