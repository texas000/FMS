import cookie from "cookie";
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

const About = () => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);

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
        <title>James Worldwide Inc.</title>
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
        <Container>
          <Row className="my-5">
            <Col sm="12" md={{ size: 6, offset: 3 }} className="text-center">
              {/* <h4 className="text-muted mb-4">WE MOVE</h4> */}
              <h1 className="text-muted">WE MOVE</h1>
            </Col>
          </Row>
          <Row className="text-center my-4">
            <Col lg="4">
              <span className="fa-stack fa-2x mb-4">
                <i
                  className="fa fa-circle fa-stack-2x"
                  style={{ color: "#e74a3b" }}
                ></i>
                <i className="fa fa-anchor fa-stack-1x fa-inverse"></i>
              </span>
              <h3 className="mb-4">OCEAN FREIGHT</h3>
              <p
                className="text-muted"
                style={{ fontSize: "1.4rem", lineHeight: "3rem" }}
              >
                As a licensed Ocean Transportation and world-class Non-Vessel
                Operating Common Carrier (NVOCC), James Worldwide provides full
                ocean freight services to create the most highly adaptable,
                reliable and customizable solutions in the industry.
              </p>
            </Col>
            <Col lg="4">
              <span className="fa-stack fa-2x mb-4">
                <i
                  className="fa fa-circle fa-stack-2x"
                  style={{ color: "#4e73df" }}
                ></i>
                <i className="fa fa-plane fa-stack-1x fa-inverse"></i>
              </span>
              <h3 className="mb-4">AIR FREIGHT</h3>
              <p
                className="text-muted"
                style={{ fontSize: "1.4rem", lineHeight: "3rem" }}
              >
                As an International Air Transport Association (IATA) agent for
                all major airlines, James Worldwide provides a complete
                solutions of air logistics for shipments around the globe and
                for a wide variety of commodities and industries.
              </p>
            </Col>
            <Col lg="4">
              <span className="fa-stack fa-2x mb-4">
                <i
                  className="fa fa-circle fa-stack-2x"
                  style={{ color: "#1cc88a" }}
                ></i>
                <i className="fa fa-truck fa-stack-1x fa-inverse"></i>
              </span>
              <h3 className="mb-4">TRUCKING</h3>
              <p
                className="text-muted"
                style={{ fontSize: "1.4rem", lineHeight: "3rem" }}
              >
                Our commitment to on-time and safe transportation of your cargo
                has enabled James Worldwide to excel as an industry leader. Our
                fleet provides local, regional and long haul trucking services
                to meet your needs.
              </p>
            </Col>
          </Row>
          <hr style={{ margin: "5rem" }} />
          {/* SECOND ROW */}
          <Row className="py-4">
            <Col lg="5" className="text-right">
              <div>
                <h5 className="text-muted mb-4">OUTSTANDING SERVICES</h5>
                <h2>WE SHIP</h2>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "1.4rem",
                    lineHeight: "3rem",
                  }}
                >
                  We handle shipments of a wide variety of commodities including
                  but not limited to those shown here. Our highly experienced
                  comprehensive resolution forecasts every scenario to minimize
                  risk, implementing all aspects of transportation.
                </p>
              </div>
            </Col>
            <Col lg="7" className="text-center">
              <img
                src="./image/home-slider-01.jpg"
                className="img-fluid mx-auto"
                style={{
                  overflow: "hidden",
                  height: "400px",
                  width: "400px",
                  objectFit: "cover",
                }}
              />
            </Col>
          </Row>

          <Row className="py-4">
            <Col style={{ padding: "0" }} lg="5">
              <img
                src="https://jamesworldwide.com/wp-content/uploads/2018/02/bg-ship-18.jpg"
                className="img-fluid mx-auto"
                style={{
                  overflow: "hidden",
                  height: "400px",
                  width: "400px",
                  objectFit: "cover",
                }}
              />
            </Col>
            <Col lg="7" className="text-left">
              <div className="pt-4 pl-4 ml-4 mt-4 mr-4">
                <h5 className="text-muted mb-4">SERVICE PRODUCTS</h5>
                <h2>GARMENT</h2>
                <p
                  className="text-muted"
                  style={{
                    fontSize: "1.4rem",
                    lineHeight: "3rem",
                  }}
                >
                  The fashion and wearing apparel industry has leading-edge
                  customers who require speed in a market with a high-turnover
                  fashion cycle, which forces companies to strive to be first to
                  market or face significant inventory buildup and markdowns.
                </p>
              </div>
            </Col>
          </Row>
          <hr style={{ margin: "5rem" }} />
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
        </Container>
        <Footer />
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

export default About;
