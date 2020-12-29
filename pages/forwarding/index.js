import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import Layout from "../../components/Layout";
import { Badge, Button, Card, Col, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Spinner } from "reactstrap";
import { useRouter } from "next/router";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import paginationFactory from 'react-bootstrap-table2-paginator';
import moment from "moment";

const Index = ({ Cookie, Re }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [search, setSearch] = useState(false);

  function indication() {
    return (
      <span>
        {router.query.search ? (
          `Your search "${router.query.search}" did not match any documents.`
        ) : (
          `Please search something`
        )}
      </span>
    );
  }

  const getResult = async () => {
    // SET THE QUERY AT THE PATH - base/forwarding?query.search -> LOAD DATA FROM SERVER SIDE 
    router.push({ pathname: `/forwarding`, query: { search } });
  };

  useEffect(() => {
    !TOKEN && router.push("/login");
    // console.log(Re)
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
      formatter: (cell) => <a href="#" style={{fontSize: '0.9em'}}>{cell}</a>,
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
      sort: true,
    },
    {
      dataField: "SHIPPER",
      text: "SHIPPER",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem", textAlign: "center" },
      sort: true,
    },
    {
      dataField: "POSTDATE",
      text: "POST",
      style: columnStyle,
      sort: true,
      headerStyle: { width: "7%", fontSize: "0.8em", textAlign: "center" },
      formatter: (cell) => {
        if (moment(cell).isSameOrBefore(moment())) {
          return (
            <div style={{ color: "gray" }}>{moment(cell).format("L")}</div>
          );
        } else {
          return (
            <div style={{ color: "blue" }}>{moment(cell).format("L")}</div>
          );
        }
      },
    },
    {
      dataField: "ETD",
      text: "ETD",
      style: columnStyle,
      sort: true,
      headerStyle: { width: "7%", fontSize: "0.8em", textAlign: "center" },
      formatter: (cell) => {
        if (moment(cell).isSameOrBefore(moment())) {
          return (
            <div style={{ color: "gray" }}>{moment(cell).format("L")}</div>
          );
        } else {
          return (
            <div style={{ color: "blue" }}>{moment(cell).format("L")}</div>
          );
        }
      },
    },
    {
      dataField: "ETA",
      text: "ETA",
      style: columnStyle,
      sort: true,
      headerStyle: { width: "7%", fontSize: "0.8em", textAlign: "center" },
      formatter: (cell) => {
        if (moment(cell).isSameOrBefore(moment())) {
          return (
            <div style={{ color: "gray" }}>{moment(cell).format("L")}</div>
          );
        } else {
          return (
            <div style={{ color: "blue" }}>{moment(cell).format("L")}</div>
          );
        }
      },
    },
    {
      dataField: "U1ID",
      text: "PIC",
      style: columnStyle,
      headerStyle: { fontSize: "0.8rem", width: "6%", textAlign: "center" },
      sort: true,
    },
  ];

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ml-2 text-secondary">
      Showing { from } to { to } of { size } Results
    </span>
  );

  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange
  }) => (
    <div className="btn-group" role="group">
      {
        options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <Button
              key={ option.text }
              type="button"
              onClick={ () => onSizePerPageChange(option.page) }
              style={{borderRadius: '0'}}
              size="sm"
              className={ `btn mb-2 ${isSelect ? 'btn-secondary' : 'btn-info'}` }
            >
              { option.text }
            </Button>
          );
        })
      }
    </div>
  );

  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN} TITLE="FORWARDING">
        <h3 className="mb-4 forwarding">
          Forwarding Search
        </h3>
        {/* SERACH BAR */}
        <Row className="mb-4">
          <Col>
            <Input
              title="search"
              placeholder="SEARCH OCEAN, AIR, OTHERS"
              bsSize="sm"
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => {
                if (e.key == "Enter") getResult();
              }}
              style={{
                width: "100%",
                borderRadius: "24px",
                paddingLeft: "38px",
                paddingTop: "20px",
                paddingBottom: "20px",
              }}
              autoFocus={true}
            />
            <i className="fa fa-search"></i>
          </Col>
          <Col>
            <Button
              color="primary"
              onClick={getResult}
              disabled={!search}
              className="search-button"
              outline
            >
              Search
            </Button>
          </Col>
        </Row>
        {/* SEARCH BAR END */}
        <Row>
          {/* DISPLAY SEARCH RESULT */}          
          <ToolkitProvider
            keyField="RowNo"
            bordered={false}
            columns={column}
            wrapperClasses="table-responsive"
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
                  noDataIndication={indication}
                  pagination={paginationFactory({
                    showTotal: true,
                    paginationTotalRenderer: customTotal,
                    sizePerPageRenderer
                  })}
                />
              </Col>
            )}
          </ToolkitProvider>
        </Row>
        <style global jsx>
          {`
            @font-face {
              font-family: "NEXON Lv2 Gothic";
              src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                format("woff");
              font-weight: normal;
              font-style: normal;
            }
            .forwarding {
              font-family: "NEXON Lv2 Gothic";
            }
            * {
              font-family: "Roboto";
            }
            .page-link {
              border-radius: 0;
            }
            .fa-search {
              position: absolute;
              top: 12px;
              left: 30px;
            }
            .search-button {
              padding-top: 10px !important;
              padding-bottom: 10px !important;
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
  
  const searchResult = await fetch(
    `${process.env.BASE_URL}api/forwarding/freightStreamSearch`,
    {
      headers: {
        query: query.search || false,
        name:
          cookies.jamesworldwidetoken &&
          jwt.decode(cookies.jamesworldwidetoken).username,
        options: [
          "CUSTOMER",
          "MASTER_BLNO",
          "CUSTOMER",
          "CONSIGNEE",
          "SHIPPER",
          "MASTER_BLNO",
          "HOUSE_BLNO",
          "RefNO",
        ],
      },
    }
  ).then(t=>{
    if(t.status===200) {
      return t.json()
    } else {
      return []
    }
  }).catch(err=>{
    console.log(err)
    return []
  });
  if(cookies.jamesworldwidetoken) {
    console.log(jwt.decode(cookies.jamesworldwidetoken).username+` loaded forwarding${Object.keys(query).length? "/"+query.search : ""}`)
  }
  // Pass data to the page via props
  return { props: { Cookie: cookies, Re: searchResult } };
}

export default Index;
