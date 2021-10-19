import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../components/Layout";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Card } from "reactstrap";
import moment from "moment";
import useSWR from "swr";
import router from "next/router";

const Index = ({ token }) => {
  const [Page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { data, mutate } = useSWR(
    `/api/forwarding/oim/pagination?page=${Page}&size=50`
  );

  // INDICATION FOR TABLE
  function indication() {
    return (
      <span>
        <span className="text-danger">No Ocean Import</span> at the moment
      </span>
    );
  }

  // HEADER STYLE FLEX COLUMN
  function filterHeader(column, colIndex, { sortElement, filterElement }) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        {column.text}
        {filterElement}
        {sortElement}
      </div>
    );
  }

  //  PAGE BUTTON TO NAVIGATE
  const pageButtonRenderer = ({
    page,
    active,
    disabled,
    title,
    onPageChange,
  }) => {
    const handleClick = (e) => {
      e.preventDefault();
      onPageChange(page);
      if (page === ">") {
        setPage(Page + 1);
      }
      if (page === "<") {
        if (Page !== 1) {
          setPage(Page - 1);
        }
      }
    };
    return (
      <li className="page-item" key={page}>
        <a
          onClick={handleClick}
          className={`${
            active && "bg-indigo-500 text-white"
          } btn btn-sm hover:bg-indigo-300 hover:text-white mx-1 ${
            (page === ">>" || page === "<<") && "d-none"
          }`}
        >
          {typeof page === "number" ? (Page - 1) * 5 + page : page}
        </a>
      </li>
    );
  };

  // Custom Total Data for Table
  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2">
      Showing {from} to {to} of {size} Results
    </span>
  );

  // Custom Page Size
  const customSizePerPage = [
    { page: 10, text: "10" },
    { page: 50, text: "50" },
    { page: 100, text: "100" },
    { page: 200, text: "200" },
  ];

  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange,
  }) => (
    <div className="page-item ml-2" role="group">
      {customSizePerPage.map((option) => {
        const isSelect = currSizePerPage == `${option.page}`;
        return (
          <a
            key={option.text}
            onClick={() => {
              onSizePerPageChange(option.page);
              // setPageSize(option.page);
              mutate();
              // onSizePerPageChange(option.page);
            }}
            small="true"
            className={isSelect ? "btn btn-sm btn-primary" : "btn btn-sm"}
          >
            {option.text}
          </a>
        );
      })}
    </div>
  );

  const headerSortingStyle = { backgroundColor: "#c9d5f5" };
  const column = [
    {
      dataField: "F_RefNo",
      text: "REFERENCE",
      classes: "text-center text-truncate text-uppercase",
      headerClasses:
        "text-dark text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      sort: true,
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerSortingStyle,
      headerFormatter: filterHeader,
    },
    {
      dataField: "Company",
      text: "CUSTOMER",
      classes: "text-truncate",
      headerClasses:
        "text-dark text-center align-middle pb-0 font-weight-bold w-40 min-w-full",
      sort: true,
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerSortingStyle,
      headerFormatter: filterHeader,
    },
    {
      dataField: "F_MBLNo",
      text: "MASTER BL",
      classes: "text-truncate",
      headerClasses:
        "text-dark text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      sort: true,
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerSortingStyle,
      headerFormatter: filterHeader,
    },
    // {
    // 	dataField: "F_HBLNo",
    // 	text: "HBL",
    // 	classes: "text-truncate",
    // 	headerClasses:
    // 		"text-dark text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
    // 	sort: true,
    // 	filter: textFilter({
    // 		className: "text-xs text-center",
    // 	}),
    // 	headerSortingStyle,
    // },
    {
      dataField: "F_ETD",
      text: "ETD",
      classes: "text-truncate",
      headerClasses:
        "text-dark text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).format("L");
        }
      },
    },
    {
      dataField: "F_ETA",
      text: "ETA",
      classes: "text-truncate",
      headerClasses:
        "text-dark text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).format("L");
        }
      },
    },
    {
      dataField: "F_PostDate",
      text: "POST DATE",
      classes: "text-truncate",
      headerClasses:
        "text-dark text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
      headerFormatter: filterHeader,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).format("L");
        }
      },
    },
    {
      dataField: "F_U2ID",
      text: "EDITOR",
      classes: "text-truncate text-uppercase",
      headerClasses:
        "text-dark text-center px-4 align-middle pb-0 font-weight-bold w-40 min-w-full",
      sort: true,
      headerSortingStyle,
      headerFormatter: filterHeader,
      filter: textFilter({
        className: "text-xs text-center hidden sm:block",
      }),
    },
  ];

  const pageOption = {
    // onSizePerPageChange: (sizePerPage, page) => {
    // 	setPageSize(sizePerPage);
    // 	setPage(page);
    // 	mutate();
    // },
    // onPageChange: (page, sizePerPage) => {
    // 	setPage(page);
    // 	setPageSize(sizePerPage);
    // 	console.log(page);
    // 	console.log(sizePerPage);
    // 	// mutate();
    // },
    custom: true,
    alwaysShowAllBtns: true,
    // showTotal: true,
    pageButtonRenderer,
    paginationTotalRenderer: customTotal,
    sizePerPageRenderer,
  };

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      setLoading(true);
      router.push(`/forwarding/oim/${row.F_RefNo}`);
    },
  };

  return (
    <Layout TOKEN={token} TITLE="OCEAN IMPORT" LOADING={!data || loading}>
      <div className="d-flex flex-sm-row justify-content-between">
        <div className="flex-column">
          <h3 className="dark:text-white">Ocean Import</h3>
        </div>
      </div>

      <Card className="border-0 shadow mt-3 w-auto overflow-x-auto">
        {!data ? (
          <></>
        ) : (
          <ToolkitProvider
            keyField="NUM"
            bordered={false}
            columns={column}
            data={data ? data : []}
            exportCSV
            search
          >
            {(props) => (
              <PaginationProvider pagination={paginationFactory(pageOption)}>
                {({ paginationProps, paginationTableProps }) => (
                  <div className="flex flex-col">
                    <div className="flex flex-row-reverse p-2">
                      <PaginationListStandalone {...paginationProps} />
                    </div>
                    <BootstrapTable
                      {...props.baseProps}
                      {...paginationTableProps}
                      rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer dark:bg-gray-700 dark:text-white"
                      condensed
                      bordered={false}
                      wrapperClasses="table w-auto"
                      filter={filterFactory()}
                      noDataIndication={indication}
                      rowEvents={rowEvents}
                    />
                  </div>
                )}
              </PaginationProvider>
            )}
          </ToolkitProvider>
        )}
      </Card>
    </Layout>
  );
};

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

export default Index;
