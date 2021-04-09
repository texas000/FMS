import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import React, { useEffect, useState } from "react";
import fetch from "node-fetch";
import moment from "moment";
import { ListGroup, ListGroupItem, Spinner } from "reactstrap";
import { DateRangeInput } from "@blueprintjs/datetime";
import { Button, Toast, Toaster } from "@blueprintjs/core";
import { Bar } from "react-chartjs-2";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import { useRouter } from "next/router";

export default function blank({ Cookie }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [range, setRange] = useState([
    new Date(moment().subtract(1, "year")),
    new Date(),
  ]);
  const [list, setList] = useState([]);
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");
  const [label, setLabel] = useState([]);
  const [cdata, setCdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [houseTotal, setHouseTotal] = useState(0);

  const [selectedCompany, setSelectedCompany] = useState([]);

  useEffect(() => {
    !TOKEN && router.push("/login");
    if (TOKEN.admin === 9 || TOKEN.admin === 5) {
      console.log("ACCESS GRANTED");
    } else {
      alert("YOU ARE NOT AUTORIZED TO ACCESS");
      router.push("/dashboard");
    }
  }, []);

  const handleDateChange = (e) => {
    setRange(e);
  };

  const handleButtonClick = async () => {
    setSelectedCompany([]);
    setCdata([]);
    setLabel([]);
    setHouseTotal(0);
    if (range[0] === null || range[1] === null) {
      alert("PLEASE SELECT FROM AND TO DATE");
    } else {
      const fetchHouseCount = await fetch(`/api/admin/getHouseCount`, {
        headers: {
          from: moment(range[0]).format("L"),
          to: moment(range[1]).format("L"),
        },
      });
      if (fetchHouseCount.status === 200) {
        const HouseCount = await fetchHouseCount.json();
        setList(HouseCount);
      }
    }
  };

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

  const handleCompanyClick = async (company) => {
    // When user click on the company, focus window on the top
    window.scrollTo(0, 0);

    // Check if the selected company is in the list
    const hasCompany = selectedCompany.find(
      (ele) => ele.companyID == company.companyID
    );

    if (hasCompany !== undefined) {
      // If user click the company again, exclude from array

      // first, find the index of sepcific company
      const idx = selectedCompany.findIndex(
        (ele) => ele.companyID === company.companyID
      );
      setMsg(`Removing ${company.companySName}...`);
      setShow(true);
      // When the selected company removed, get sum again to change the chart
      var sum = selectedCompany[idx].data.map((ga, i) => {
        return cdata[i] - ga.Count;
      });
      setCdata(sum);
      // splice specific index from array
      setHouseTotal((prev) => prev - company.Count);
      selectedCompany.splice(idx, 1);
    } else {
      // If new company is clicked, add the company to array
      setMsg(`Loading ${company.companySName}...`);
      setHouseTotal((prev) => prev + company.Count);
      // Fetch data when the new company is clicked
      const fetchHouseCount = await fetch(`/api/admin/getHouseCountWeekly`, {
        headers: {
          id: company.companyID,
          from: moment(range[0]).format("L"),
          to: moment(range[1]).format("L"),
        },
      });
      if (fetchHouseCount.status === 200) {
        const weekly = await fetchHouseCount.json();
        // Append selectedCompany
        setSelectedCompany((prev) => [...prev, { ...company, data: weekly }]);

        // extract count integer value
        var count = weekly.map((ga) => {
          return ga.Count;
        });

        var labels = weekly.map((ga) => {
          return `${ga.Year} W${ga.Week}`;
        });
        setLabel(labels);
        // sum up the value with previous
        if (cdata.length > 0) {
          var sum = cdata.map((num, i) => {
            return num + count[i];
          });
          setCdata(sum);
        } else {
          setCdata(count);
        }
        setShow(true);
        setLoading(false);
      }
    }
  };
  if (TOKEN) {
    if (TOKEN.admin === 9 || TOKEN.admin === 5) {
      return (
        <Layout TOKEN={TOKEN} TITLE="Custom Statistic">
          <div className="d-sm-flex align-items-center justify-content-between mb-4 w-100">
            <h3 className="h3 mb-0 font-weight-light">Custom Statistic</h3>
            <div className="text-center">
              <DateRangeInput
                formatDate={(date) =>
                  date == null ? "" : date.toLocaleDateString()
                }
                parseDate={(str) => new Date(Date.parse(str))}
                onChange={(e) => handleDateChange(e)}
                value={range}
              />
              <Button
                text="Search"
                className="ml-2"
                onClick={handleButtonClick}
                icon="search"
              />
            </div>
            <h5 className="h5 mb-0 font-weight-light">{`${moment(
              range[0]
            ).format("L")} - ${moment(range[1]).format("L")}`}</h5>
          </div>
          <div className="row">
            <div className="col-xl-3 col-md-3 mb-4">
              <div className="card border-left-primary shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-3">
                        Company List with House Count
                      </div>
                      <ListGroup>
                        {list ? (
                          list.map((ga, i) => (
                            <ListGroupItem
                              key={ga.companyID}
                              href="#"
                              onClick={() => handleCompanyClick(list[i])}
                              action
                              className="d-flex justify-content-between align-items-center text-xs btn btn-link"
                            >
                              <span
                                className={`font-weight-bold ${
                                  selectedCompany.find(
                                    (ele) => ele.companyID == ga.companyID
                                  )
                                    ? "text-primary"
                                    : "text-secondary"
                                }`}
                              >
                                {ga.companySName}
                              </span>
                              <span className="text-gray-800">{ga.Count}</span>
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
            <div className="col-xl-9 col-md-9 mb-4">
              <div className="card shadow h-100 py-2">
                <div className="card-body">
                  <div className="row no-gutters align-items-center">
                    <div className="col mr-2">
                      <div className="text-xs font-weight-bold text-primary text-uppercase mb-3">
                        {selectedCompany.length > 0 &&
                          selectedCompany.map((ga, i) => {
                            if (i) {
                              return " & " + ga.companySName;
                            } else {
                              return ga.companySName;
                            }
                          })}
                      </div>
                      <div className="text-xs font-weight-bold mb-4">
                        {houseTotal != 0 && `Total House Count: ${houseTotal}`}
                      </div>
                      {list.length > 0 &&
                        selectedCompany &&
                        (loading ? (
                          <Spinner className="text-center" />
                        ) : (
                          <Bar
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
                              },
                            }}
                            data={{
                              labels: label,
                              datasets: [
                                {
                                  label: "House Count",
                                  fill: true,
                                  lineTension: 0.1,
                                  backgroundColor: "#4e73df",
                                  borderColor: "#4e73df",
                                  borderCapStyle: "butt",
                                  borderDash: [],
                                  borderDashOffset: 0.0,
                                  borderJoinStyle: "miter",
                                  pointBorderColor: "#4e73df",
                                  pointBackgroundColor: "#fff",
                                  pointBorderWidth: 1,
                                  pointHoverRadius: 5,
                                  pointHoverBackgroundColor: "#4e73df",
                                  pointHoverBorderColor: "#4e73df",
                                  pointHoverBorderWidth: 2,
                                  pointRadius: 1,
                                  pointHitRadius: 10,
                                  barThickness: 12,
                                  data: cdata,
                                },
                              ],
                            }}
                          />
                        ))}
                    </div>
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
  // Pass data to the page via props
  return {
    props: {
      Cookie: cookies,
    },
  };
}
