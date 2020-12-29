import Head from "next/head";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Container, Row } from "reactstrap";
import{ useEffect } from 'react'

const Layout = (props) => {
  const [mobile, setMobile] = React.useState(false)
  useEffect(() => {
    if(window.innerWidth<600) {
      setMobile(true)
    }
  }, [])
  const mobileMargin = {marginLeft: '1.2rem'}
  const desktopMargin = {marginLeft: '5rem'}
  return (
    <div>
      <Head>
        <title>{props.TITLE||"JW"}</title>
        <link
          rel="stylesheet"
          href="https://bootswatch.com/4/litera/bootstrap.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
          crossOrigin="anonymous"
        />
      </Head>

      <Navbar name={props.TOKEN && props.TOKEN.username.toUpperCase()} />

      <Container fluid={true}>
        {/* <Row> */}
          <Sidebar level={props.TOKEN && props.TOKEN.admin} />
          <main role="main" style={mobile?mobileMargin:desktopMargin}>
            {props.children}
          </main>
        {/* </Row> */}
      </Container>

      <style jsx global>
        {`
          * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
          }
          body {
            font-family: "Roboto", sans-serif;
            background-color: #f9fafc;
          }
          p {
            font-family: "Roboto", sans-serif;
          }
          li {
            display: inline;
          }
          .breadcrumb {
            background-color: transparent;
          }
          .nav {
            list-style: none;
          }
          .nav-link {
            text-decoration: none;
          }
          .sidenav---sidenav---_2tBP.sidenav---expanded---1KdUL {
            min-width: 180px !important;
          }
        `}
      </style>
    </div>
  );
};

export default Layout;
