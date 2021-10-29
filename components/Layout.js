import Head from "next/head";
import { Container } from "reactstrap";
import { useEffect, useState, Fragment } from "react";
import Top from "./Nav";
import Sidebar from "./Side";
import Loading from "./Loader";

const Layout = (props) => {
  // Toggle sidebar
  const [toggle, setToggle] = useState(true);
  // State that check if the screen is mobile
  const [mobile, setMobile] = useState(false);
  // Loading
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (window.innerWidth < 600) {
      setMobile(true);
      setToggle(true);
    }
  }, []);
  // * LAYOUT IS EXTREMELY IMPORTANT PAGE SINCE IT MADE UP ALL OF THE PAGES
  // 1. When there is no title props provided, title will display JW
  // 2. Link list: google font, awesome font, favicon, meta data for marketing purpose

  return (
    <>
      <Head>
        <title>{props.TITLE || "JWIUSA"}</title>
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
        <meta
          name="theme-color"
          content="#F3F4F6"
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content="#4B5563"
          media="(prefers-color-scheme: dark)"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <script
          src="https://cdn.onesignal.com/sdks/OneSignalSDK.js"
          async=""
        ></script>
        {/* <link href="/font/Roboto-Regular.ttf" rel="stylesheet"></link> */}
      </Head>

      <div className="flex">
        <Sidebar
          Token={props.TOKEN}
          toggle={toggle}
          setToggle={setToggle}
          isMobile={mobile}
          setLoading={setLoading}
        />
        {/* Content Wrapper */}
        <div className="w-full bg-gray-100 dark:bg-gray-600 overflow-x-hidden">
          <div>
            <Top Token={props.TOKEN} toggle={toggle} setToggle={setToggle} />
            {!props.LOADING ? (
              <div className="px-4">{props.children}</div>
            ) : (
              <Fragment></Fragment>
            )}
          </div>
        </div>
        <Loading show={props.LOADING || loading} />
      </div>
    </>
  );
};

export default Layout;
