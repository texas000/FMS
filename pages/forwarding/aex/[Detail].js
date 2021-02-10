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
import Info from "../../../components/Forwarding/AirInfo";
import Forms from "../../../components/Forwarding/Forms";
import Status from "../../../components/Forwarding/Status";

const Detail = ({ Cookie, AIM, EXTRA }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    !TOKEN && router.push("/login");
    // console.log(AIM);
  });

  var mailSubject, mailBody, emailHref;
  if (AIM && AIM.M) {
    mailSubject =
      AIM.H.length > 0
        ? `[JW] ${AIM.H[0].CUSTOMER} MAWBNO# ${AIM.M.F_MawbNo} HBL# ${AIM.H.map(
            (na) => `${na.F_HAWBNo}`
          )} ETD ${moment(AIM.M.F_ETD).utc().format("l")} ETA ${moment(
            AIM.M.F_ETA
          )
            .utc()
            .format("l")} // ${AIM.M.F_RefNo}`
        : "";

    mailBody =
      AIM.H.length > 0
        ? `Dear ${AIM.H[0].CUSTOMER}
      \nPlease note that there is an AIR EXPORT SHIPMENT for ${
        AIM.H[0].CUSTOMER
      } scheduled to depart on ${moment(AIM.M.F_ETA).utc().format("LL")}.`
        : "";

    emailHref =
      AIM.H.length > 0
        ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
            mailSubject
          )}&body=${encodeURIComponent(mailBody)}`
        : "";
  }

  if (TOKEN && TOKEN.group) {
    return (
      <>
        {AIM && AIM.M ? (
          <Layout TOKEN={TOKEN} TITLE={AIM.M.F_RefNo}>
            <Head
              REF={AIM.M.F_RefNo}
              POST={AIM.M.F_PostDate}
              PIC={AIM.M.F_U2ID}
              EMAIL={emailHref}
              CUSTOMER={AIM.H.length ? AIM.H[0].CUSTOMER : false}
            />
            {/* Display only at print screen */}
            <p className="d-none d-print-block">
              Printed at {moment().format("lll")}
            </p>
            <Row>
              <Col lg={10}>
                <Row>
                  <Info Master={AIM.M} House={AIM.H} Containers={AIM.C} />
                  <Col md="6">
                    <Forms
                      Master={AIM.M}
                      House={AIM.H}
                      AP={AIM.A}
                      User={TOKEN}
                    />
                    <Status
                      Data={EXTRA.S}
                      Ref={AIM.M.F_RefNo}
                      Uid={TOKEN.uid}
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2}>
                <Route
                  ETA={AIM.M.F_ETA}
                  ETD={AIM.M.F_ETD}
                  FETA={AIM.M.F_FETA}
                  DISCHARGE={AIM.M.F_Discharge}
                  LOADING={AIM.M.F_LoadingPort}
                  DEST={AIM.M.F_FinalDest}
                />
              </Col>
            </Row>

            <Comment
              comment={EXTRA.M}
              reference={AIM.M.F_RefNo}
              uid={TOKEN.uid}
            />
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

  // FETCH AIM DATA FROM FREIGHT STREAM
  const fetchAim = await fetch(
    `${process.env.BASE_URL}api/forwarding/getAexDetail`,
    { headers: { reference: query.Detail, key: cookies.jamesworldwidetoken } }
  );
  if (fetchAim.status === 200) {
    const Aim = await fetchAim.json();

    // FETCH EXTRA DATA FROM FMS
    const fetchExtra = await fetch(
      `${process.env.BASE_URL}api/forwarding/getExtra`,
      { headers: { ref: query.Detail } }
    );
    var Extra = null;
    if (fetchExtra.status == 200) {
      Extra = await fetchExtra.json();
    } else {
      Extra = { M: [], S: [] };
    }

    return {
      props: { Cookie: cookies, AIM: Aim, EXTRA: Extra },
    };
  } else {
    return {
      props: { Cookie: cookies },
    };
  }
}

export default Detail;
