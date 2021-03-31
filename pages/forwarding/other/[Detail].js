import cookie from "cookie";
import Layout from "../../../components/Layout";
import { Row, Col, Button, Alert } from "reactstrap";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect } from "react";
import Head from "../../../components/Forwarding/Head";
import Route from "../../../components/Forwarding/Route";

import jwt from "jsonwebtoken";
import { Comment } from "../../../components/Forwarding/Comment";
import Info from "../../../components/Forwarding/OtherInfo";
import Forms from "../../../components/Forwarding/Forms";
import Status from "../../../components/Forwarding/Status";
import moment from "moment";

const Detail = ({ Cookie, OTHER, GENMAIN, GENHOUSE, Firebase }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    !TOKEN && router.push("/login");
    console.log(GENMAIN);
    // addLogData(GENMAIN[0]);
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

  if (TOKEN && TOKEN.group) {
    return (
      <>
        {GENMAIN ? (
          <Layout TOKEN={TOKEN} TITLE={GENMAIN[0].RefNo}>
            <Head
              REF={GENMAIN[0].RefNo}
              POST={GENMAIN[0].PostDate}
              CUSTOMER={GENMAIN[0].Customer_SName}
            />
            {/* Display only at print screen */}
            <p className="d-none d-print-block">
              Printed at {moment().format("lll")}
            </p>
            <Row>
              <Col lg={10}>
                <Row>
                  <Info Master={GENMAIN[0]} />
                  <Col lg="6" className="mb-4">
                    <Forms
                      Master={GENMAIN[0]}
                      House={GENHOUSE}
                      User={TOKEN}
                      Type="other"
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2} className="mb-4">
                <Route
                  ETA={GENMAIN[0].ETA}
                  ETD={GENMAIN[0].ETD}
                  FETA={GENMAIN[0].FETA}
                  DISCHARGE={GENMAIN[0].DisCharge}
                  LOADING={GENMAIN[0].LoadingPort}
                  DEST={GENMAIN[0].FinalDest}
                />
              </Col>
            </Row>

            <Comment
              reference={GENMAIN[0].RefNo}
              uid={TOKEN.uid}
              main={GENMAIN[0]}
              Firebase={Firebase}
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

  // FETCH OIM EXT (OIMMAIN DATA + STATUS DATA)
  const fetchGenmainExt = await fetch(
    `${process.env.FS_BASEPATH}genmain_ext?RefNo=${query.Detail}`,
    {
      headers: { "x-api-key": process.env.JWT_KEY },
    }
  );

  // DEFINE FLASE VARIABLE
  var MAIN = false;
  var HOUSE = false;

  if (fetchGenmainExt.status === 200) {
    MAIN = await fetchGenmainExt.json();
  }

  // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
  if (MAIN) {
    // FETCH OIM DATA FROM FREIGHT STREAM;
    const fetchAP = await fetch(
      `${process.env.FS_BASEPATH}aphd?table=T_GENMAIN&tbid=${MAIN[0].ID}`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );

    if (fetchAP.status === 200) {
      const Ap = await fetchAP.json();
      HOUSE = [{ Customer_SName: MAIN[0].Customer_SName, AP: Ap }];
      var ApInfo = Ap;
      for (var j = 0; j < Ap.length; j++) {
        const CompanyContactFetch = await fetch(
          `${process.env.FS_BASEPATH}Company_CompanyContact/${Ap[j].PayTo}`,
          {
            headers: { "x-api-key": process.env.JWT_KEY },
          }
        );
        if (CompanyContactFetch.status === 200) {
          const Contact = await CompanyContactFetch.json();
          ApInfo[j] = { ...Ap[j], PayToCustomer: Contact };
        }
      }
      HOUSE = [{ Customer_SName: MAIN[0].Customer_SName, AP: ApInfo }];
    }
    return {
      props: {
        Cookie: cookies,
        GENMAIN: MAIN,
        GENHOUSE: HOUSE,
        Firebase: process.env.FIREBASE_API_KEY,
      },
    };
  }
  return { props: { Cookie: cookies } };
}

export default Detail;
