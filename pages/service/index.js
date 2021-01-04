import cookie from 'cookie';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import Head from "next/head";
import Navs from '../../components/Homepage/nav';
import Footer from '../../components/Homepage/Footer';
import { Col, Container, Row } from 'reactstrap';

const About = ({Cookie}) => { 
  const router = useRouter() 
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   useEffect(()=>{
    !TOKEN && router.push("/login");
   }, [])
   
   if(TOKEN && TOKEN.group) {
     return (
       <React.Fragment>
         <Head>
            <link
             href="https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i"
             rel="stylesheet"
           />
           <link
             rel="stylesheet"
             href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
             integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
             crossOrigin="anonymous"
           />
           <title>ABOUT</title>
         </Head>
         {/* <div style={{backgroundImage: `url("image/home.jpg")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'top center', fontWeight: '20'}}> */}
         <main>
           <Navs />
           <img src="image/home.jpg" width="100%" />
             <Container fluid>
               <Row>
                 <Col sm={2}></Col>
                 <Col>
                   <img
                     src="/image/main/4.png"
                     style={{
                       height: "auto",
                       width: "100%",
                       marginTop: "7rem",
                     }}
                   />
                   <img
                     src="/image/main/5.png"
                     style={{
                       height: "auto",
                       width: "100%",
                       marginTop: "7rem",
                     }}
                   />
                   <img
                     src="/image/main/6.png"
                     style={{
                       height: "auto",
                       width: "100%",
                       marginTop: "7rem",
                     }}
                   />
                   <img
                     src="/image/main/7.png"
                     style={{
                       height: "auto",
                       width: "100%",
                       marginTop: "7rem",
                     }}
                   />
                   <img
                     src="/image/main/8.png"
                     style={{
                       height: "auto",
                       width: "100%",
                       marginTop: "7rem",
                       marginBottom: '7rem'
                     }}
                   />
                 </Col>
                 <Col sm={2}></Col>
               </Row>
               <Footer />
             </Container>
         </main>
         {/* </div> */}
       </React.Fragment>
     );
   } else {
     return (
       <p>Redirecting...</p>
     )
   }
}

About.getInitialProps = async ({ req }) => {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  return {
    Cookie: cookies
  }
}

export default About;

