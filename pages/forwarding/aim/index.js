import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../../components/Layout";
import { useRouter } from "next/router";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import { Card, Row, Col, Button } from "reactstrap";
import moment from "moment";

const Index = ({ Cookie, Result }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();

  function indication() {
    return (
      <span className="font-weight-bold">
        You do not have Air Import at the moment
        {/* {router.query.search
          ? `Your search "${router.query.search}" did not match any documents.`
          : `Please search something`} */}
      </span>
    );
  }

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
    };
    return (
      <li className="page-item" key={page}>
        <a
          href="#"
          onClick={handleClick}
          className={
            active ? "btn btn-sm btn-info text-xs" : "btn btn-sm text-xs"
          }
        >
          {page}
        </a>
      </li>
    );
  };

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2 text-xs text-secondary">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const customSizePerPage = [
    { page: 10, text: "10" },
    { page: 50, text: "50" },
    { page: 100, text: "100" },
    { page: 200, text: "200" },
    { page: 300, text: "300" },
  ];

  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange,
  }) => (
    <div className="btn-group" role="group">
      {customSizePerPage.map((option) => {
        const isSelect = currSizePerPage === `${option.page}`;
        return (
          <Button
            key={option.text}
            onClick={() => onSizePerPageChange(option.page)}
            size="sm"
            color={isSelect ? "secondary" : "primary"}
            className="text-xs"
            outline
          >
            {option.text}
          </Button>
        );
      })}
    </div>
  );

  const headerSortingStyle = { backgroundColor: "#c9d5f5" };

  const column = [
    {
      dataField: "aimmain.RefNo",
      text: "REF",
      formatter: (cell) => <a href="#">{cell}</a>,
      events: {
        onClick: (e, columns, columnIndex, row) => {
          router.push(
            `/forwarding/aim/[Detail]`,
            `/forwarding/aim/${row.aimmain.RefNo}`
          );
        },
      },
      classes:
        "text-xs text-center text-truncate text-uppercase font-weight-bold",
      headerClasses: "text-xs text-primary text-center align-middle px-4",
      sort: true,
      filter: textFilter({
        className: "text-xs d-none d-md-block",
      }),
      headerSortingStyle,
    },
    {
      dataField: "aihmain.Customer_SName",
      text: "CUSTOMER",
      classes: "text-xs text-truncate",
      headerClasses: "text-xs w-25 text-primary text-center align-middle px-4",
      sort: true,
      filter: textFilter({
        className: "text-xs",
      }),
      headerSortingStyle,
    },
    {
      dataField: "aimmain.MawbNo",
      text: "MBL",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses: "text-xs text-primary text-center align-middle",
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "aihmain.HawbNo",
      text: "HBL",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses: "text-xs text-primary text-center align-middle",
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "aihmain.Shipper_SName",
      text: "SHIPPER",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses: "text-xs text-primary text-center align-middle",
      hidden: true,
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "aimmain.ETD",
      text: "ETD",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses: "text-xs text-primary text-center align-middle",
      sort: true,
      headerSortingStyle,
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return (
              <div className="text-gray-500">{moment(cell).format("L")}</div>
            );
          } else {
            return (
              <div className="text-success">{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "aimmain.ETA",
      text: "ETA",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses: "text-xs text-primary text-center align-middle",
      sort: true,
      headerSortingStyle,
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return (
              <div className="text-gray-500">{moment(cell).format("L")}</div>
            );
          } else {
            return (
              <div className="text-success">{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "aimmain.PostDate",
      text: "POST",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses: "text-xs text-primary text-center align-middle",
      sort: true,
      headerSortingStyle,
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return (
              <div className="text-gray-500">{moment(cell).format("L")}</div>
            );
          } else {
            return (
              <div className="text-success">{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "aimmain.U2ID",
      text: "PIC",
      classes: "text-xs text-truncate text-uppercase",
      headerClasses: "text-xs text-primary px-4 align-middle",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs",
      }),
    },
  ];

  useEffect(() => {
    !TOKEN && router.push("/login");
  }, []);
  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN}>
        <div className="d-flex flex-sm-row justify-content-between">
          <div className="flex-column">
            <h3 className="mb-4 forwarding font-weight-light">Air Import</h3>
          </div>
        </div>
        <div className="d-lg-none">
          <div className="list-group">
            {Result.length !== 0 ? (
              Result.map((ga) => (
                <a
                  href="#"
                  key={ga.aihmain.ID}
                  onClick={() => {
                    router.push(
                      `/forwarding/aim/[Detail]`,
                      `/forwarding/aim/${ga.aimmain.RefNo}`
                    );
                  }}
                  className="list-group-item list-group-item-action text-xs text-truncate"
                >
                  <span className="text-primary font-weight-bold">
                    {ga.aimmain.RefNo}
                  </span>
                  <i className="fa fa-arrow-right text-success mx-2"></i>
                  <span className="font-weight-light">
                    {ga.aihmain.Customer_SName}
                  </span>
                  <i className="fa fa-arrow-right text-warning mx-2"></i>
                  <span className="text-uppercase">{ga.aimmain.U2ID}</span>
                </a>
              ))
            ) : (
              <div
                className="alert alert-secondary text-capitalize"
                role="alert"
              >
                you do not have air import at the moment
              </div>
            )}
          </div>
        </div>
        <Card className="bg-transparent border-0 d-none d-lg-block">
          <Row>
            {/* DISPLAY SEARCH RESULT */}
            <ToolkitProvider
              keyField="aihmain.ID"
              bordered={false}
              columns={column}
              data={Result}
              exportCSV
              search
            >
              {(props) => (
                <Col>
                  <BootstrapTable
                    {...props.baseProps}
                    hover
                    striped
                    condensed
                    wrapperClasses="table-responsive"
                    filter={filterFactory()}
                    noDataIndication={indication}
                    pagination={paginationFactory({
                      showTotal: true,
                      pageButtonRenderer,
                      paginationTotalRenderer: customTotal,
                      sizePerPageRenderer,
                    })}
                  />
                </Col>
              )}
            </ToolkitProvider>
          </Row>
        </Card>
      </Layout>
    );
  } else {
    return <p>Redirecting...</p>;
  }
};

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  if (jwt.decode(cookies.jamesworldwidetoken) !== null) {
    const { fsid } = jwt.decode(cookies.jamesworldwidetoken);
    var result = [];
    const fetchSearch = await fetch(
      `${process.env.FS_BASEPATH}aimmain_leftjoin_aihmain?PIC=${fsid}&etaFrom=&etaTo=&etdFrom=&etdTo=&casestatus=`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );
    if (fetchSearch.status === 200) {
      result = await fetchSearch.json();
    }

    return { props: { Cookie: cookies, Result: result } };
  } else {
  }
}

export default Index;
