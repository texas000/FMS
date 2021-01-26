import cookie from "cookie";
import React, { useEffect, useState } from "react";
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

const Index = ({ Cookie, Re, Notifications, Result }) => {
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
    // console.log(Re);
    if (typeof window !== "undefined") {
      localStorage.setItem("notifications", JSON.stringify(Notifications));
    }
  }, []);

  const columnStyle = {
    fontSize: "0.8em",
    textAlign: "left",
    verticalAlign: "middle",
    wordWrap: "break-word",
  };
  const column = [
    {
      dataField: "RefNO",
      text: "REF",
      formatter: (cell) => (
        <a href="#" style={{ fontSize: "0.9em" }}>
          {cell}
        </a>
      ),
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
      style: { textAlign: "center", width: "10%" },
      headerStyle: { fontSize: "0.8rem", width: "10%", textAlign: "center" },
      sort: true,
      filter: textFilter(),
    },
    {
      dataField: "CUSTOMER",
      text: "CUSTOMER",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem", textAlign: "center" },
      sort: true,
    },
    {
      dataField: "MASTER_BLNO",
      text: "MBL",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem", textAlign: "center" },
      sort: true,
    },
    {
      dataField: "HOUSE_BLNO",
      text: "HBL",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem", textAlign: "center" },
      sort: true,
    },
    {
      dataField: "CUSTOMER",
      text: "CUSTOMER",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem", textAlign: "center" },
      hidden: true,
      sort: true,
    },
    {
      dataField: "SHIPPER",
      text: "SHIPPER",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem", textAlign: "center" },
      hidden: true,
      sort: true,
    },
    {
      dataField: "POSTDATE",
      text: "POST",
      style: columnStyle,
      sort: true,
      headerStyle: { fontSize: "0.8em", textAlign: "center" },
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
      dataField: "ETD",
      text: "ETD",
      style: columnStyle,
      sort: true,
      headerStyle: { fontSize: "0.8em", textAlign: "center" },
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
      style: columnStyle,
      sort: true,
      headerStyle: { fontSize: "0.8em", textAlign: "center" },
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
      // dataField: "U1ID",
      text: "PIC",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem", width: "8%", textAlign: "center" },
      sort: true,
      filter: textFilter(),
    },
  ];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2 text-secondary">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange,
  }) => (
    <div className="btn-group" role="group">
      {options.map((option) => {
        const isSelect = currSizePerPage === `${option.page}`;
        return (
          <Button
            key={option.text}
            type="button"
            onClick={() => onSizePerPageChange(option.page)}
            style={{ borderRadius: "0" }}
            size="sm"
            className={`btn mb-2 ${isSelect ? "btn-secondary" : "btn-info"}`}
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
          className={active ? "btn btn-info" : "btn"}
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
            <h3 className="mb-4 forwarding">Forwarding</h3>
          </div>
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
        {/* SERACH BAR */}
        {/* SEARCH BAR END */}
        <Card className="bg-transparent border-0">
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
                    defaultSorted={[
                      {
                        dataField: "POSTDATE",
                        order: "desc",
                      },
                    ]}
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
            .react-bootstrap-table table {
              table-layout: auto !important;
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
  var noti = [];
  if (cookies.jamesworldwidetoken) {
    const notification = await fetch(
      `${process.env.BASE_URL}api/forwarding/navbarNotification`,
      {
        headers: {
          uid: jwt.decode(cookies.jamesworldwidetoken).fsid,
          key: cookies.jamesworldwidetoken,
        },
      }
    );
    noti = await notification.json();
  }

  // console.time("prev");
  // const resultFetch = await fetch(
  //   `${process.env.BASE_URL}api/forwarding/freightStreamSearch`,
  //   {
  //     headers: {
  //       query: query.search,
  //       key: cookies.jamesworldwidetoken,
  //     },
  //   }
  // );
  // const ReResult = await resultFetch.json();
  // console.timeEnd("prev");
  // if (resultFetch.status === 200) {
  //   // Pass data to the page via props
  //   return {
  //     props: {
  //       Cookie: cookies,
  //       Re: ReResult,
  //       Notifications: noti,
  //     },
  //   };
  // } else {
  //   // Pass data to the page via props
  //   return { props: { Cookie: cookies, Re: [], Notifications: noti } };
  // }

  if (query.search === undefined) {
    return {
      props: {
        Cookie: cookies,
        Re: [],
        Notifications: noti,
      },
    };
  } else {
    var result = [];
    // console.time("fecth_time");
    const fetchSearch = await fetch(
      `http://jameswi.com:49996/api/fmssearch?key=${query.search}&casestatus=&`
    );
    if (fetchSearch.status === 200) {
      result = await fetchSearch.json();
    }
    // const result = await test.json();
    // console.timeEnd("fecth_time");
    return {
      props: {
        Cookie: cookies,
        Re: result,
        Notifications: noti,
      },
    };
  }
}

export default Index;
