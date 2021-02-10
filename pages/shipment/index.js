import React, { useEffect, useState } from "react";
import Head from "next/head";
import Navs from "../../components/Homepage/nav";
import Footer from "../../components/Homepage/Footer";
import { Col, Container, Row } from "reactstrap";

const About = () => {
  useEffect(() => {}, []);
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
        <title>SHIPMENT</title>
      </Head>
      <main>
        <Navs />
        <img src="image/home.jpg" width="100%" />
        <Container fluid>
          <Row>
            <Col sm={2}></Col>
            <Col>
              <img
                src="/image/main/9.png"
                style={{
                  height: "auto",
                  width: "100%",
                  marginTop: "7rem",
                }}
              />
              <img
                src="/image/main/10.png"
                style={{
                  height: "auto",
                  width: "100%",
                  marginTop: "7rem",
                }}
              />
              <img
                src="/image/main/11.png"
                style={{
                  height: "auto",
                  width: "100%",
                  marginTop: "7rem",
                }}
              />
              <img
                src="/image/main/12.png"
                style={{
                  height: "auto",
                  width: "100%",
                  marginTop: "7rem",
                }}
              />
              <img
                src="/image/main/13.png"
                style={{
                  height: "auto",
                  width: "100%",
                  marginTop: "7rem",
                }}
              />
              <img
                src="/image/main/14.png"
                style={{
                  height: "auto",
                  width: "100%",
                  marginTop: "7rem",
                  marginBottom: "7rem",
                }}
              />
            </Col>
            <Col sm={2}></Col>
          </Row>
        </Container>
      </main>
      <Footer />
    </React.Fragment>
  );
};

export default About;
