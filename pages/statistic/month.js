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

export default function blank({ Cookie, Company }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [totalMonth, setTotalMonth] = useState([]);
  useEffect(() => {
    getWeeklyData();
  }, []);

  async function getWeeklyData() {
    for (var i = 0; i < 20; i++) {
      const fetchHouseCountWeekly = await fetch(
        `/api/admin/getHouseCountWeekly`,
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
  return (
    <Layout TOKEN={TOKEN} TITLE="Top Of Month">
      <div className="d-sm-flex align-items-center justify-content-between mb-4 w-100">
        <h3 className="h3 mb-0 font-weight-light">Top Of Month</h3>
      </div>
      <div className="row">
        <div className="col-xl-3 col-md-3 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Company List
                  </div>
                  <ListGroup className="mt-2">
                    {Company ? (
                      Company.map((ga, i) => (
                        <ListGroupItem
                          key={i}
                          action
                          className="d-flex justify-content-between align-items-center text-xs"
                        >
                          <span className="font-weight-bold">
                            {ga.companySName}
                          </span>
                          <span className="text-gray-800">{ga.Count}</span>
                        </ListGroupItem>
                      ))
                    ) : (
                      <div className="mt-2 text-danger text-xs">No Result</div>
                    )}
                  </ListGroup>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-md-9 mb-4">
          <div className="card shadow h-100 py-2">
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
                    {totalMonth.map((ga) => (
                      <tr key={ga.companyID}>
                        <th scope="row">
                          <a href={`/company/${ga.companyID}`} target="__blank">
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
    `${process.env.FS_BASEPATH}housecount_Companylist?etdFrom=${fromDefault}&etdTo=${today}`,
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
