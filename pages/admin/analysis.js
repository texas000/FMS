import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import React, { useState } from "react";
import fetch from "node-fetch";
import moment from "moment";
import { ListGroup, ListGroupItem } from "reactstrap";
import { DateRangeInput } from "@blueprintjs/datetime";
import { Toast, Toaster } from "@blueprintjs/core";
import { Bar } from "react-chartjs-2";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/core/lib/css/blueprint.css";

export default function blank({ Cookie, Company }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [range, setRange] = useState([
    moment().subtract(365, "days").toDate(),
    moment().toDate(),
  ]);
  const [companyList, setCompanyList] = useState(Company);
  const [weeklyLabel, setWeeklyLabel] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

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

  const onDateChange = async (from, to) => {
    const fetchHouseCount = await fetch(`/api/admin/getHouseCount`, {
      headers: {
        from,
        to,
      },
    });
    if (fetchHouseCount.status === 200) {
      const HouseCount = await fetchHouseCount.json();
      setCompanyList(HouseCount);
    }
  };
  const handleChange = (e) => {
    if (e) {
      if (e[0] !== null) {
        setRange([e[0], range[1]]);
        console.log(e[0]);
      }
      if (e[1] !== null) {
        setRange([range[0], e[1]]);
        console.log(moment(e[1]).format("MM-DD-YYYY"));
      }
      if (e[0] !== null && e[1] !== null) {
        const from = moment(e[0]).format("MM-DD-YYYY");
        const to = moment(e[1]).format("MM-DD-YYYY");
        onDateChange(from, to);
      }
    }
  };
  const handleCompanyClick = async (company) => {
    setMsg(`Loading ${company.companySName}...`);
    setShow(true);
    const fetchHouseCountWeekly = await fetch(
      `/api/admin/getHouseCountWeekly`,
      {
        headers: {
          id: company.companyID,
          from: moment(range[0]).format("MM-DD-YYYY"),
          to: moment(range[1]).format("MM-DD-YYYY"),
        },
      }
    );
    setWeeklyLabel([]);
    setWeeklyData([]);
    if (fetchHouseCountWeekly.status === 200) {
      const HouseCount = await fetchHouseCountWeekly.json();
      HouseCount.map((ga) => {
        setWeeklyLabel((prev) => [...prev, `${ga.Year}-${ga.Week}`]);
        setWeeklyData((prev) => [...prev, ga.Count]);
      });
      setShow(false);
    } else {
      alert("ERROR");
    }
  };
  return (
    <Layout TOKEN={TOKEN} TITLE="Analysis">
      <div className="d-sm-flex align-items-center justify-content-between mb-4 w-100">
        <h3 className="h3 mb-0 font-weight-light">Analysis</h3>
        {/* formatDate={(date) => date.toLocaleString()}
        parseDate={(str) => new Date(str)} */}
        <DateRangeInput
          formatDate={(date) => moment(date).format("MM/DD/YYYY")}
          parseDate={(str) => moment(str, "MM/DD/YYYY")}
          onChange={(e) => handleChange(e)}
          value={range}
        />
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
                  <ListGroup>
                    {companyList ? (
                      companyList.map((ga, i) => (
                        <ListGroupItem
                          key={ga.companyID}
                          href="#"
                          onClick={() => handleCompanyClick(companyList[i])}
                          action
                          className="d-flex justify-content-between align-items-center text-xs btn btn-link"
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
                <Bar
                  data={{
                    labels: weeklyLabel,
                    datasets: [
                      {
                        label: "House Count",
                        fill: true,
                        lineTension: 0.1,
                        backgroundColor: "#38d39f",
                        borderColor: "#38d39f",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "#38d39f",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "#38d39f",
                        pointHoverBorderColor: "#38d39f",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: weeklyData,
                      },
                    ],
                  }}
                />
                {/* {JSON.stringify(selected)}
                {JSON.stringify(weeklyData)} */}
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
  const fromDefault = moment().subtract(365, "days").format("MM-DD-YYYY");
  const today = moment().format("MM-DD-YYYY");
  const fecthCompany = await fetch(
    `${process.env.FS_BASEPATH}housecount_Companylist?etdFrom=${fromDefault}&etdTo=${today}`,
    {
      headers: { "x-api-key": process.env.JWT_KEY },
    }
  );
  if (fecthCompany.status === 200) {
    company = await fecthCompany.json();
  }
  // Pass data to the page via props
  return {
    props: {
      Cookie: cookies,
      Company: company,
    },
  };
}
