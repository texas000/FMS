import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Carousel,
  CarouselIndicators,
  CarouselItem,
  Container,
  Row,
  Col,
  Button,
} from "reactstrap";
import Navs from "../components/Homepage/nav";
import Footer from "../components/Homepage/Footer";

const items = [
  {
    src: "./video/ocean.mp4",
    altText: "Adding Values to Your Cargo!",
    caption: "James Worldwide moves your cargo in the fastest way passible",
  },
  {
    src: "./video/pier.mp4",
    altText: "No. 1 Latin America's Global Forwarder",
    caption:
      "We provide reqular import and export services between the U.S.A and Latin America for transport by air and ocean",
  },
  {
    src: "./video/terminal.mp4",
    altText: "One-Stop Logistic Solution",
    caption:
      "Differentiated 3rd Party Logistics Services to Add Values to Your Cargo",
  },
];

const About = ({ Cookie }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
    console.log(!!window.chrome.webstore || !!window.chrome.runtime);
  }, []);

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.altText}
        style={{ overflow: "hidden" }}
      >
        <video
          playsInline
          autoPlay
          muted
          loop
          style={{
            position: "absolute",
            right: "0",
            bottom: "0",
            minWidth: "100%",
            minHeight: "100%",
          }}
        >
          <source src={item.src} type="video/mp4" />
        </video>
        <div className="carousel-caption">
          <h2 className="font-weight-bold">{item.altText}</h2>
          <p className="h5 font-weight-light">{item.caption}</p>
        </div>
        {/* <CarouselCaption className="" captionText={item.caption} captionHeader={item.altText}/> */}
      </CarouselItem>
    );
  });
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
        <title>HOME</title>
      </Head>
      <main className="loader">
        <Navs />
        <Carousel
          activeIndex={activeIndex}
          next={next}
          previous={previous}
          interval={10000}
          style={{ height: "100%" }}
        >
          <CarouselIndicators
            items={items}
            activeIndex={activeIndex}
            onClickHandler={goToIndex}
          />
          {slides}
          <a
            className="carousel-control-prev"
            href="#"
            data-slide="prev"
            onClick={previous}
          >
            {/* style={{
                top: "45%",
                width: "100px",
                height: "100px",
                paddingRight: "150px",
              }} */}
            <span className="carousel-control-prev-icon mb-4 d-none d-md-block">
              PREV
            </span>
            <br />
            <span className="carousel-arrow-prev d-none d-md-block"></span>
          </a>

          <a
            className="carousel-control-next"
            href="#"
            data-slide="next"
            onClick={next}
          >
            {/* style={{
                 top: "45%",
                 width: "100px",
                 height: "100px",
                 paddingRight: "150px",
               }} */}
            <span className="carousel-control-next-icon mb-4 d-none d-md-block">
              NEXT
            </span>
            <br />
            <span className="carousel-arrow-next d-none d-md-block"></span>
          </a>
        </Carousel>
        {/* NO fluid */}
        <Container fluid style={{ paddingTop: "10rem" }}>
          <Row style={{ paddingBottom: "5rem" }}>
            <Col sm="12" md={{ size: 6, offset: 3 }} className="text-center">
              {/* <h4 className="text-muted mb-4">WE MOVE</h4> */}
              <h1 className="text-muted">WE MOVE</h1>
            </Col>
          </Row>
          {/* <Row>
               <Col lg="4">
                 <Card className="h-100">
                   <CardImg top width="700" src="image/icons/money-bag-1.svg" />
                   <CardBody>
                     <h4 className="card-title">Project One</h4>
                     <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
                   </CardBody>
                 </Card>
               </Col>
               <Col lg="4">
                 <Card className="h-100">
                   <CardImg top width="700" src="image/icons/money-bag-1.svg" />
                   <CardBody>
                     <h4 className="card-title">Project One</h4>
                     <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
                   </CardBody>
                 </Card>
               </Col>
               <Col lg="4">
                 <Card className="h-100">
                   <CardImg top width="700px" height="400px" src="image/icons/money-bag-1.svg" alt />
                   <CardBody>
                     <h4 className="card-title">Project One</h4>
                     <p className="card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae.</p>
                   </CardBody>
                 </Card>
               </Col>
             </Row> */}
          <Row
            className="mt-4"
            style={{ paddingLeft: "6rem", paddingRight: "6rem" }}
          >
            <Col
              lg="3"
              className="text-center mt-2 mb-4 pl-4 pr-4 border-right"
            >
              <img
                src="./image/icons/money-bag-1.svg"
                width="50em"
                height="50em"
                className="mb-4"
              />
              <h3 className="text-center mb-4">INCREASE REVENUE</h3>
              <p
                className="text-center text-muted"
                style={{ fontSize: "1.4rem", lineHeight: "3rem" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
                nobis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
            </Col>
            <Col
              lg="3"
              className="text-center mt-2 mb-4 pl-4 pr-4 border-right"
            >
              <img
                src="./image/icons/bar-chart-7.svg"
                width="50em"
                height="50em"
                className="mb-4"
              />
              <h3 className="text-center mb-4">ANALYTICS</h3>
              <p
                className="text-center text-muted"
                style={{ fontSize: "1.4rem", lineHeight: "3rem" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
                nobis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
            </Col>
            <Col
              lg="3"
              className="text-center mt-2 mb-4 pl-4 pr-4 border-right"
            >
              <img
                src="./image/icons/loader_1.svg"
                width="50em"
                height="50em"
                className="mb-4"
              />
              <h3 className="text-center mb-4">3 YEARS EXPERIENCE</h3>
              <p
                className="text-center text-muted"
                style={{
                  fontSize: "1.4rem",
                  lineHeight: "3rem",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
                nobis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
            </Col>
            <Col lg="3" className="text-center mt-2 mb-4 pl-4 pr-4">
              <img
                src="./image/icons/truck_2.svg"
                width="50em"
                height="50em"
                className="mb-4"
              />
              <h3 className="text-center mb-4">FREE PACKAGE</h3>
              <p
                className="text-center text-muted"
                style={{ fontSize: "1.4rem", lineHeight: "3rem" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
                nobis? Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
            </Col>
          </Row>

          {/* SECOND ROW */}
          <Row
            style={{
              marginTop: "10rem",
              paddingLeft: "6rem",
              paddingRight: "6rem",
            }}
          >
            <Col style={{ padding: "0" }} lg="6">
              <img
                src="./image/home-slider-01.jpg"
                height="auto"
                width="100%"
              />
            </Col>
            <Col style={{ padding: "0" }} lg="6">
              <div className="pt-4 pl-4 ml-4 mt-4 mr-4">
                <h5 className="text-muted mb-4">OUTSTANDING SERVICES</h5>
                <h2>CLEAN DESIGN</h2>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "1.4rem",
                    lineHeight: "3rem",
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Eaque, nobis? Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit.Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Eaque, nobis? Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit.
                </p>
              </div>
            </Col>
          </Row>

          <Row
            style={{
              paddingLeft: "6rem",
              paddingRight: "6rem",
              paddingBottom: "5rem",
            }}
          >
            <Col style={{ padding: "0" }} lg="6">
              <div className="pt-4 pl-4 ml-4 mt-4 mr-4">
                <h5 className="text-muted mb-4">OUTSTANDING SERVICES</h5>
                <h1>CLEAN DESIGN</h1>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "1.4rem",
                    lineHeight: "3rem",
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Eaque, nobis? Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit.Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Eaque, nobis? Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit.
                </p>
              </div>
            </Col>
            <Col style={{ padding: "0" }} lg="6">
              <img
                src="./image/home-slider-01.jpg"
                height="auto"
                width="100%"
              />
            </Col>
          </Row>

          {/* THRID ROW */}
          <Row
            style={{
              paddingLeft: "6rem",
              paddingRight: "6rem",
              paddingTop: "8rem",
            }}
          >
            <Col lg={6}>
              <img
                className="img-thumbnail"
                src="https://preview.colorlib.com/theme/neos/images/img_1.jpg"
              />
            </Col>
            <Col lg={6}>
              <h3 className="pb-4">FREE TEMPLATES BY JAMES WORLDWIDE</h3>
              <p
                className="text-muted"
                style={{
                  fontSize: "1.4rem",
                  lineHeight: "3rem",
                }}
              >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eaque,
                nobis? Lorem ipsum dolor sit amet, consectetur adipisicing
                elit.Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Eaque, nobis? Lorem ipsum dolor sit amet, consectetur
                adipisicing elit.
              </p>
            </Col>
          </Row>
          <Row
            style={{
              paddingLeft: "6rem",
              paddingRight: "6rem",
              paddingTop: "8rem",
              paddingBottom: "6rem",
            }}
          >
            <Col lg={12}>
              <h2 className="text-center mb-4 pb-4">RECENT NEWS</h2>
            </Col>
            <Col lg={4}>
              <div className="ml-4 mr-4">
                <img
                  src="https://preview.colorlib.com/theme/neos/images/img_1.jpg"
                  width="95%"
                  height="auto"
                />
                <h5 className="mt-4">NEWS ABOUT COVID-19</h5>
                <p
                  className="text-muted"
                  style={{
                    lineHeight: "3rem",
                  }}
                >
                  By James â€” Jan. 20, 2019
                </p>
                <p
                  className="text-muted"
                  style={{
                    lineHeight: "3rem",
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Fuga, voluptate. Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Eaque, nobis? Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit.Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. Eaque, nobis? Lorem ipsum dolor
                  sit amet, consectetur adipisicing elit.
                </p>
              </div>
            </Col>
            <Col lg={4}>
              <div className="ml-4 mr-4">
                <img
                  src="https://preview.colorlib.com/theme/neos/images/img_2.jpg"
                  width="95%"
                  height="auto"
                />
                <h5 className="mt-4">NEWS ABOUT COVID-19</h5>
                <p
                  className="text-muted"
                  style={{
                    lineHeight: "3rem",
                  }}
                >
                  By James â€” Jan. 20, 2019
                </p>
                <p
                  className="text-muted"
                  style={{
                    lineHeight: "3rem",
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Fuga, voluptate. Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Eaque, nobis? Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit.Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. Eaque, nobis? Lorem ipsum dolor
                  sit amet, consectetur adipisicing elit.
                </p>
              </div>
            </Col>
            <Col lg={4}>
              <div className="ml-4 mr-4">
                <img
                  src="https://preview.colorlib.com/theme/neos/images/img_3.jpg"
                  width="95%"
                  height="auto"
                />
                <h5 className="mt-4">NEWS ABOUT COVID-19</h5>
                <p
                  className="text-muted"
                  style={{
                    lineHeight: "3rem",
                  }}
                >
                  By James â€” Jan. 20, 2019
                </p>
                <p
                  className="text-muted"
                  style={{
                    lineHeight: "3rem",
                  }}
                >
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Fuga, voluptate. Lorem ipsum dolor sit amet, consectetur
                  adipisicing elit. Eaque, nobis? Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit.Lorem ipsum dolor sit amet,
                  consectetur adipisicing elit. Eaque, nobis? Lorem ipsum dolor
                  sit amet, consectetur adipisicing elit.
                </p>
              </div>
            </Col>
          </Row>

          {/* FOOTER UP */}
          <Row
            style={{
              backgroundColor: "#02b875",
              paddingTop: "5rem",
              paddingBottom: "6rem",
            }}
          >
            <Col lg={12}>
              <h2 className="text-white text-center mb-4">
                TRY FOR YOUR NEXT PROJECT
              </h2>
            </Col>
            <Col lg={12} style={{ textAlign: "center" }}>
              <Button
                style={{
                  backgroundColor: "transparent",
                  color: "white",
                  borderRadius: "0",
                  border: "3px solid #fff",
                  fontWeight: "600",
                }}
              >
                CONTACT US
              </Button>
            </Col>
          </Row>
          <Footer />
        </Container>
      </main>
      <div className="loader-wrapper">
        <span className="loader">
          <span className="loader-inner"></span>
        </span>
      </div>
      <style global jsx>
        {`
           {
            /* Hide Previous Icons */
          }
          .carousel-control-prev-icon {
            position: absolute !important;
            background-image: none !important;
            padding-left: 5rem !important;
            left: 0 !important;
          }
           {
            /* Hide Next Icon */
          }
          .carousel-control-next-icon {
            position: absolute !important;
            background-image: none !important;
            padding-right: 8rem !important;
            right: 0 !important;
          }
          @media (max-width: 576) {
            .carousel-control-next-icon {
              position: absolute !important;
              background-image: none !important;
              padding-right: 8rem !important;
              right: 0 !important;
            }
          }
           {
            /* Carousel Slide Height */
          }
          .carousel,
          .carousel-item,
          .carousel-item.active {
            height: 100vh;
          }
           {
            /* Carousel Arrow */
          }
          .carousel-arrow-prev {
            top: 50%;
            left: 0;
            width: 10rem;
            height: 20px;
            border-bottom: 8px solid #fff;
            border-right: 12px solid transparent;
            position: absolute;
            transition: width 0.2s ease-in;
          }
          .carousel-control-prev:hover > .carousel-arrow-prev {
            left: 0;
            top: 50%;
            width: 5rem;
            height: 20px;
            position: absolute;
          }
          .carousel-arrow-next {
            top: 50%;
            right: 0;
            width: 10rem;
            height: 20px;
            border-bottom: 8px solid #fff;
            border-left: 12px solid transparent;
            position: absolute;
            transition: width 0.2s ease-in;
          }
          .carousel-control-next:hover > .carousel-arrow-next {
            right: 0;
            top: 50%;
            width: 5rem;
            height: 20px;
            position: absolute;
          }
           {
            /* Arrow Effect End */
          }
           {
            /* Video Effect */
          }
          .carousel-item video {
            filter: brightness(50%);
          }
           {
            /* Main page wording */
          }
          .carousel-caption {
            position: absolute;
            top: 50% !important;
            height: 100%;
          }
           {
            /* width: 75%; */
          }
           {
            /* .carousel-indicators li {
               margin-left: 7px;
               margin-right: 7px;
               width: 18px;
               height: 18px;
               border-radius: 100%;
             } */
          }
          ::placeholder {
            color: gray !important;
          }
        `}
      </style>
    </React.Fragment>
  );
};

About.getInitialProps = async ({ req }) => {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  console.log(req.headers["user-agent"]);  
  return {
    Cookie: cookies,
  };
};

export default About;
