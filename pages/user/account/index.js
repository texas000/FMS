import cookie from 'cookie';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router';
import fetch from 'node-fetch';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit'
import { Alert, Button, ButtonGroup, Card, CardBody, CardHeader, Col, Container, Input, Label, Row } from 'reactstrap';

const Index = ({Cookie, Ocean}) => { 
  const router = useRouter() 
  const [Search, setSearch] = useState();
  const [Result, setResult] = useState(false);
  const [FontSize, setFontSize] = useState(12);
  const [cSelected, setCSelected] = useState(['MBL', 'REF', 'VESSEL', 'VOYAGE', 'LOADING', 'DISCHARGE', 'PIC', 'ACCOUNT', 'SHIPPER']);

  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   useEffect(()=>{
    !TOKEN && router.push("/login");
    console.log(Ocean)
    setResult(Ocean)
   }, [])

   async function getResult() {
    const fetchs = await fetch("/api/forwarding/search", {headers: {query: Search, name: TOKEN.username, options: cSelected}});
    const ocean = await fetchs.json();
    setResult(ocean)
   }

   const onCheckboxBtnClick = (selected) => {
    const index = cSelected.indexOf(selected);
    if (index < 0) {
      cSelected.push(selected);
    } else {
      cSelected.splice(index, 1);
    }
    setCSelected([...cSelected]);
  }
   const Options = [{
     name: 'MBL',
     number: 1
   }, {
    name: 'REF',
    number: 2
   }, {
     name: 'VESSEL',
     number: 3
   }, {
    name: 'VOYAGE',
    number: 4
  }, {
    name: 'LOADING',
    number: 5
  }, {
    name: 'DISCHARGE',
    number: 6
  }, {
    name: 'PIC',
    number: 7
  }, {
    name: 'ACCOUNT',
    number: 8
  }, {
    name: 'SHIPPER',
    number: 9
  }]

  const columnStyle = {
    fontSize: FontSize, textAlign: 'center', wordWrap: 'break-word'
  }

  const Acolumns = [
    {
      dataField: "REF",
      text: "REF",
      formatter: (cell) => (
        <a href="#" onClick={() => router.push(`/forwarding/ocean/${cell}`)}>
          {cell}
        </a>
      ),
      style: { fontSize: FontSize, fontWeight: "bold", textAlign: "center", width: '10%' },
      headerStyle: {width: '5%', fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "ACCOUNT",
      text: "ACCOUNT",
      style: columnStyle,
      headerStyle: {fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "SHIPPER",
      text: "SHIPPER",
      style: columnStyle,
      headerStyle: {fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "MBL",
      text: "MBL",
      style: columnStyle,
      headerStyle: {width: '9%', fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "HBL",
      text: "HBL",
      style: columnStyle,
      headerStyle: {width: '7%', fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "VESSEL",
      text: "VESSEL",
      style: columnStyle,
      headerStyle: {width: '8%', fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "VOYAGE",
      text: "VOYAGE",
      style: columnStyle,
      headerStyle: {width: '4%', fontSize: FontSize-1, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "LOADING",
      text: "LOADING",
      style: columnStyle,
      headerStyle: {width: '7%', fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "DISCHARGE",
      text: "DISCHARGE",
      style: columnStyle,
      headerStyle: {width: '7%', fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "DEST",
      text: "DEST",
      style: columnStyle,
      headerStyle: {width: '7%', fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "PIC",
      text: "PIC",
      style: columnStyle,
      headerStyle: {width: '5%', fontSize: FontSize, textAlign: 'center'},
      sort: true,
    },
    {
      dataField: "ETA",
      text: "ETA",
      style: columnStyle,
      sort: true,
      headerStyle: {width: '5%', fontSize: FontSize, textAlign: 'center'},
      formatter: (cell) => {
        if (moment(cell).isSameOrBefore(moment())) {
          return (
            <span style={{ color: "red" }}>
              {moment(cell).endOf("day").fromNow()}
            </span>
          );
        } else {
          return (
            <span style={{ color: "blue" }}>
              {moment(cell).endOf("day").fromNow()}
            </span>
          );
        }
      },
    },
    {
      dataField: "ETD",
      text: "ETD",
      style: columnStyle,
      sort: true,
      headerStyle: {width: '5%', fontSize: FontSize, textAlign: 'center'},
      formatter: (cell) => {
        if (moment(cell).isSameOrBefore(moment())) {
          return (
            <span style={{ color: "red" }}>
              {moment(cell).endOf("day").fromNow()}
            </span>
          );
        } else {
          return (
            <span style={{ color: "blue" }}>
              {moment(cell).endOf("day").fromNow()}
            </span>
          );
        }
      },
    }
  ];

   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN}>
         <h1>MY ACCOUNT</h1>
         <Container fluid>
           <Row className="mt-4">
             {Result &&
               (Result.result ? (
                 <Col sm={12}>
                   <Card className="mb-4">
                     <CardBody>
                       <BootstrapTable
                         hover
                         keyField="F_ID"
                         columns={Acolumns}
                         data={Result.ocean}
                       />
                     </CardBody>
                   </Card>
                 </Col>
               ) : (
                 <Col className="mb-4">
                   <Alert color="danger">No result found</Alert>
                 </Col>
               ))}
           </Row>
         </Container>
         <style global jsx>
           {`
             .reference {
               color: black !important;
             }
             .fa-search {
                position: absolute;
                top: 7px;
                left: 30px;
             }
           `}
         </style>
       </Layout>
     );
   } else {
     return (
       <p>Redirecting...</p>
     )
   }
}

export async function getServerSideProps({req}) {
  // Fetch data from external API
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  const fetchs = await fetch(`${process.env.BASE_URL}api/forwarding/oimsrcUser`, {
    headers: { name: jwt.decode(cookies.jamesworldwidetoken).fsid },
  });
  const ocean = await fetchs.json();

  // Pass data to the page via props
  return { props: { Cookie: cookies, Ocean: ocean } };
}

export default Index;

