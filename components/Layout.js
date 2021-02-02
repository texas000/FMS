import Head from "next/head";
import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
import Sidebar from "./Side";
import { Container, Row } from "reactstrap";
import { useEffect } from "react";
import Top from "./Nav";

const Layout = (props) => {
  const [toggle, setToggle] = React.useState(true);
  const [mobile, setMobile] = React.useState(false);
  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobile(true);
      setToggle(true);
    }
  }, []);

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
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css" />
      </Head>

      {/* <Navbar name={props.TOKEN && props.TOKEN.username.toUpperCase()} /> */}

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
