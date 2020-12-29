import cookie from 'cookie';
import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment'

const Warehouse = ({Cookie, ASN}) => { 
  const router = useRouter() 
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   useEffect(()=>{
    !TOKEN && router.push("/login");
    console.log(ASN)
   }, [])

   const columns = [{
    dataField: 'F_RefNo',
    text: 'ASN',
    sort: true,
  }, {
    dataField: 'F_ReceivedDate',
    text: 'RECEIVED',
    formatter: (cell)=> (moment(cell).utc().format('LLL')),
    sort: true,
  }, {
    dataField: 'F_Remark',
    text: 'NOTE',
    sort: true,
  }, {
    dataField: 'F_Commodity',
    text: 'ITEM',
    sort: true,
  }, {
    dataField: 'F_TruckBLNo',
    text: 'CONTRAINER',
    sort: true,
  }];
  
  const defaultSorted = [{
    dataField: 'F_ID',
    order: 'desc',
  }];

   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN}>
         <h1>Warehouse</h1>

         <BootstrapTable
           hover
           keyField="F_ID"
           columns={columns}
           data={ASN}
           defaultSorted={defaultSorted}
         />
       </Layout>
     );
   } else {
     return (
       <p>Redirecting...</p>
     )
   }
}

Warehouse.getInitialProps = async ({ req }) => {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  const Get = await fetch(`${process.env.BASE_URL}api/warehouse/list`)
  const List = await Get.json();
  return {
    Cookie: cookies,
    ASN: List
  }
}

export default Warehouse;

