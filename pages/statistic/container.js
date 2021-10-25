import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import React, { useState, useEffect } from "react";
import fetch from "node-fetch";
import moment from "moment";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Toast, Toaster } from "@blueprintjs/core";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { Line } from "react-chartjs-2";
import { useRouter } from "next/router";

export default function blank({ Cookie, Company }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [totalMonth, setTotalMonth] = useState([]);

  const [companyname, setCompanyname] = useState([]);
  const [companycount, setCompanycount] = useState([]);

  useEffect(() => {
    !TOKEN && router.push("/login");
    if (TOKEN.admin > 4) {
      getWeeklyData();
      Company &&
        Company.map((ga) => {
          setCompanyname((prev) => [...prev, ga.companySName]);
          setCompanycount((prev) => [...prev, ga.Count]);
        });
      return () => {
        setTotalMonth([]);
      };
    } else {
      alert("YOU ARE NOT AUTORIZED TO ACCESS");
      router.push("/");
    }
  }, []);

  async function getWeeklyData() {
    for (var i = 0; i < 20; i++) {
      const fetchHouseCountWeekly = await fetch(
        `/api/admin/getContainerWeekly`,
        {
          headers: {
            id: Company[i].companyID,
            from: moment()
              .subtract(21, "days")
              .day("Sunday")
              .format("MM-DD-YYYY"),
            to: moment().day("Saterday").format("MM-DD-YYYY"),
          },
        }
      );
      if (fetchHouseCountWeekly.status === 200) {
        const HouseCountWeekly = await fetchHouseCountWeekly.json();
        setTotalMonth((prev) => [
          ...prev,
          { ...Company[i], week: HouseCountWeekly },
        ]);
      }
    }
  }
  const FormsToaster = () => {
    if (show) {
      return (
        <Toaster position="top">
          <Toast
            message={msg}
            intent="primary"
            onDismiss={() => setShow(false)}
          ></Toast>
        </Toaster>
      );
    } else {
      return <React.Fragment></React.Fragment>;
    }
  };
  if (TOKEN) {
    if (TOKEN.admin > 4) {
      return (
        <Layout TOKEN={TOKEN} TITLE="Monthly Container">
          <div className="d-sm-flex align-items-center justify-content-between mb-4 w-100">
            <h3 className="h3 mb-0 font-weight-light">Monthly Container</h3>
            <h5 className="h5 mb-0 font-weight-light">{`${moment().year()} WEEK ${moment()
              .subtract(21, "days")
              .week()} - ${moment().week()}`}</h5>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card shadow mb-4 pr-0 mr-0">
                <div className="card-body px-4 my-4">
                  <Line
                    height={40}
                    options={{
                      legend: {
                        display: false,
                      },
                      scales: {
                        yAxes: [
                          {
                            gridLines: {
                              display: false,
                            },
                          },
                        ],
                        xAxes: [
                          {
                            display: false,
                            gridLines: {
                              display: false,
                            },
                          },
                        ],
                      },
                    }}
                    data={{
                      labels: companyname,
                      datasets: [
                        {
                          label: "Number of Containers",
                          data: companycount,
                          fill: false,
                          borderColor: "#4e73df",
                          pointRadius: 8,
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-12 col-md-12 mb-4">
              <div className="card border-left-primary shadow h-100 pt-2 pr-2">
                <div
                  className="card-body"
                  style={{ overflow: "auto", whiteSpace: "nowrap" }}
                >
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                        Company List
                      </div>
                      <ListGroup className="mt-2 list-group-horizontal">
                        {Company ? (
                          Company.map((ga, i) => (
                            <ListGroupItem
                              key={i}
                              action
                              className="d-flex justify-content-between align-items-center text-xs btn"
                              onClick={() => {
                                setCompanyname([]);
                                setCompanycount([]);
                                totalMonth[i].week.map((ga) => {
                                  setCompanyname((prev) => [
                                    ...prev,
                                    `WK ${ga.Week}`,
                                  ]);
                                  setCompanycount((prev) => [
                                    ...prev,
                                    ga.Count,
                                  ]);
                                });
                              }}
                            >
                              <span className="font-weight-bold mr-2">
                                {ga.companySName}
                              </span>
                              <span className="text-primary">{ga.Count}</span>
                            </ListGroupItem>
                          ))
                        ) : (
                          <div className="mt-2 text-danger text-xs">
                            No Result
                          </div>
                        )}
                      </ListGroup>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-12 col-md-12 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    <table className="table table-striped">
                      <thead>
                        <tr className="text-primary">
                          <th scope="col">Customer</th>
                          <th>
                            {totalMonth.length > 0
                              ? "WK" + totalMonth[0].week[0].Week
                              : "Week 1"}
                          </th>
                          <th>
                            {totalMonth.length > 0
                              ? "WK" + totalMonth[0].week[1].Week
                              : "Week 2"}
                          </th>
                          <th>
                            {totalMonth.length > 0
                              ? "WK" + totalMonth[0].week[2].Week
                              : "Week 3"}
                          </th>
                          <th>
                            {totalMonth.length > 0
                              ? "WK" + totalMonth[0].week[3].Week
                              : "Week 4"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {totalMonth &&
                          totalMonth.map((ga) => (
                            <tr key={ga.companyID}>
                              <th scope="row">
                                <a
                                  href={`/company/${ga.companyID}`}
                                  target="__blank"
                                >
                                  {ga.companySName}
                                </a>
                              </th>
                              <th>{ga.week[0].Count}</th>
                              <th>{ga.week[1].Count}</th>
                              <th>{ga.week[2].Count}</th>
                              <th>{ga.week[3].Count}</th>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FormsToaster />
        </Layout>
      );
    } else {
      return <p>Unauthorized</p>;
    }
  } else {
    return <p>Redirecting...</p>;
  }
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  var company = false;
  const fromDefault = moment()
    .subtract(21, "days")
    .day("Sunday")
    .format("MM-DD-YYYY");
  const today = moment().day("Saterday").format("MM-DD-YYYY");
  const fecthCompany = await fetch(
    `${process.env.FS_BASEPATH}containercount_Companylist?etdFrom=${fromDefault}&etdTo=${today}`,
    {
      headers: { "x-api-key": process.env.JWT_KEY },
    }
  );
  if (fecthCompany.status === 200) {
    const com = await fecthCompany.json();
    company = [];
    // console.log(com);
    for (var i = 0; i < 20; i++) {
      company.push(com[i]);
    }
  }
  // Pass data to the page via props
  return {
    props: {
      Cookie: cookies,
      Company: company,
    },
  };
}
