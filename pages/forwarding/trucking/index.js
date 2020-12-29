import cookie from 'cookie';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../components/Layout';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Button, Row, Col, Table, Input, Alert } from 'reactstrap';
import { useRouter } from 'next/router';


const Index = ({Cookie}) => { 
   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   useEffect(()=>{
    !TOKEN && router.push("/login");
  }, [])

   const [Search, setSearch] = useState(false)
   const [Result, setResult] = useState(false)
   const [Warning, setWarning] = useState(false)
   const [Select, setSelect] = useState([])
   const router = useRouter()
   const columns = [
     {
       dataField: "F_PORT",
       text: "PORT",
       headerStyle: { width: '10%', fontFamily: "NEXON Lv2 Gothic" }, 
       style: {fontFamily: "NEXON Lv2 Gothic"},
       align: 'center',
       headerAlign: 'center',
       sort: true
     },
     {
      dataField: "F_COMPANY",
      text: "COMPANY",
      headerStyle: { width: '15%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
     },
     {
       dataField: "F_EMAIL",
       text: "EMAIL",
       headerStyle: { width: '15%', fontFamily: "NEXON Lv2 Gothic" },
       style: {fontFamily: "NEXON Lv2 Gothic"},
       headerAlign: 'center',
       sort: true,
       hidden: TOKEN && TOKEN.group>212 ? true : false,
     }, 
     {
       dataField: "F_TYPE",
       text: "TYPE",
       headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
       style: {fontFamily: "NEXON Lv2 Gothic"},
       headerAlign: 'center',
       sort: true
     },
     {
      dataField: "F_PIC",
      text: "PIC",
      headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
    },
     {
      dataField: "F_DG",
      text: "DG",
      headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
    },
    {
      dataField: "F_OVERWEIGHT",
      text: "OW",
      headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
    },
     {
      dataField: "F_RF",
      text: "RF",
      headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
    },
    {
      dataField: "F_20MAX",
      text: "20M",
      headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
    },
    {
      dataField: "F_40MAX",
      text: "40M",
      headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
    },
    {
      dataField: "F_20TRI_AXLE",
      text: "20TR",
      headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
    },
    {
      dataField: "F_40OW",
      text: "20OW",
      headerStyle: { width: '5%', fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      headerAlign: 'center',
      sort: true
    },
     {
      dataField: "F_REMARK",
      headerStyle: { fontFamily: "NEXON Lv2 Gothic" },
      style: {fontFamily: "NEXON Lv2 Gothic"},
      text: "NOTE",
      headerAlign: 'center',
      sort: true
    },
   ];

   const handleOnSelectAll = (isSelect) => {
    if(isSelect) {
      setSelect(Result)
    } else {
      setSelect([])
    }
  }

  const handleOnSelect = (row, isSelect) => {
    if(isSelect) {
      setSelect(prev=> [...prev, row])
    } else {
      setSelect(Select.filter(x=> x!==row))
    }
  }

  const selectRow = {
    mode: 'checkbox',
    onSelect: handleOnSelect,
    onSelectAll: handleOnSelectAll,
    clickToSelect: false,
    headerColumnStyle: { width: '39px', textAlign: 'center' },
    bgColor: '#00BFFF',
  };

  async function getResult() {
    const fetchs = await fetch("/api/trucking/search", {headers: {query: Search}});
    //IF SUCCESS SET RESULT
    if(fetchs.status===200) {
      setSelect([])
      setWarning(false)
      const truck = await fetchs.json();
      setResult(truck)
    } else {
      setSelect([])
      setResult(false)
      setWarning(true)
    }
   }

   const mailBCC = Select.map(ga=>(ga.F_EMAIL))
   const mailSubject = `[JW] DRAYAGE INQUIRY; ${Search && Search.toUpperCase()} PORT - `
   const mailBody = `All,
   \nPlease advise the drayage rate for below;
   Import shipment / Legal weight
   From: ${Search && Search.toUpperCase()} PORT
   Delivery To:`

   const emailHref = `mailto:${TOKEN && TOKEN.first} ${TOKEN &&TOKEN.last} [JW] <${TOKEN&&TOKEN.email}>?bcc=${mailBCC}&subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN} TITLE="TRUCKING">
         <h3 style={{ fontFamily: "Roboto, sans-serif", fontWeight: "700" }}>
           Trucking <span className="text-secondary">Management</span>
         </h3>
         <Row className="justify-content-md-end">
           <a href={emailHref} target="__blank">
             <Button
               className="mr-3"
               color="primary"
               style={{
                 borderRadius: 0,
               }}
               disabled={Select.length == 0}
               
             >
               <i className="fa fa-envelope pb-1"></i>
             </Button>
           </a>
         </Row>
         <Row className="justify-content-md-center">
           <Col lg="6" className="search">
             <Input
               title="search"
               bsSize="sm"
               style={{
                 borderRadius: "24px",
                 paddingLeft: "38px",
                 paddingTop: "20px",
                 paddingBottom: "20px",
               }}
               placeholder="SEARCH PORT"
               onChange={(e) => setSearch(e.target.value)}
               onKeyPress={(e) => {
                 if (e.key == "Enter") getResult();
               }}
               autoFocus={true}
             />
             <i className="fa fa-search"></i>
           </Col>
         </Row>
         {Warning && (
           <Row className="mt-4">
             <Col>
               <Alert color="warning">NO DATA FOUND</Alert>
             </Col>
           </Row>
         )}
         <Row className="mt-4">
           <Col>
             {Result && (
               <BootstrapTable
                 keyField="F_ID"
                 data={Result}
                 columns={columns}
                 selectRow={selectRow}
                 rowStyle={{ fontSize: "12px" }}
                 cellEdit={cellEditFactory({
                   mode: TOKEN.group<213 && 'click',
                   afterSaveCell: async (oldValue, newValue, row) => {
                    console.log('PRV VALUE: '+oldValue)
                    console.log('NEW VALUE: '+newValue)
                    var Query = ''
                    Query += `F_COMPANY='${row.F_COMPANY}', F_EMAIL='${row.F_EMAIL}', F_PIC='${row.F_PIC}', F_TYPE='${row.F_TYPE}', F_DG='${row.F_DG}', F_OVERWEIGHT='${row.F_OVERWEIGHT}', F_RF='${row.F_RF}', F_20MAX='${row.F_20MAX}', F_20TRI_AXLE='${row.F_20TRI_AXLE}', F_40MAX='${row.F_40MAX}', F_40OW='${row.F_40OW}', F_REMARK=N'${row.F_REMARK}', F_PORT='${row.F_PORT}' WHERE F_ID='${row.F_ID}'`
                    const fetchs = await fetch("/api/trucking/update", {method: 'POST', body: Query});
                    console.log(fetchs.status)
                    }
                 })}
               />
             )}
           </Col>
         </Row>
         <style jsx>
           {`
             .fa-search {
                position: absolute;
                top: 12px;
                left: 30px;
             }
           @font-face {
               font-family: "NEXON Lv2 Gothic";
               src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                 format("woff");
               font-weight: normal;
               font-style: normal;
             }
             h1 {
               font-family: "NEXON Lv2 Gothic";
             }
           `}
         </style>
       </Layout>
     );
   } else {
      return(<p>Redirecting...</p>)
   }
}

export async function getServerSideProps({req}) {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  
  //LOG
  if(cookies.jamesworldwidetoken) {
  console.log(jwt.decode(cookies.jamesworldwidetoken).username+' loaded forwarding/trucking')
  }
  return { props: { Cookie: cookies } };
}

export default Index;

