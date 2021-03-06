import Head from "next/head";
import { Container } from "reactstrap";
import { useEffect } from "react";
import Top from "./Nav";
import Sidebar from "./Side";

const Layout = (props) => {
  // Toggle sidebar
  const [toggle, setToggle] = React.useState(true);
  // State that check if the screen is mobile
  const [mobile, setMobile] = React.useState(false);
  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobile(true);
      setToggle(true);
    }
  }, []);
  // LAYOUT IS EXTREMELY IMPORTANT PAGE SINCE IT MADE UP ALL OF THE PAGES
  // 1. When there is no title props provided, title will display JW
  // 2. Link list: google font, awesome font, favicon, meta data for marketing purpose

  return (
    <>
      <Head>
        <title>{props.TITLE || "JW"}</title>
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
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <meta
          property="og:title"
          content="JAMES WORLDWIDE INC, ADDING VALUES TO YOUR CARGO!"
        ></meta>
        <meta
          name="description"
          content="James Worldwide moves your cargo in the safest and fastest way possible, keeping you informed every step of the way and providing customized and innovative solutions."
        ></meta>
        <meta
          property="og:description"
          content="James Worldwide moves your cargo in the safest and fastest way possible, keeping you informed every step of the way and providing customized and innovative solutions."
        ></meta>
        <meta property="og:url" content="https://jwiusa.com"></meta>
        <meta
          property="og:image"
          content="https://jwiusa.com/image/JLOGO.png"
        ></meta>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="stylesheet" href="/css/quill.snow.css" />
      </Head>

      <div id="wrapper">
        <Sidebar
          Token={props.TOKEN}
          toggle={toggle}
          setToggle={setToggle}
          isMobile={mobile}
        />
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Top Token={props.TOKEN} toggle={toggle} setToggle={setToggle} />
            <Container fluid>{props.children}</Container>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
