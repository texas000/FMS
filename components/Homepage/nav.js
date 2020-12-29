import { useRouter } from "next/router";
const Navs = () => {
  const router = useRouter()
  return (
    <nav
      className="site-header sticky-top py-1"
      style={{
        zIndex: "100",
        position: "absolute",
        marginLeft: "auto",
        marginRight: "auto",
        left: "0",
        right: "0",
        backgroundColor: "transparent",
        borderBottom: "2px solid rgba(255, 255, 255, .5)",
      }}
    >
      <div className="container d-flex flex-column flex-md-row justify-content-between">
        <a
          className="py-2"
          href="#"
          aria-label="Home"
          onClick={() => router.push("/")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="d-block mx-auto"
            role="img"
            viewBox="0 0 24 24"
            focusable="false"
            color="#fff"
          >
            <title>Home</title>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83m13.79-4l-5.74 9.94"></path>
          </svg>
        </a>
        <a
          className="d-none d-md-inline-block menu-item"
          href="#"
          onClick={() => router.push("/about")}
        >
          ABOUT
        </a>
        <a
          className="d-none d-md-inline-block menu-item"
          href="#"
          onClick={() => router.push("/service")}
          style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "800" }}
        >
          SERVICES
        </a>
        <a
          className="d-none d-md-inline-block menu-item"
          href="#"
          onClick={() => router.push("/shipment")}
          style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "800" }}
        >
          SHIPMENT
        </a>
        <a
          className="d-none d-md-inline-block menu-item"
          href="#"
          onClick={() => router.push("/warehouse")}
          style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "800" }}
        >
          WAREHOUSE
        </a>
        <a
          className="d-none d-md-inline-block menu-item"
          href="#"
          onClick={() => router.push("/branch")}
          style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "800" }}
        >
          BRANCH
        </a>
        <a
          className="d-none d-md-inline-block menu-item"
          href="#"
          onClick={() => router.push("/forwarding")}
          style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "800" }}
        >
          DASHBOARD
        </a>
      </div>
      <style jsx>
        {`
          .container > a {
            position: relative;
            color: white;
            text-decoration: none;
            font-size: 1.5rem;
            font-weight: 800;
            font-family: -apple-system, BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
          }
           {
            /* HOVER -> UNDERLINE */
          }
          .container > a:before {
            content: "";
            position: absolute;
            width: 100%;
            height: 5px;
            bottom: 0;
            left: 0;
            background-color: #fff;
            visibility: hidden;
            transform: scaleX(0);
            transition: all 0.3s ease-in-out 0s;
          }
          .container > a:hover:before,
          .container > a:focus:before {
            visibility: visible;
            transform: scaleX(1);
          }
        `}
      </style>
    </nav>
  );
}


export default Navs;