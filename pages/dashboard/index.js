import Layout from "../../components/Layout";
import cookie from "cookie";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import ListGroup from "reactstrap/lib/ListGroup";
import ListGroupItem from "reactstrap/lib/ListGroupItem";
import fetch from "node-fetch";
import moment from "moment";

export default function dashboard({
  Cookie,
  OimList,
  OomList,
  AimList,
  AomList,
  Board,
}) {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  const [oim, setOim] = React.useState([]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("notification", JSON.stringify(OimList));
      localStorage.setItem("board", JSON.stringify(Board));
    }
  }, []);
  return (
    <Layout TOKEN={TOKEN} TITLE="Dashboard">
      <div className="d-sm-flex align-items-center justify-content-between mb-4 w-100">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        {/* <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-download fa-sm text-white-50"></i> Generate
          Report
        </a> */}
      </div>
      {/* // Page Heading  */}

      {/* // Content Row  */}
      <div className="row">
        {/* // Earnings (Monthly) Card Example  */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    my ocean import list
                  </div>
                  <ListGroup>
                    {OimList.length ? (
                      OimList.map((ga) => (
                        <ListGroupItem
                          key={ga.ID + ga.RefNo}
                          onClick={() =>
                            router.push(`/forwarding/oim/${ga.RefNo}`)
                          }
                          href="#"
                          action
                          className="text-gray-800 text-xs btn btn-link"
                        >
                          {ga.RefNo} - Arrival {moment(ga.ETA).fromNow()}
                        </ListGroupItem>
                      ))
                    ) : (
                      <div className="mt-2 text-danger text-xs">No Result</div>
                    )}
                  </ListGroup>
                  {/* <div className="h5 mb-0 font-weight-bold text-gray-800">
                    $40,000
                  </div> */}
                </div>
                {/* <div className="col-auto">
                  <i className="fa fa-calendar fa-2x text-gray-300"></i>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* // Earnings (Monthly) Card Example  */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    my ocean export list
                  </div>
                  <ListGroup>
                    {OomList.length ? (
                      OomList.map((ga) => (
                        <ListGroupItem
                          key={ga.ID + ga.RefNo}
                          onClick={() =>
                            router.push(`/forwarding/oex/${ga.RefNo}`)
                          }
                          href="#"
                          action
                          className="text-gray-800 text-xs btn btn-link"
                        >
                          {ga.RefNo} - Departure {moment(ga.ETA).fromNow()}
                        </ListGroupItem>
                      ))
                    ) : (
                      <div className="mt-2 text-danger text-xs">No Result</div>
                    )}
                  </ListGroup>
                </div>
                {/* <div className="col-auto">
                  <i className="fa fa-dollar fa-2x text-gray-300"></i>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* // Earnings (Monthly) Card Example  */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    my air import list
                  </div>
                  <ListGroup>
                    {AimList.length ? (
                      AimList.map((ga) => (
                        <ListGroupItem
                          key={ga.ID + ga.RefNo}
                          onClick={() =>
                            router.push(`/forwarding/aim/${ga.RefNo}`)
                          }
                          href="#"
                          action
                          className="text-gray-800 text-xs btn btn-link"
                        >
                          {ga.RefNo} - Arrival {moment(ga.ETA).fromNow()}
                        </ListGroupItem>
                      ))
                    ) : (
                      <div className="mt-2 text-danger text-xs">No Result</div>
                    )}
                  </ListGroup>
                  {/* <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        50%
                      </div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm mr-2">
                        <div
                          className="progress-bar bg-info"
                          role="progressbar"
                          style={{ width: "50%" }}
                          aria-valuenow="50"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                  </div> */}
                </div>
                {/* <div className="col-auto">
                  <i className="fa fa-clipboard fa-2x text-gray-300"></i>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* // Pending Requests Card Example  */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    my air export list
                  </div>
                  <ListGroup>
                    {AomList.length ? (
                      AomList.map((ga) => (
                        <ListGroupItem
                          key={ga.ID + ga.RefNo}
                          onClick={() =>
                            router.push(`/forwarding/aex/${ga.RefNo}`)
                          }
                          href="#"
                          action
                          className="text-gray-800 text-xs btn btn-link"
                        >
                          {ga.RefNo} - Departure {moment(ga.ETA).fromNow()}
                        </ListGroupItem>
                      ))
                    ) : (
                      <div className="mt-2 text-danger text-xs">No Result</div>
                    )}
                  </ListGroup>
                  {/* <div className="h5 mb-0 font-weight-bold text-gray-800">
                    18
                  </div> */}
                </div>
                {/* <div className="col-auto">
                  <i className="fa fa-comments fa-2x text-gray-300"></i>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explain Row */}
      <div className="row">
        <div className="col-lg-3 mb-4">
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              My Ocean Import
              <div className="text-white-50 small">
                Total of {OimList.length}
                <br />
                based on ETA from 2 weeks
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 mb-4">
          <div className="card bg-success text-white shadow">
            <div className="card-body">
              My Ocean Export
              <div className="text-white-50 small">
                Total of {OomList.length}
                <br />
                based on ETD from 2 weeks
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 mb-4">
          <div className="card bg-info text-white shadow">
            <div className="card-body">
              My Air Import
              <div className="text-white-50 small">
                Total of {AimList.length}
                <br />
                based on ETA from 2 weeks
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 mb-4">
          <div className="card bg-warning text-white shadow">
            <div className="card-body">
              My Air Export
              <div className="text-white-50 small">
                Total of {AomList.length}
                <br />
                based on ETD from 2 weeks
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* // Content Row  */}
      {/* // Area Chart  */}
      {/* // Card Header - Dropdown  */}
      {/* // Card Body  */}
      <div className="row">
        {/* <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Example Artwork
              </h6>
            </div>
            <div className="card-body">
              <div className="text-center">
                <img
                  src="/image/icons/coffee_break.svg"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* // Pie Chart  */}
        {/* <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Quick Access
              </h6>
            </div>
            <div className="card-body">
              <ListGroup>
                {oim.map((ga) => (
                  <ListGroupItem
                    key={ga.F_ID + ga.F_RefNo}
                    onClick={() => router.push(`/forwarding/oim/${ga.F_RefNo}`)}
                    href="#"
                    action
                    className="font-weight-bold text-gray-800 btn btn-link"
                  >
                    {ga.F_RefNo}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </div>
          </div>
        </div> */}
      </div>
      <div>
        {/* // Content Row  */}
        {/* // Content Column  */}
        {/* // Project Card Example  */}
        {/* <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">Projects</h6>
            </div>
            <div className="card-body">
              <h4 className="small font-weight-bold">
                Server Migration <span className="float-right">20%</span>
              </h4>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: "20%" }}
                  aria-valuenow="20"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <h4 className="small font-weight-bold">
                Sales Tracking <span className="float-right">40%</span>
              </h4>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-warning"
                  role="progressbar"
                  style={{ width: "40%" }}
                  aria-valuenow="40"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <h4 className="small font-weight-bold">
                Customer Database <span className="float-right">60%</span>
              </h4>
              <div className="progress mb-4">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: "60%" }}
                  aria-valuenow="60"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <h4 className="small font-weight-bold">
                Payout Details <span className="float-right">80%</span>
              </h4>
              <div className="progress mb-4">
                <div
                  className="progress-bar bg-info"
                  role="progressbar"
                  style={{ width: "80%" }}
                  aria-valuenow="80"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
              <h4 className="small font-weight-bold">
                Account Setup <span className="float-right">Complete!</span>
              </h4>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: "100%" }}
                  aria-valuenow="100"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div> */}

        {/* // Color System  */}
        {/* <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card bg-primary text-white shadow">
                <div className="card-body">
                  Primary
                  <div className="text-white-50 small">#4e73df</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card bg-success text-white shadow">
                <div className="card-body">
                  Success
                  <div className="text-white-50 small">#1cc88a</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card bg-info text-white shadow">
                <div className="card-body">
                  Info
                  <div className="text-white-50 small">#36b9cc</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card bg-warning text-white shadow">
                <div className="card-body">
                  Warning
                  <div className="text-white-50 small">#f6c23e</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card bg-danger text-white shadow">
                <div className="card-body">
                  Danger
                  <div className="text-white-50 small">#e74a3b</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card bg-secondary text-white shadow">
                <div className="card-body">
                  Secondary
                  <div className="text-white-50 small">#858796</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card bg-light text-black shadow">
                <div className="card-body">
                  Light
                  <div className="text-black-50 small">#f8f9fc</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 mb-4">
              <div className="card bg-dark text-white shadow">
                <div className="card-body">
                  Dark
                  <div className="text-white-50 small">#5a5c69</div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="col-lg-6 mb-4">
          {/* // Illustrations  */}
          {/* <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Illustrations
              </h6>
            </div>
            <div className="card-body">
              <div className="text-center">
              </div>
              <p>
                Add some quality, svg illustrations to your project courtesy of{" "}
                <a target="_blank" rel="nofollow" href="https://undraw.co/">
                  unDraw
                </a>
                , a constantly updated collection of beautiful svg images that
                you can use completely free and without attribution!
              </p>
              <a target="_blank" rel="nofollow" href="https://undraw.co/">
                Browse Illustrations on unDraw &rarr;
              </a>
            </div>
          </div> */}

          {/* // Approach  */}
          {/* <div className="card shadow mb-4">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">
                Development Approach
              </h6>
            </div>
            <div className="card-body">
              <p>
                SB Admin 2 makes extensive use of Bootstrap 4 utility classes in
                order to reduce CSS bloat and poor page performance. Custom CSS
                classes are used to create custom components and custom utility
                classes.
              </p>
              <p className="mb-0">
                Before working with this theme, you should become familiar with
                the Bootstrap framework, especially the utility classes.
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(req.headers.cookie || "");

  const { fsid } = jwt.decode(cookies.jamesworldwidetoken);

  // Pass data to the page via props
  const from = moment().subtract(14, "days").calendar();

  const resOim = await fetch(
    `http://jameswi.com:49996/api/oimmain?PIC=${fsid}&etaFrom=${from}&etaTo=&etdFrom=&etdTo=&casestatus=open`
  );
  var dataOim = [];
  if (resOim.status == 200) {
    dataOim = await resOim.json();
  }

  const resOom = await fetch(
    `http://jameswi.com:49996/api/oommain?PIC=${fsid}&etaFrom=&etaTo=&etdFrom=${from}&etdTo=&casestatus=open`
  );
  var dataOom = [];
  if (resOom.status == 200) {
    dataOom = await resOom.json();
  }

  const resAim = await fetch(
    `http://jameswi.com:49996/api/aimmain?PIC=${fsid}&etaFrom=${from}&etaTo=&etdFrom=&etdTo=&casestatus=open`
  );
  var dataAim = [];
  if (resAim.status == 200) {
    dataAim = await resAim.json();
  }

  const resAom = await fetch(
    `http://jameswi.com:49996/api/aommain?PIC=${fsid}&etaFrom=&etaTo=&etdFrom=${from}&etdTo=&casestatus=open`
  );
  var dataAom = [];
  if (resAom.status == 200) {
    dataAom = await resAom.json();
  }

  const resBoard = await fetch(`${process.env.BASE_URL}api/board/getPostFive`);
  const dataBoard = await resBoard.json();

  return {
    props: {
      Cookie: cookies,
      OimList: dataOim,
      OomList: dataOom,
      AimList: dataAim,
      AomList: dataAom,
      Board: dataBoard,
    },
  };
}
