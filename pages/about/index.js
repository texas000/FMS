import React, { useEffect, useState } from "react";
import Head from "next/head";
import Navs from "../../components/Homepage/nav";
import Footer from "../../components/Homepage/Footer";
import { Col, Container, Row } from "reactstrap";

const About = () => {
  useEffect(() => {
    if (navigator.userAgent.search("Chrome")) {
      const title = `Message for testing purpose`;
      const option = {
        icon: "/image/JLOGO.png",
        body: "Hey there! How do you want the notificationg",
      };
      if (Notification.permission != "granted")
        Notification.requestPermission();
      else {
        const noti = new Notification(title, option);
        noti.onclick = function () {
          window.open("https://jwiusa.com");
        };
      }
    }
  }, []);
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
              <h1 style={{ paddingTop: "5rem", fontWiehgt: "1000" }}>
                JAMES WORLDWIDE
              </h1>
              {/* <hr className="my-4" /> */}
              <p className="lead mt-4" style={{ lineHeight: "150%" }}>
                James Worldwide has been a leading international NVOCC, freight
                forwarder, and total logistics company since its establishment
                in 2005. We help make businesses flow by applying our renowned
                operational expertise to create customized logistics and supply
                chain solutions to meet our customers’ needs in the most
                effective and efficient way possible. “Adding Value to Your
                Cargo” is our slogan. Through continuous innovation and passion,
                James Worldwide has been providing clients with not only highly
                competitive rates and high quality of service, but also
                innovative solutions that go far beyond the expectations of
                traditional freight forwarding. We take full advantage of our
                globalized digital network with affiliated branches throughout
                Latin America, Asia, and the United States, allowing us to offer
                the fastest, safest, and most affordable shipping routes. Now
                ranked as one of the top 5 forwarders in services between Latin
                America and the United States, James Worldwide has seen rapid
                and consistent growth over the recent years. With this strong
                foundation, we are poised to expand our influence and reach into
                global shipping. In the past few years alone, our businesses
                from Asia have grown substantially to match those of Latin
                America in volume. Our team of dedicated, world-class logistics
                professionals in all areas of freight handling, including ocean,
                air shipping, trucking, railroad, warehousing, project cargo,
                and 3PL management, is always ready to answer your questions and
                provide you with viable answers to the most challenging supply
                chain questions. James Worldwide has and will always prioritize
                the needs of its clients while striving to become a global
                leader in the logistics industry.
              </p>
              <img
                src="/image/main/3.png"
                style={{ height: "auto", width: "100%", marginTop: "7rem" }}
              />
              <img
                src="/image/main/17.png"
                style={{ height: "auto", width: "100%", marginTop: "7rem" }}
              />
              <img
                src="/image/main/19.png"
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
        <Footer />
      </main>
    </React.Fragment>
  );
};

export default About;
