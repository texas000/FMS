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
          className={active ? "btn btn-info" : "btn"}
        >
          {page}
        </a>
      </li>
    );
  };

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2 text-secondary">
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
            type="button"
            onClick={() => onSizePerPageChange(option.page)}
            style={{ borderRadius: "0" }}
            size="sm"
            className={`btn ${isSelect ? "btn-secondary" : "btn-warning"}`}
          >
            {option.text}
          </Button>
        );
      })}
    </div>
  );

  const headerSortingStyle = { backgroundColor: "#c9d5f5" };
  const columnStyle = {
    fontSize: "0.8em",
    textAlign: "left",
    verticalAlign: "middle",
    wordWrap: "break-word",
  };

  const column = [
    {
      dataField: "aimmain.RefNo",
      text: "REF",
      formatter: (cell) => (
        <a href="#" className="text-uppercase">
          {cell}
        </a>
      ),
      events: {
        onClick: (e, columns, columnIndex, row) => {
          router.push(
            `/forwarding/aim/[Detail]`,
            `/forwarding/aim/${row.aimmain.RefNo}`
          );
        },
      },
      style: { textAlign: "center", width: "10%" },
      headerStyle: { fontSize: "0.8rem", width: "10%" },
      sort: true,
      filter: textFilter({
        className: "text-xs d-none d-md-block",
      }),
      headerSortingStyle,
    },
    {
      dataField: "aihmain.Customer_SName",
      text: "CUSTOMER",
      style: columnStyle,
      headerStyle: {
        fontSize: "0.8rem",
      },
      sort: true,
      filter: textFilter({
        className: "text-xs",
      }),
      headerSortingStyle,
    },
    {
      dataField: "aimmain.MawbNo",
      text: "MBL",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem" },
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "aihmain.HawbNo",
      text: "HBL",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem" },
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "aihmain.Shipper_SName",
      text: "SHIPPER",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem" },
      hidden: true,
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "aimmain.ETD",
      text: "ETD",
      style: columnStyle,
      sort: true,
      headerStyle: { fontSize: "0.8em" },
      headerSortingStyle,
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return (
              <div style={{ color: "gray" }}>{moment(cell).format("L")}</div>
            );
          } else {
            return (
              <div style={{ color: "blue" }}>{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "aimmain.ETA",
      text: "ETA",
      style: columnStyle,
      sort: true,
      headerStyle: { fontSize: "0.8em" },
      headerSortingStyle,
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return (
              <div style={{ color: "gray" }}>{moment(cell).format("L")}</div>
            );
          } else {
            return (
              <div style={{ color: "blue" }}>{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "aimmain.PostDate",
      text: "POST",
      style: columnStyle,
      sort: true,
      headerStyle: { fontSize: "0.8em" },
      headerSortingStyle,
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return (
              <div style={{ color: "gray" }}>{moment(cell).format("L")}</div>
            );
          } else {
            return (
              <div style={{ color: "blue" }}>{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "aimmain.U2ID",
      // dataField: "U1ID",
      text: "PIC",
      style: columnStyle,
      classes: "text-uppercase",
      headerStyle: {
        fontSize: "0.8rem",
        width: "8%",
      },
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs d-none d-md-block",
      }),
    },
  ];

  useEffect(() => {
    !TOKEN && router.push("/login");
    console.log(Result);
  }, []);
  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN}>
        <div className="d-flex flex-sm-row justify-content-between">
          <div className="flex-column">
            <h3 className="mb-4 forwarding">Air Import</h3>
          </div>
        </div>
        <Card className="bg-transparent border-0">
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
      `http://jameswi.com:49996/api/aimmain_leftjoin_aihmain?PIC=${fsid}&etaFrom=&etaTo=&etdFrom=&etdTo=&casestatus=`
    );
    if (fetchSearch.status === 200) {
      result = await fetchSearch.json();
    }

    return { props: { Cookie: cookies, Result: result } };
  } else {
  }
}

export default Index;
