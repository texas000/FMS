import cookie from 'cookie';
import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router';
import Calendar from 'react-calendar';
import { Button, Card, Col, Row } from 'reactstrap';
import moment from 'moment';

const Index = ({Cookie}) => {
   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   const router = useRouter()

   // DATE STATES ON CALENDAR
   const [start, onChangeStart] = React.useState(new Date());
   const [end, onChangeEnd] = React.useState(new Date());

   useEffect(()=>{
     !TOKEN && router.push("/login");
   }, [])
   if(TOKEN && TOKEN.group) {
     return (
       <>
         <Layout TOKEN={TOKEN} TITLE="STAFF SUMMARY">
         <h3 style={{ fontFamily: "Roboto, sans-serif", fontWeight: "700" }}>
           Warehouse <span className="text-secondary">Staff Time Summary</span>
         </h3>
           <Row className="py-4 justify-content-between">
             <Col lg="9" className="col-auto mt-4" style={{paddingRight: '0'}}>
               <Card>
                 <Row className="my-4 mx-4 justify-content-between">
                   <Col>
                     <h4>STAFF WORKING TIME LOG</h4>
                     <p>
                       {moment(start).format("L")} ~ {moment(end).format("L")}
                     </p>
                   </Col>
                 </Row>
                 <Row>
                   <Col>
                     <Button
                       onClick={() => console.log(start, end)}
                       className="mx-3 my-3"
                     >
                       SUBMIT(TESTING)
                     </Button>
                   </Col>
                 </Row>
               </Card>
             </Col>
             <Col className="col-auto mt-4">
               <h4 className="text-center text-primary">START</h4>
               <Calendar
                 onChange={onChangeStart}
                 value={start}
                 className="mb-2"
               />
               <h4 className="text-center text-warning">END</h4>
               <Calendar onChange={onChangeEnd} value={end} className="mb-2" />
             </Col>
           </Row>
         </Layout>
         <style jsx>
             {`
             @font-face {
                font-family: "NEXON Lv2 Gothic";
                src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                  format("woff");
                font-weight: normal;
                font-style: normal;
              }
              h1,
              h2,
              h3,
              h4,
              h5,
              p,
              span {
                font-family: "NEXON Lv2 Gothic";
              }
             `}
         </style>
       </>
     );
   } else {
      return(<p>Redirecting...</p>)
   }
}

export async function getServerSideProps({req}) {
    const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)

    console.log(jwt.decode(cookies.jamesworldwidetoken).username+' LOADED TEMPLATE')
    // Pass data to the page via props
    return { props: { Cookie: cookies } };
  }

export default Index;

