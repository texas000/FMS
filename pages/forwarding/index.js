import cookie from "cookie";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import Layout from "../../components/Layout";
import { Button, Card, Col, Input, Row } from "reactstrap";
import { useRouter } from "next/router";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";
import moment from "moment";

const Index = ({ Cookie, Re }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [search, setSearch] = useState(false);

  function indication() {
    return (
      <span>
        {router.query.search
          ? `Your search "${router.query.search}" did not match any documents.`
          : `Please search something`}
      </span>
    );
  }

  const getResult = async () => {
    // SET THE QUERY AT THE PATH - base/forwarding?query.search -> LOAD DATA FROM SERVER SIDE
    router.push({ pathname: `/forwarding`, query: { search } });
  };

  useEffect(() => {
    !TOKEN && router.push("/login");
  }, []);

  const headerSortingStyle = { backgroundColor: "#c9d5f5" };

  const column = [
    {
      dataField: "RefNO",
      text: "REF",
      formatter: (cell) => <a href="#">{cell}</a>,
      events: {
        onClick: (e, columns, columnIndex, row) => {
          row.MASTER_TABLE == "T_OIMMAIN" &&
            router.push(
              `/forwarding/oim/[Detail]`,
              `/forwarding/oim/${row.RefNO}`
            );
          row.MASTER_TABLE == "T_OOMMAIN" &&
            router.push(
              `/forwarding/oex/[Detail]`,
              `/forwarding/oex/${row.RefNO}`
            );
          row.MASTER_TABLE == "T_AIMMAIN" &&
            router.push(
              `/forwarding/aim/[Detail]`,
              `/forwarding/aim/${row.RefNO}`
            );
          row.MASTER_TABLE == "T_AOMMAIN" &&
            router.push(
              `/forwarding/aex/[Detail]`,
              `/forwarding/aex/${row.RefNO}`
            );
          row.MASTER_TABLE == "T_GENMAIN" &&
            router.push(
              `/forwarding/other/[Detail]`,
              `/forwarding/other/${row.RefNO}`
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
      dataField: "CUSTOMER",
      text: "CUSTOMER",
      classes: "text-xs text-truncate",
      headerClasses:
        "text-x w-25 text-white bg-primary text-center align-middle pb-0 font-weight-light",
      sort: true,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      headerSortingStyle,
    },
    {
      dataField: "MASTER_BLNO",
      text: "MBL",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "HOUSE_BLNO",
      text: "HBL",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "SHIPPER",
      text: "SHIPPER",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      hidden: true,
      sort: true,
      headerSortingStyle,
    },
    {
      dataField: "ETD",
      text: "ETD",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      sort: true,
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
      dataField: "ETA",
      text: "ETA",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      sort: true,
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
      dataField: "POSTDATE",
      text: "POST",
      classes: "text-xs text-truncate font-weight-light",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
      sort: true,
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
      dataField: "U2ID",
      text: "PIC",
      classes: "text-xs text-truncate text-uppercase",
      headerClasses:
        "text-x text-white bg-primary text-center align-middle pb-0 font-weight-light",
      sort: true,
      headerSortingStyle,
      filter: textFilter({
        className: "text-xs bg-primary text-white border-0",
      }),
    },
  ];

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

  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN} TITLE="Forwarding">
        <div className="d-flex flex-sm-row justify-content-between">
          <div className="flex-column">
            <h3 className="mb-4 forwarding font-weight-light">Forwarding</h3>
          </div>
          {/* PLEASE DONT DELETE THIS COMMENT!!!! */}
          {/* <div className="flex-column">
            <Input
              title="searchs"
              className="border-1 small mx-1"
              placeholder="Search for reference.."
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key == "Enter") getResult();
              }}
              style={{ width: "38vw" }}
              autoFocus={true}
            />
          </div>
          <div className="flex-column">
            <Button
              color="primary"
              onClick={getResult}
              disabled={!search}
              className="search-button"
              outline
              size="sm"
            >
              Search
            </Button>
          </div> */}
        </div>
        {/* hide on screens wider than lg */}
        {/* display only 100 result only for mobile view */}
        <div className="d-lg-none">
          <div className="list-group my-2">
            {Re.length !== 0 ? (
              Re.map(
                (ga, i) =>
                  i < 100 && (
                    <a
                      href="#"
                      key={ga.RowNo}
                      onClick={() => {
                        ga.MASTER_TABLE == "T_OIMMAIN" &&
                          router.push(
                            `/forwarding/oim/[Detail]`,
                            `/forwarding/oim/${ga.RefNO}`
                          );
                        ga.MASTER_TABLE == "T_OOMMAIN" &&
                          router.push(
                            `/forwarding/oex/[Detail]`,
                            `/forwarding/oex/${ga.RefNO}`
                          );
                        ga.MASTER_TABLE == "T_AIMMAIN" &&
                          router.push(
                            `/forwarding/aim/[Detail]`,
                            `/forwarding/aim/${ga.RefNO}`
                          );
                        ga.MASTER_TABLE == "T_AOMMAIN" &&
                          router.push(
                            `/forwarding/aex/[Detail]`,
                            `/forwarding/aex/${ga.RefNO}`
                          );
                        ga.MASTER_TABLE == "T_GENMAIN" &&
                          router.push(
                            `/forwarding/other/[Detail]`,
                            `/forwarding/other/${ga.RefNO}`
                          );
                      }}
                      className="list-group-item list-group-item-action text-xs text-truncate"
                    >
                      <span className="text-primary font-weight-bold">
                        {ga.RefNO}
                      </span>
                      <i className="fa fa-arrow-right text-success mx-2"></i>
                      <span>{ga.CUSTOMER}</span>
                      <i className="fa fa-arrow-right text-warning mx-2"></i>
                      <span>{ga.U2ID}</span>
                    </a>
                  )
              )
            ) : (
              <div
                className="alert alert-secondary text-capitalize"
                role="alert"
              >
                No result
              </div>
            )}
          </div>
        </div>

        {/* display on screens wider than lg */}
        <Card className="bg-transparent border-0 d-none d-lg-block">
          <Row>
            {/* DISPLAY SEARCH RESULT */}
            <ToolkitProvider
              keyField="RowNo"
              bordered={false}
              columns={column}
              data={Re}
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
        <style global jsx>
          {`
            .page-link {
              border-radius: 0;
            }
            .search-button {
              padding-top: 8px !important;
              padding-bottom: 8px !important;
            }
             {
              /* @media screen and (max-width: 768px) {
              .search-button {
                display: none;
              } 
            } */
            }
             {
              /* .react-bootstrap-table table {
              table-layout: auto !important;
            } */
            }
            .react-bootstrap-table-sort-order {
              display: none;
            }
            .order {
              display: none;
            }
            .table thead th {
              vertical-align: top;
            }
          `}
        </style>
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
        Re: [],
      },
    };
  } else {
    var result = [];
    // API VERSION VERSION 3
    // {
    //   headers: { "X-API-KEY": process.env.JWT_KEY },
    // }
    const fetchSearch = await fetch(
      `${process.env.FS_BASEPATH}fmssearch?key=${query.search}&casestatus=&`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );
    if (fetchSearch.status === 200) {
      result = await fetchSearch.json();
    }
    return {
      props: {
        Cookie: cookies,
        Re: result,
      },
    };
  }
}

export default Index;
