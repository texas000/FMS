import cookie from 'cookie';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../components/Layout'
import { useRouter } from 'next/router';
import { Button, Card, Col, Input, Row, Table } from 'reactstrap';
import moment from 'moment'

const Index = ({Cookie, User}) => {
   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   const router = useRouter()
   const [password, setPassword] = React.useState(false)
   useEffect(()=>{
     !TOKEN && router.push("/login");
   }, [])
   var Admin = [], It = [], Asia = [], Lat = [], Acc = [], Wh = []
   User.map(ga=>{
     if(ga.F_GROUP<200 && ga.F_GROUP>1) {
       Admin.push(ga)
     }
     if(ga.F_GROUP>200 && ga.F_GROUP<300) {
       It.push(ga)
     }
     if(ga.F_GROUP>300 && ga.F_GROUP<400) {
       Asia.push(ga)
     }
     if(ga.F_GROUP>400 && ga.F_GROUP<500) {
       Lat.push(ga)
     }
     if(ga.F_GROUP>500 && ga.F_GROUP<600) {
       Acc.push(ga)
     }
     if(ga.F_GROUP>600 && ga.F_GROUP<700) {
       Wh.push(ga)
     }
   })

   const updatePass = async () => {
     if(password) {
       if(password.length>5) {
         const value = `F_PASSWORD='${password}' WHERE F_ACCOUNT='${TOKEN.username}'`
         const Fetch = await fetch("/api/admin/updatePassword", {body: value, method: "POST"}).then(t=> t.status)
         if (Fetch==200) {
           alert("SUCCESS")
         } else {
           alert("FAIL")
         }
       } else {
         alert("PASSWORD MUST BE OVER 6 LETTERS AND DIGITS")
       }
     } else {
       alert("PLEASE ENTER PASSWORD")
     }
   }

   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN} TITLE="USER">
         <Row>
           <Col>
             <h3
               style={{ fontFamily: "Roboto, sans-serif", fontWeight: "700" }}
             >
               User Information
             </h3>
             <p>개인정보 관리</p>
             <p className="text-right">
               Recent Login {moment(TOKEN.iat * 1000).format("LLL")}
             </p>
           </Col>
         </Row>
         <Row>
           {/* Employee Contact Information COLUMN */}
           <Col>
             <Card style={{ backgroundColor: "transparent" }}>
               <Row className="mx-4 mt-4">
                 <Col>
                   <h4>Employee Contact Information</h4>
                   <p>직원 연락망</p>
                 </Col>
               </Row>
               <Row className="mx-2">
                 <Col>
                   <div className="table-responsive">
                     <Table size="sm" bordered className="text-center">
                       <thead>
                         <tr style={{ fontSize: "0.8rem", color: "blue" }}>
                           <th>FIRST NAME</th>
                           <th>LAST NAME</th>
                           <th>EXTENSION #</th>
                           <th>TEAM</th>
                           <th>PUBLIC NUMBER</th>
                         </tr>
                       </thead>
                       <tbody style={{ fontSize: "0.8rem" }}>
                         {Admin.map((ga, i) => {
                           return (
                             <tr key={ga.F_ID}>
                               <td>{ga.F_FNAME}</td>
                               <td>{ga.F_LNAME}</td>
                               <td>{ga.F_GROUP}</td>
                               {i === 0 && (
                                 <td
                                   rowSpan={Admin.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   ADMIN
                                 </td>
                               )}
                               {i === 0 && (
                                 <td
                                   rowSpan={Admin.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   562-393-8800
                                 </td>
                               )}
                             </tr>
                           );
                         })}
                         {It.map((ga, i) => {
                           return (
                             <tr key={ga.F_ID}>
                               <td>{ga.F_FNAME}</td>
                               <td>{ga.F_LNAME}</td>
                               <td>{ga.F_GROUP}</td>
                               {i === 0 && (
                                 <td
                                   rowSpan={It.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   PRICING/IT/PPE
                                 </td>
                               )}
                               {i === 0 && (
                                 <td
                                   rowSpan={It.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   562-393-8900
                                 </td>
                               )}
                             </tr>
                           );
                         })}
                         {Asia.map((ga, i) => {
                           return (
                             <tr key={ga.F_ID}>
                               <td>{ga.F_FNAME}</td>
                               <td>{ga.F_LNAME}</td>
                               <td>{ga.F_GROUP}</td>
                               {i === 0 && (
                                 <td
                                   rowSpan={Asia.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   ASIA
                                 </td>
                               )}
                               {i === 0 && (
                                 <td
                                   rowSpan={Asia.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   562-393-8877
                                 </td>
                               )}
                             </tr>
                           );
                         })}
                         {Lat.map((ga, i) => {
                           return (
                             <tr key={ga.F_ID}>
                               <td>{ga.F_FNAME}</td>
                               <td>{ga.F_LNAME}</td>
                               <td>{ga.F_GROUP}</td>
                               {i === 0 && (
                                 <td
                                   rowSpan={Lat.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   LATIN
                                 </td>
                               )}
                               {i === 0 && (
                                 <td
                                   rowSpan={Lat.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   562-393-8899
                                 </td>
                               )}
                             </tr>
                           );
                         })}
                         {Acc.map((ga, i) => {
                           return (
                             <tr key={ga.F_ID}>
                               <td>{ga.F_FNAME}</td>
                               <td>{ga.F_LNAME}</td>
                               <td>{ga.F_GROUP}</td>
                               {i === 0 && (
                                 <td
                                   rowSpan={Acc.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   ACCOUNTING
                                 </td>
                               )}
                               {i === 0 && (
                                 <td
                                   rowSpan={Acc.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   562-304-9988
                                 </td>
                               )}
                             </tr>
                           );
                         })}
                         {Wh.map((ga, i) => {
                           return (
                             <tr key={ga.F_ID}>
                               <td>{ga.F_FNAME}</td>
                               <td>{ga.F_LNAME}</td>
                               <td>{ga.F_GROUP}</td>
                               {i === 0 && (
                                 <td
                                   rowSpan={Wh.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   WHAREHOUSE
                                 </td>
                               )}
                               {i === 0 && (
                                 <td
                                   rowSpan={Wh.length}
                                   style={{ verticalAlign: "middle" }}
                                 >
                                   562-321-5400
                                 </td>
                               )}
                             </tr>
                           );
                         })}
                       </tbody>
                     </Table>
                   </div>
                 </Col>
               </Row>
             </Card>
           </Col>
           {/* Profile Information COLUMN */}
           <Col className="mb-2">
             <Row>
               <Col sm="12">
                 <Card
                   className="mb-4"
                   style={{ backgroundColor: "transparent" }}
                 >
                   <Row className="mt-4 ml-4">
                     <Col>
                       <h4>Profile</h4>
                       <p>프로필</p>
                       <Button
                         outline
                         style={{
                           borderRadius: 0,
                           position: "absolute",
                           right: "2rem",
                           top: "0",
                         }}
                         onClick={updatePass}
                       >
                         Save
                       </Button>
                       <form>
                         <Row className="py-2">
                           <Col sm="2">
                             <label
                               style={{
                                 marginTop: "0.6em",
                                 fontSize: "0.8rem",
                               }}
                             >
                               FIRST NAME
                             </label>
                           </Col>
                           <Col>
                             <Input
                               defaultValue={TOKEN.first}
                               onChange={(e) => console.log(e.target.value)}
                               style={{
                                 backgroundColor: "transparent",
                                 border: "none",
                                 fontSize: "0.8rem",
                               }}
                             />
                           </Col>
                         </Row>
                         <Row className="py-2">
                           <Col sm="2">
                             <label
                               style={{
                                 marginTop: "0.6em",
                                 fontSize: "0.8rem",
                               }}
                             >
                               LAST NAME
                             </label>
                           </Col>
                           <Col>
                             <Input
                               value={TOKEN.last}
                               onChange={(e) => console.log(e.target.value)}
                               placeholder="NAME"
                               style={{
                                 backgroundColor: "transparent",
                                 border: "none",
                                 fontSize: "0.8rem",
                               }}
                             />
                           </Col>
                         </Row>
                         <Row className="py-2">
                           <Col sm="2">
                             <label
                               style={{
                                 marginTop: "0.6em",
                                 fontSize: "0.8rem",
                               }}
                             >
                               USER NAME
                             </label>
                           </Col>
                           <Col>
                             <Input
                               value={TOKEN.username.toUpperCase()}
                               disabled
                               onChange={(e) => console.log(e.target.value)}
                               style={{
                                 backgroundColor: "transparent",
                                 border: "none",
                                 fontSize: "0.8rem",
                               }}
                             />
                           </Col>
                         </Row>
                         <Row className="py-2">
                           <Col sm="2">
                             <label
                               style={{
                                 marginTop: "0.6em",
                                 fontSize: "0.8rem",
                               }}
                             >
                               PASSWORD
                             </label>
                           </Col>
                           <Col>
                             <Input
                               type="password"
                               placeholder="PASSWORD"
                               autoComplete="on"
                               onChange={(e) => setPassword(e.target.value)}
                               style={{
                                 backgroundColor: "transparent",
                                 border: "none",
                                 fontSize: "0.8rem",
                               }}
                             />
                           </Col>
                         </Row>
                         <Row className="mt-4">
                           <Col sm="2">
                             <label
                               style={{
                                 marginTop: "0.6em",
                                 fontSize: "0.8rem",
                               }}
                             >
                               EXTENSION
                             </label>
                           </Col>
                           <Col>
                             <Input
                               disabled={true}
                               onChange={(e) => console.log(e.target.value)}
                               defaultValue={TOKEN.group}
                               style={{
                                 backgroundColor: "transparent",
                                 border: "none",
                                 fontSize: "0.8rem",
                               }}
                             />
                           </Col>
                         </Row>
                         <Row className="py-2">
                           <Col sm="2">
                             <label
                               style={{
                                 marginTop: "0.6em",
                                 fontSize: "0.8rem",
                               }}
                             >
                               EMAIL
                             </label>
                           </Col>
                           <Col>
                             <Input
                               disabled={true}
                               onChange={(e) => console.log(e.target.value)}
                               defaultValue={TOKEN.email.toUpperCase()}
                               style={{
                                 backgroundColor: "transparent",
                                 border: "none",
                                 fontSize: "0.8rem",
                               }}
                             />
                           </Col>
                         </Row>
                         <Row className="py-2">
                           <Col sm="2">
                             <label
                               style={{
                                 marginTop: "0.6em",
                                 fontSize: "0.8rem",
                               }}
                             >
                               COMPANY
                             </label>
                           </Col>
                           <Col>
                             <Input
                               disabled={true}
                               onChange={(e) => console.log(e.target.value)}
                               defaultValue="JAMES WORLDWIDE, INC"
                               style={{
                                 backgroundColor: "transparent",
                                 border: "none",
                                 fontSize: "0.8rem",
                               }}
                             />
                           </Col>
                         </Row>
                       </form>
                     </Col>
                   </Row>
                 </Card>
               </Col>
               <Col sm="12">
                 <Card style={{ backgroundColor: "transparent" }}>
                   <Row className="mt-4 ml-4">
                     <Col>
                       <h4>Human Resource Information</h4>
                       <p style={{ fontSize: "0.9rem", paddingTop: '4rem' }}>
                         Any Idea?
                       </p>
                       <p style={{ fontSize: "0.9rem", paddingTop: '4rem' }}>
                         Contact it@jamesworldwide.com
                       </p>
                     </Col>
                   </Row>
                 </Card>
               </Col>
             </Row>
           </Col>
         </Row>
         {/* <Button className="mt-4" onClick={() => router.push("/user/account")}>
           MY ACCOUNTS
         </Button> */}
         <style jsx>
           {`
             @font-face {
               font-family: "NEXON Lv2 Gothic";
               src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                 format("woff");
               font-weight: normal;
               font-style: normal;
             }
             * {
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
    
    const FETCH = await fetch(`${process.env.BASE_URL}api/admin/getUsers`)
    const USERS = await FETCH.json();

    if(cookies.jamesworldwidetoken) {
      console.log(jwt.decode(cookies.jamesworldwidetoken).username+' loaded user')
    }
    // Pass data to the page via props
    return { props: { Cookie: cookies, User: USERS } };
  }

export default Index;

