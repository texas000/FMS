import "@blueprintjs/core/lib/css/blueprint.css";
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

const Index = ({ Cookie }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();

  const [Result, setResult] = useState([]);

  async function getOther() {
    const others = await fetch("/api/forwarding/other/getList", {
      headers: {
        key: Cookie.jamesworldwidetoken,
      },
    }).then(async (j) => await j.json());
    setResult(others);
  }

  // User Either have or not have OIM cases, when not have cases, display the indication
  function indication() {
    return (
      <span>
        <span className="text-danger">No Other</span> at the moment
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
      dataField: "F_RefNo",
      text: "REF",
      formatter: (cell) => <a href="#">{cell}</a>,
      events: {
        onClick: (e, columns, columnIndex, row) => {
          router.push(
            `/forwarding/other/[Detail]`,
            `/forwarding/other/${row.F_RefNo}`
          );
        },
      },
      classes:
        "text-xs text-center text-truncate text-uppercase font-weight-bold",
      headerClasses:
        "text-x text-white text-center align-middle px-4 bg-primary pb-0 font-weight-light",
      sort: true,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      headerSortingStyle,
    },
    {
      dataField: "Customer",
      text: "CUSTOMER",
      classes: "text-xs text-truncate",
      headerClasses:
        "text-x w-25 text-white bg-primary text-center align-middle pb-0 font-weight-light",
      sort: true,
      filter: textFilter({
        className: "text-xs w-100 bg-primary text-white border-0",
      }),
      headerSortingStyle,
    },
    {
      dataField: "F_Mblno",
      text: "MBL",
      classes: "text-xs text-truncate",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      sort: true,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      headerSortingStyle,
    },
    {
      dataField: "F_Hblno",
      text: "HBL",
      classes: "text-xs text-truncate",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      sort: true,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      headerSortingStyle,
    },
    {
      dataField: "F_ETD",
      text: "ETD",
      classes: "text-xs text-truncate",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return moment(cell).format("L");
          } else {
            return (
              <div className="text-primary">{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "F_ETA",
      text: "ETA",
      classes: "text-xs text-truncate",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return moment(cell).format("L");
          } else {
            return (
              <div className="text-primary">{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "F_PostDate",
      text: "POST",
      classes: "text-xs text-truncate",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      formatter: (cell) => {
        if (cell) {
          if (moment(cell).isSameOrBefore(moment())) {
            return moment(cell).format("L");
          } else {
            return (
              <div className="text-primary">{moment(cell).format("L")}</div>
            );
          }
        }
      },
    },
    {
      dataField: "F_U2ID",
      text: "EDITOR",
      classes: "text-xs text-truncate text-uppercase",
      headerClasses:
        "text-x text-center text-white bg-primary px-4 align-middle pb-0 font-weight-light",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
    },
  ];

  useEffect(() => {
    !TOKEN && router.push("/login");
    getOther();
    // In the dev mode, show result in the console.
    // console.log(Result);
  }, []);
  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN} TITLE="OTHER">
        <div className="d-flex flex-sm-row justify-content-between">
          <div className="flex-column">
            <h3 className="mb-4 forwarding font-weight-light">Other</h3>
          </div>
        </div>
        <div className="d-lg-none">
          <div className="list-group">
            {Result.length !== 0 ? (
              Result.map((ga) => (
                <a
                  href="#"
                  key={ga.ID}
                  onClick={() => {
                    router.push(
                      `/forwarding/other/[Detail]`,
                      `/forwarding/other/${ga.RefNo}`
                    );
                  }}
                  className="list-group-item list-group-item-action text-xs text-truncate"
                >
                  <span className="text-primary font-weight-bold">
                    {ga.RefNo}
                  </span>
                  <i className="fa fa-arrow-right text-success mx-2"></i>
                  <span className="font-weight-light">{ga.Customer_SName}</span>
                  <i className="fa fa-arrow-right text-warning mx-2"></i>
                  <span className="text-uppercase">{ga.U2ID}</span>
                </a>
              ))
            ) : (
              <div
                className="alert alert-secondary text-capitalize"
                role="alert"
              >
                you do not have other at the moment
              </div>
            )}
          </div>
        </div>

        <Card className="bg-transparent border-0 d-none d-lg-block">
          <Row>
            <ToolkitProvider
              keyField="F_ID"
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
                    wrapperClasses="table-responsive rounded"
                    bordered={false}
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
  return { props: { Cookie: cookies } };
  // if (jwt.decode(cookies.jamesworldwidetoken) !== null) {
  //   const { fsid } = jwt.decode(cookies.jamesworldwidetoken);
  //   var result = [];
  //   const fetchSearch = await fetch(
  //     `${process.env.FS_BASEPATH}genmain?PIC=${fsid}&etaFrom=&etaTo=&etdFrom=&etdTo=&casestatus=`,
  //     {
  //       headers: { "x-api-key": process.env.JWT_KEY },
  //     }
  //   );
  //   if (fetchSearch.status === 200) {
  //     result = await fetchSearch.json();
  //   }

  //   return { props: { Cookie: cookies, Result: result } };
  // } else {
  //   return { props: { Cookie: cookies, Result: [] } };
  // }
}

export default Index;
