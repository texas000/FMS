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

const Detail = ({ Cookie, AIMMAIN, AIHMAIN, Firebase }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [AP, setAP] = React.useState([]);
  useEffect(() => {
    !TOKEN && router.push("/login");
    if (AIMMAIN) {
      addLogData(AIMMAIN[0]);
    }
  }, []);

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
      console.log("SUCCESS");
    } else {
      console.log(fetchPostLog.status);
    }
  }

  var mailSubject, mailBody, emailHref;
  if (AIMMAIN) {
    mailSubject =
      AIMMAIN.length > 0
        ? `[JW] ${AIHMAIN[0].Customer_SName} MAWBNO# ${
            AIMMAIN[0].MawbNo
          } HAWBNO# ${AIHMAIN.map((na) => `${na.HawbNo}`)} ETD ${moment(
            AIMMAIN[0].ETD
          )
            .utc()
            .format("l")} ETA ${moment(AIMMAIN[0].ETA).utc().format("l")} // ${
            AIMMAIN[0].RefNo
          }`
        : "";

    mailBody =
      AIMMAIN.length === 1
        ? `Dear ${AIHMAIN[0].Customer_SName}
      \nPlease note that there is an AIR IMPORT SHIPMENT for ${
        AIHMAIN[0].Customer_SName
      } scheduled to depart on ${moment(AIMMAIN[0].ETA).utc().format("LL")}.`
        : "";

    emailHref =
      AIHMAIN.length > 0
        ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
            mailSubject
          )}&body=${encodeURIComponent(mailBody)}`
        : "";
  }

  if (TOKEN && TOKEN.group) {
    return (
      <>
        {AIMMAIN ? (
          <Layout TOKEN={TOKEN} TITLE={AIMMAIN[0].RefNo}>
            <Head
              REF={AIMMAIN[0].RefNo}
              POST={AIMMAIN[0].PostDate}
              EMAIL={emailHref}
              CUSTOMER={AIHMAIN && AIHMAIN[0].Customer_SName}
            />
            {/* Display only at print screen */}
            <p className="d-none d-print-block">
              Printed at {moment().format("lll")}
            </p>
            <Row>
              <Col lg={10}>
                <Row>
                  <Info Master={AIMMAIN[0]} House={AIHMAIN} Containers={[]} />
                  <Col lg="6">
                    <Forms
                      Master={AIMMAIN[0]}
                      House={AIHMAIN}
                      User={TOKEN}
                      Type="air"
                    />
                    <Status
                      Ref={AIMMAIN[0].RefNo}
                      Uid={TOKEN.uid}
                      Main="aimmain"
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2} className="mb-4">
                <Route
                  ETA={AIMMAIN[0].ETA}
                  ETD={AIMMAIN[0].ETD}
                  FETA={AIMMAIN[0].FETA}
                  DISCHARGE={AIMMAIN[0].DisCharge}
                  LOADING={AIMMAIN[0].LoadingPort}
                  DEST={AIMMAIN[0].FinalDest}
                />
              </Col>
            </Row>

            <Comment
              reference={AIMMAIN[0].RefNo}
              uid={TOKEN.uid}
              main={AIMMAIN[0]}
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
  const fetchAimmainExt = await fetch(
    `${process.env.FS_BASEPATH}aimmain_ext?RefNo=${query.Detail}`,
    {
      headers: { "x-api-key": process.env.JWT_KEY },
    }
  );

  // DEFINE FLASE VARIABLE
  var MAIN = false;
  var HOUSE = false;

  if (fetchAimmainExt.status === 200) {
    MAIN = await fetchAimmainExt.json();
  }

  // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
  if (MAIN) {
    // GET OIHMAIN FROM BLID
    const fecthAihmain = await fetch(
      `${process.env.FS_BASEPATH}aihmain?aimblid=${MAIN[0].ID}`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );
    if (fecthAihmain.status === 200) {
      HOUSE = await fecthAihmain.json();

      if (HOUSE.length > 0) {
        for (var i = 0; i < HOUSE.length; i++) {
          var APLIST = false;
          const fetchAP = await fetch(
            `${process.env.FS_BASEPATH}aphd?table=T_AIHMAIN&tbid=${HOUSE[i].ID}`,
            {
              headers: { "x-api-key": process.env.JWT_KEY },
            }
          );
          // IF AP EXISTS
          if (fetchAP.status === 200) {
            const Ap = await fetchAP.json();
            APLIST = Ap;
            for (var j = 0; j < Ap.length; j++) {
              const CompanyContactFetch = await fetch(
                `${process.env.FS_BASEPATH}Company_CompanyContact/${Ap[j].PayTo}`,
                {
                  headers: { "x-api-key": process.env.JWT_KEY },
                }
              );
              if (CompanyContactFetch.status === 200) {
                const Contact = await CompanyContactFetch.json();
                //EACH HOUSE HAS AP MULTIPLE AP LIST
                APLIST[j] = { ...APLIST[j], PayToCustomer: Contact };
              } else {
                APLIST[j] = { ...APLIST[j] };
              }
            }
          }
          HOUSE[i] = { ...HOUSE[i], AP: APLIST };
        }
      }
    }

    return {
      props: {
        Cookie: cookies,
        AIMMAIN: MAIN,
        AIHMAIN: HOUSE,
        Firebase: process.env.FIREBASE_API_KEY,
      },
    };
  }
  return { props: { Cookie: cookies } };
}

export default Detail;
