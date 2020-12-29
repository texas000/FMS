import cookie from 'cookie';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../components/Layout'
import { useRouter } from 'next/router';
import BootstrapTable from 'react-bootstrap-table-next';
import AddUser from '../../components/Admin/AddUser'
import cellEditFactory from 'react-bootstrap-table2-editor';
import { Row, Col } from 'reactstrap';

const About = ({Cookie, Users}) => { 
  const router = useRouter() 
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)

  useEffect(()=>{
    !TOKEN && router.push("/login");
    // console.log(Users)
  }, [])

   const columns = [
     {
       dataField: "F_ACCOUNT",
       text: "ID",
       sort: true,
       align: 'center', 
       headerStyle: {width: '10%', textAlign: 'center'},
     },
     {
       dataField: "F_FNAME",
       text: "FIRST NAME",
       align: 'center', 
       headerStyle: {width: '10%', textAlign: 'center'},
       sort: true,
     },
     {
       dataField: "F_LNAME",
       text: "LAST NAME",
       align: 'center', 
       headerStyle: {width: '10%', textAlign: 'center'},
       sort: true,
     },
     {
       dataField: "F_GROUP",
       text: "EXTENSION",
       align: 'center', 
       headerStyle: {width: '10%', textAlign: 'center'},
       sort: true,
     },
     {
      dataField: "F_FSID",
      text: "FS USER",
      align: 'center', 
      headerStyle: {width: '8%', textAlign: 'center'},
      sort: true,
    },
     {
      dataField: "F_EMAIL",
      text: "EMAIL",
      sort: true,
      formatter: (cell) => (cell&&<a href={`mailto:${cell}`} target="__blank">{cell.toUpperCase()}</a>)
    }
   ];
  const defaultSorted = [{
    dataField: 'F_ID',
    order: 'desc',
  }];

  const selectRow = {
    mode: 'radio',
    clickToSelect: false,
    headerColumnStyle: {width: '40px'},
  };

   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN}>
         <h1>Users</h1>
         <Row className="justify-content-md-end mr-1">
           <AddUser />
         </Row>
         <Row>
           <Col>
             <BootstrapTable
               hover
               keyField="F_ID"
               columns={columns}
               defaultSorted={defaultSorted}
               data={Users}
               selectRow={selectRow}
               cellEdit={cellEditFactory({
                 mode: TOKEN.group===1 && 'click',
                 nonEditableRows: () => [5],
                 afterSaveCell: async (oldValue, newValue, row) => {
                  console.log('PRV VALUE: '+oldValue)
                  console.log('NEW VALUE: '+newValue)
                  var Query = ''
                  Query += `F_FSID='${row.F_FSID}' WHERE F_ID='${row.F_ID}'`
                  const fetchs = await fetch("/api/admin/editUsers", {method: 'POST', body: Query});
                  fetchs.status===200 && console.log("UPDATED")
                 }
               })}
             />
           </Col>
         </Row>
       </Layout>
     );
   } else {
     return (
       <p>Redirecting...</p>
     )
   }
}

export async function getServerSideProps({req, query}) {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  const FETCH = await fetch(`${process.env.BASE_URL}api/admin/getUsers`)
  const USERS = await FETCH.json();

  // Pass data to the page via props
  return { props: { Cookie: cookies, Users: USERS} };
}

export default About;

