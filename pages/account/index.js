import cookie from "cookie";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { Input } from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

const Account = ({ Cookie, Result }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [search, setSearch] = React.useState(false);
  function getResult() {
    if (search.length < 2) {
      alert("SEARCH QUERY MUST BE GRATER THAN 2 WORDS");
    } else {
      router.push({ pathname: `/account`, query: { search } });
    }
  }

  const column = [
    {
      dataField: "F_SName",
      text: "CUSTOMER",
      headerStyle: { width: "50%" },
      events: {
        onClick: (e, columns, columnIndex, row) => {
          router.push(`/account/company/${row.F_ID}`);
        },
      },
    },
    {
      dataField: "F_City",
      text: "CITY",
    },
    {
      dataField: "F_Country",
      text: "COUNTRY",
    },
  ];

  useEffect(() => {
    !TOKEN && router.push("/login");
    // console.log(Result);
  }, []);
  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN} TITLE="ACCOUNTING">
        <div className="d-flex flex-sm-row justify-content-between mb-4">
          <div className="flex-column">
            <h3>Accounting</h3>
          </div>
          <div className="flex-column">
            <Input
              title="search"
              className="border-1 small mx-1"
              style={{ width: "38vw" }}
              placeholder="Search Company Name.."
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key == "Enter") getResult();
              }}
              autoFocus={true}
            />
          </div>
        </div>
        {/* {JSON.stringify(Result)} */}
        <BootstrapTable
          keyField="F_ID"
          hover
          striped
          condensed
          wrapperClasses="table-responsive text-xs"
          data={Result}
          columns={column}
        />
        {/* <Input />
        <h3>User: {TOKEN.username}</h3>
        <h3>Group: {TOKEN.group}</h3>
        <h3>Accounts: {TOKEN.account && TOKEN.account.length}</h3> */}
      </Layout>
    );
  } else {
    return <p>Redirecting...</p>;
  }
};

export async function getServerSideProps({ req, query }) {
  // Fetch data from external API
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  if (query.search === undefined) {
    return {
      props: {
        Cookie: cookies,
        Result: [],
      },
    };
  } else {
    var result = [];
    const fetchSearch = await fetch(
      `${process.env.BASE_URL}api/accounting/searchCustomer`,
      {
        headers: {
          query: encodeURIComponent(query.search),
          key: cookies.jamesworldwidetoken,
        },
      }
    );
    if (fetchSearch.status === 200) {
      result = await fetchSearch.json();
    }
    // const result = await test.json();
    // console.timeEnd("fecth_time");
    return {
      props: {
        Cookie: cookies,
        Result: result,
      },
    };
  }
}

export default Account;
