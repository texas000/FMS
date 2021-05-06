import cookie from "cookie";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Button } from "@blueprintjs/core";
import Head from "../../../components/Forwarding/ForwardingHead";
import Master from "../../../components/Forwarding/ForwardingOim";
import Other from "../../../components/Forwarding/ForwardingOther";
import fetch from "node-fetch";

const Detail = ({ Cookie, Query, Main }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [house, setHouse] = useState(false);
  if (TOKEN) {
    // Add if the reference number is not found, return error page instead
    if (TOKEN.admin > 0) {
      if (Main) {
        switch (Main[0].TBName) {
          case "T_OIMMAIN":
            useEffect(() => {
              console.log(Main);
              getOih();
            }, []);
            async function getOih() {
              const fetchOih = await fetch(`/api/forwarding/getFreightOih`, {
                headers: {
                  id: Main[0].ID,
                },
              });
              if (fetchOih.status === 200) {
                const House = await fetchOih.json();
                console.log(House);
                setHouse(House);
              }
            }
            return (
              <Layout TOKEN={TOKEN} TITLE={Query}>
                <Head Reference={Query} PostDate={Main[0].PostDate} />
                <Master Master={Main[0]} House={house} />
              </Layout>
            );
          case "T_OOMMAIN":
            useEffect(() => {
              console.log(Main);
              getOoh();
            }, []);
            async function getOoh() {
              const fetchOoh = await fetch(`/api/forwarding/getFreightOoh`, {
                headers: {
                  id: Main[0].ID,
                },
              });
              if (fetchOoh.status === 200) {
                const House = await fetchOoh.json();
                console.log(House);
                setHouse(House);
              }
            }
            return (
              <Layout TOKEN={TOKEN} TITLE={Query}>
                <Head Reference={Query} PostDate={Main[0].PostDate} />
              </Layout>
            );
          case "T_AIMMAIN":
            return (
              <Layout TOKEN={TOKEN} TITLE={Query}>
                <Head Reference={Query} PostDate={Main[0].PostDate} />
              </Layout>
            );
          case "T_AOMMAIN":
            return (
              <Layout TOKEN={TOKEN} TITLE={Query}>
                <Head Reference={Query} PostDate={Main[0].PostDate} />
              </Layout>
            );
          case "T_GENMAIN":
            useEffect(() => {
              console.log(Main);
            }, []);
            return (
              <Layout TOKEN={TOKEN} TITLE={Query}>
                <Head
                  Reference={Query}
                  PostDate={Main[0].PostDate}
                  Customer={Main[0].Customer_SName}
                />
                <Other Master={Main[0]} />
              </Layout>
            );
        }
        // If user is authorized, and master data exists, then fetch data
        return (
          <Layout TOKEN={TOKEN} TITLE={Query}>
            <h2>FAIL</h2>
          </Layout>
        );
      } else {
        return (
          <Layout TOKEN={TOKEN} TITLE="Not Found">
            <div
              className="alert alert-danger text-center font-weight-bold text-uppercase"
              role="alert"
            >
              <div className="d-flex flex-column">
                <p>ERROR: {Query} NOT FOUND!</p>
                <Button
                  text="Return"
                  icon="undo"
                  intent="danger"
                  outlined={true}
                />
              </div>
            </div>
          </Layout>
        );
      }
    } else {
      return <p>Permission Denied</p>;
    }
  } else {
    return <p>Redirecting...</p>;
  }
};
export async function getServerSideProps({ req, query }) {
  // Get cookies from browser
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  var Main = false;
  var Ref = query.Detail.substring(0, 3).toUpperCase();
  // Get the table name by reference number
  switch (Ref) {
    case "OIM":
      const fetchOimmainExt = await fetch(
        `${process.env.FS_BASEPATH}oimmain_ext?RefNo=${query.Detail}`,
        {
          headers: { "x-api-key": process.env.JWT_KEY },
        }
      );
      if (fetchOimmainExt.status === 200) {
        Main = await fetchOimmainExt.json();
      }
      break;
    case "OEX":
      const fetchOommainExt = await fetch(
        `${process.env.FS_BASEPATH}oommain_ext?RefNo=${query.Detail}`,
        {
          headers: { "x-api-key": process.env.JWT_KEY },
        }
      );
      if (fetchOommainExt.status === 200) {
        Main = await fetchOommainExt.json();
      }
      break;
    case "AIM":
      const fetchAimmainExt = await fetch(
        `${process.env.FS_BASEPATH}aimmain_ext?RefNo=${query.Detail}`,
        {
          headers: { "x-api-key": process.env.JWT_KEY },
        }
      );
      if (fetchAimmainExt.status === 200) {
        Main = await fetchAimmainExt.json();
      }
      break;
    case "AEX":
      const fetchAommainExt = await fetch(
        `${process.env.FS_BASEPATH}aommain_ext?RefNo=${query.Detail}`,
        {
          headers: { "x-api-key": process.env.JWT_KEY },
        }
      );
      if (fetchAommainExt.status === 200) {
        Main = await fetchAommainExt.json();
      }
      break;
    case "JWI":
      const fetchGenmainExt = await fetch(
        `${process.env.FS_BASEPATH}genmain_ext?RefNo=${query.Detail}`,
        {
          headers: { "x-api-key": process.env.JWT_KEY },
        }
      );
      if (fetchGenmainExt.status === 200) {
        Main = await fetchGenmainExt.json();
      }
      break;
    case "MS2":
      const fetchGenmainExt2 = await fetch(
        `${process.env.FS_BASEPATH}genmain_ext?RefNo=${query.Detail}`,
        {
          headers: { "x-api-key": process.env.JWT_KEY },
        }
      );
      if (fetchGenmainExt2.status === 200) {
        Main = await fetchGenmainExt2.json();
      }
      break;
  }

  return { props: { Cookie: cookies, Query: query.Detail, Main } };
}
export default Detail;
