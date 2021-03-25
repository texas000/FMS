import cookie from "cookie";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { Input } from "reactstrap";
import { InputGroup, Menu, MenuItem, Button } from "@blueprintjs/core";
import BootstrapTable from "react-bootstrap-table-next";
import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
const Account = ({ Cookie, Result }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [search, setSearch] = React.useState(false);
  function getResult() {
    if (search.length < 2) {
      alert("SEARCH QUERY MUST BE GRATER THAN 2 WORDS");
    } else {
      router.push({ pathname: `/company`, query: { search } });
    }
  }
  function indication() {
    return (
      <span>
        {router.query.search
          ? `Your search "${router.query.search}" did not match any documents.`
          : `Please search something`}
      </span>
    );
  }

  const column = [
    {
      dataField: "F_SName",
      text: "CUSTOMER",
      headerClasses: "w-50 text-white bg-primary font-weight-light",
      classes: "text-xs text-primary btn-link my-0",
      style: { cursor: "pointer" },
      events: {
        onClick: (e, columns, columnIndex, row) => {
          router.push(`/customer/${row.F_ID}`);
        },
      },
    },
    {
      headerClasses: "text-white bg-primary font-weight-light",
      classes: "text-gray-800",
      dataField: "F_City",
      text: "CITY",
    },
    {
      headerClasses: "text-white bg-primary font-weight-light",
      classes: "text-gray-800",
      dataField: "F_Country",
      text: "COUNTRY",
    },
  ];
  const inputMenu = (
    <Popover2
      content={
        <Menu>
          <MenuItem text="Agent" />
          <MenuItem text="Customer" />
          <MenuItem text="Branch" />
          <MenuItem text="Shipper" />
          <MenuItem text="Broker" />
          <MenuItem text="Trucker" />
          <MenuItem text="Other" />
        </Menu>
      }
      placement="bottom-end"
    >
      <Button minimal={true} rightIcon="caret-down">
        Type
      </Button>
    </Popover2>
  );

  useEffect(() => {
    !TOKEN && router.push("/login");
    // console.log(Result);
  }, []);
  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN} TITLE="Company">
        <div className="d-flex flex-sm-row justify-content-between mb-4">
          <div className="flex-column">
            <h3 className="mb-4 font-weight-light">Company</h3>
          </div>
          <div className="flex-column">
            <InputGroup
              large={true}
              leftIcon="search"
              placeholder="Search company..."
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              rightElement={inputMenu}
              onKeyPress={(e) => {
                if (e.key == "Enter") getResult();
              }}
            ></InputGroup>
          </div>
        </div>
        <BootstrapTable
          keyField="F_ID"
          hover
          striped
          condensed
          wrapperClasses="table-responsive text-xs rounded"
          noDataIndication={indication}
          bordered={false}
          data={Result}
          columns={column}
        />
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
