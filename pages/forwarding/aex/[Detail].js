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

const Detail = ({ Cookie, AOMMAIN, AOHMAIN }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    !TOKEN && router.push("/login");
    if (AOMMAIN) {
      addLogData(AOMMAIN[0]);
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
  if (AOMMAIN) {
    mailSubject =
      AOMMAIN.length > 0
        ? `[JW] ${AOHMAIN[0].Customer_SName} MAWBNO# ${
            AOMMAIN[0].MawbNo
          } HAWBNO# ${AOHMAIN.map((na) => `${na.HAWBNo}`)} ETD ${moment(
            AOMMAIN[0].ETD
          )
            .utc()
            .format("l")} ETA ${moment(AOMMAIN[0].ETA).utc().format("l")} // ${
            AOMMAIN[0].RefNo
          }`
        : "";

    mailBody =
      AOMMAIN.length === 1
        ? `Dear ${AOHMAIN[0].Customer_SName}
      \nPlease note that there is an AIR EXPORT SHIPMENT for ${
        AOHMAIN[0].Customer_SName
      } scheduled to depart on ${moment(AOMMAIN[0].ETA).utc().format("LL")}.`
        : "";

    emailHref =
      AOHMAIN.length > 0
        ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
            mailSubject
          )}&body=${encodeURIComponent(mailBody)}`
        : "";
  }

  if (TOKEN && TOKEN.group) {
    return (
      <>
        {AOMMAIN ? (
          <Layout TOKEN={TOKEN} TITLE={AOMMAIN[0].RefNo}>
            <Head
              REF={AOMMAIN[0].RefNo}
              POST={AOMMAIN[0].PostDate}
              EMAIL={emailHref}
              CUSTOMER={AOHMAIN && AOHMAIN[0].Customer_SName}
            />
            {/* Display only at print screen */}
            <p className="d-none d-print-block">
              Printed at {moment().format("lll")}
            </p>
            <Row>
              <Col lg={10}>
                <Row>
                  <Info Master={AOMMAIN[0]} House={AOHMAIN} Containers={[]} />
                  <Col lg="6">
                    <Forms
                      Master={AOMMAIN[0]}
                      House={AOHMAIN}
                      User={TOKEN}
                      Type="air"
                    />
                    <Status
                      Ref={AOMMAIN[0].RefNo}
                      Uid={TOKEN.uid}
                      Main="aommain"
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2} className="mb-4">
                <Route
                  ETA={AOMMAIN[0].ETA}
                  ETD={AOMMAIN[0].ETD}
                  FETA={AOMMAIN[0].FETA}
                  DISCHARGE={AOMMAIN[0].DisCharge}
                  LOADING={AOMMAIN[0].LoadingPort}
                  DEST={AOMMAIN[0].FinalDest}
                />
              </Col>
            </Row>

            <Comment
              reference={AOMMAIN[0].RefNo}
              uid={TOKEN.uid}
              main={AOMMAIN[0]}
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
  const fetchAommainExt = await fetch(
    `${process.env.FS_BASEPATH}aommain_ext?RefNo=${query.Detail}`,
    {
      headers: { "x-api-key": process.env.JWT_KEY },
    }
  );

  // DEFINE FLASE VARIABLE
  var MAIN = false;
  var HOUSE = false;

  if (fetchAommainExt.status === 200) {
    MAIN = await fetchAommainExt.json();
  }

  // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
  if (MAIN) {
    // GET OIHMAIN FROM BLID
    const fecthAohmain = await fetch(
      `${process.env.FS_BASEPATH}aohmain?aomblid=${MAIN[0].ID}`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );
    if (fecthAohmain.status === 200) {
      HOUSE = await fecthAohmain.json();

      if (HOUSE.length > 0) {
        for (var i = 0; i < HOUSE.length; i++) {
          var APLIST = false;
          const fetchAP = await fetch(
            `${process.env.FS_BASEPATH}aphd?table=T_AOHMAIN&tbid=${HOUSE[i].ID}`,
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
        AOMMAIN: MAIN,
        AOHMAIN: HOUSE,
      },
    };
  }
  return { props: { Cookie: cookies } };
}

export default Detail;
