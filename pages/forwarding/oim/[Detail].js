import cookie from "cookie";
import Layout from "../../../components/Layout";
import { Row, Col, Button, Alert } from "reactstrap";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect } from "react";
import Head from "../../../components/Forwarding/Head";
import Route from "../../../components/Forwarding/Route";
import moment from "moment";

import jwt from "jsonwebtoken";
import { Comment } from "../../../components/Forwarding/Comment";
import Info from "../../../components/Forwarding/Info";
import Forms from "../../../components/Forwarding/Forms";
import Status from "../../../components/Forwarding/Status";

const Detail = ({ Cookie, OIM, OIMMAIN }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    !TOKEN && router.push("/login");
    console.log(OIMMAIN);
    if (OIMMAIN) {
      addLogData(OIMMAIN[0]);
    }
  });

  async function addLogData(Ref) {
    const fetchPostLog = await fetch("/api/forwarding/postFreightExtLog", {
      method: "POST",
      body: JSON.stringify({
        RefNo: Ref.RefNo,
        TBName: Ref.TBName,
        TBID: Ref.TBID,
        Title: `${TOKEN.username} ACCESS GRANTED`,
        Contents: JSON.stringify(TOKEN),
      }),
    });
    if (fetchPostLog.status === 200) {
      console.log("log uploaded");
    } else {
      console.log(fetchPostLog.status);
    }
  }

  var mailSubject, mailBody, emailHref;
  if (OIM && OIM.M) {
    mailSubject =
      OIM.H.length > 0
        ? `[JW] ${OIM.H[0].CUSTOMER} MBL# ${OIM.M.F_MBLNo} HBL# ${OIM.H.map(
            (na) => `${na.F_HBLNo}`
          )} CNTR# ${
            OIM.C && OIM.C.map((ga) => `${ga.F_ContainerNo}`)
          } ETD ${moment(OIM.M.F_ETD).utc().format("l")} ETA ${moment(
            OIM.M.F_ETA
          )
            .utc()
            .format("l")} // ${OIM.M.F_RefNo}`
        : "";

    mailBody =
      OIM.H.length > 0
        ? `Dear ${OIM.H[0].CUSTOMER}
      \nPlease note that there is an OCEAN IMPORT SHIPMENT for ${
        OIM.H[0].CUSTOMER
      } scheduled to depart on ${moment(OIM.M.F_ETA).utc().format("LL")}.`
        : "";

    emailHref =
      OIM.H.length > 0
        ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
            mailSubject
          )}&body=${encodeURIComponent(mailBody)}`
        : "";
  }

  if (TOKEN && TOKEN.group) {
    return (
      <>
        {OIM && OIM.M ? (
          <Layout TOKEN={TOKEN} TITLE={OIM.M.F_RefNo}>
            <Head
              REF={OIM.M.F_RefNo}
              POST={OIM.M.F_PostDate}
              PIC={OIM.M.F_U2ID}
              EMAIL={emailHref}
              CUSTOMER={OIM.H.length ? OIM.H[0].CUSTOMER : false}
            />
            {/* Display only at print screen */}
            <p className="d-none d-print-block">
              Printed at {moment().format("lll")}
            </p>
            <Row>
              <Col lg={10}>
                <Row>
                  <Info
                    Master={OIM.M}
                    House={OIM.H}
                    Containers={OIM.C}
                    Profit={OIM.P}
                  />
                  <Col md="6">
                    <Forms
                      Master={OIM.M}
                      House={OIM.H}
                      Containers={OIM.C}
                      AP={OIM.A}
                      User={TOKEN}
                      Type="ocean"
                    />
                    <Status
                      Ref={OIM.M.F_RefNo}
                      Uid={TOKEN.uid}
                      Main="oimmain"
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2} className="mb-4">
                <Route
                  ETA={OIM.M.F_ETA}
                  ETD={OIM.M.F_ETD}
                  FETA={OIM.M.F_FETA}
                  DISCHARGE={OIM.M.F_DisCharge}
                  LOADING={OIM.M.F_LoadingPort}
                  DEST={OIM.M.F_FinalDest}
                />
              </Col>
            </Row>

            <Comment reference={OIM.M.F_RefNo} uid={TOKEN.uid} />
          </Layout>
        ) : (
          <Layout TOKEN={TOKEN} TITLE="Not Found">
            <Row>
              <Col className="text-center">
                <Alert color="danger">
                  ERROR: {router.query.Detail} NOT FOUND!
                </Alert>
                <Button color="secondary" onClick={() => router.back()}>
                  Return To Previous Page
                </Button>
              </Col>
            </Row>
          </Layout>
        )}
        {/* IF THE REFERENCE NUMBER IS NOT FOUND, DISPLAY ERROR PAGE */}
      </>
    );
  } else {
    return <p>Redirecting...</p>;
  }
};

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  // FETCH OIM EXT (OIMMAIN DATA + STATUS DATA)
  const fetchOimmainExt = await fetch(
    `${process.env.FS_BASEPATH}oimmain_ext?RefNo=${query.Detail}`
  );

  // DEFINE FLASE VARIABLE
  var MAIN = false;

  if (fetchOimmainExt.status === 200) {
    MAIN = await fetchOimmainExt.json();
  }

  // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
  if (MAIN) {
    // FETCH OIM DATA FROM FREIGHT STREAM
    const fetchOim = await fetch(
      `${process.env.BASE_URL}api/forwarding/getOimDetail`,
      { headers: { reference: query.Detail, key: cookies.jamesworldwidetoken } }
    );

    if (fetchOim.status === 200) {
      // WHEN OIM IS EMPTY, THIS WILL RETURN THE NOT FOUND PAGE
      const Oim = await fetchOim.json();
      return {
        props: {
          Cookie: cookies,
          OIM: Oim,
          OIMMAIN: MAIN,
        },
      };
    }
  }
  return { props: { Cookie: cookies } };
}

export default Detail;
