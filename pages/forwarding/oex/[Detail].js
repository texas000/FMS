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

const Detail = ({ Cookie, OOMMAIN, OOHMAIN, CONTAINER, Firebase }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    !TOKEN && router.push("/login");
    if (OOMMAIN) {
      addLogData(OOMMAIN[0]);
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
  if (OOMMAIN) {
    mailSubject =
      OOHMAIN.length > 0
        ? `[JW] ${OOHMAIN[0].Customer_SName} MBL# ${
            OOMMAIN[0].MBLNo
          } HBL# ${OOHMAIN.map((na) => `${na.HBLNo}`)} CNTR# ${
            CONTAINER.length != 0 &&
            CONTAINER.map((ga) => `${ga.oomcontainer.ContainerNo}`)
          } ETD ${moment(OOMMAIN[0].ETD).utc().format("l")} ETA ${moment(
            OOMMAIN[0].ETA
          )
            .utc()
            .format("l")} // ${OOMMAIN[0].RefNo}`
        : "";

    mailBody =
      OOMMAIN.length === 1
        ? `Dear ${OOHMAIN[0].Customer_SName}
      \nPlease note that there is an OCEAN EXPORT SHIPMENT for ${
        OOHMAIN[0].Customer_SName
      } scheduled to depart on ${moment(OOMMAIN[0].ETA).utc().format("LL")}.`
        : "";

    emailHref =
      OOHMAIN.length > 0
        ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
            mailSubject
          )}&body=${encodeURIComponent(mailBody)}`
        : "";
  }

  if (TOKEN && TOKEN.group) {
    return (
      <>
        {OOMMAIN ? (
          <Layout TOKEN={TOKEN} TITLE={OOMMAIN[0].RefNo}>
            <Head
              REF={OOMMAIN[0].RefNo}
              POST={OOMMAIN[0].PostDate}
              EMAIL={emailHref}
              CUSTOMER={OOMMAIN && OOHMAIN[0].Customer_SName}
            />
            {/* Display only at print screen */}
            <p className="d-none d-print-block">
              Printed at {moment().format("lll")}
            </p>
            <Row>
              <Col lg={10}>
                <Row>
                  <Info
                    Master={OOMMAIN[0]}
                    House={OOHMAIN}
                    Containers={CONTAINER}
                  />
                  <Col lg="6">
                    <Forms
                      Master={OOMMAIN[0]}
                      House={OOHMAIN}
                      Containers={CONTAINER}
                      User={TOKEN}
                      Type="ocean"
                    />
                    <Status
                      Ref={OOMMAIN[0].RefNo}
                      Uid={TOKEN.uid}
                      Main="oommain"
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2} className="mb-4">
                <Route
                  ETA={OOMMAIN[0].ETA}
                  ETD={OOMMAIN[0].ETD}
                  FETA={OOMMAIN[0].FETA}
                  DISCHARGE={OOMMAIN[0].DisCharge}
                  LOADING={OOMMAIN[0].LoadingPort}
                  DEST={OOMMAIN[0].FinalDest}
                />
              </Col>
            </Row>

            <Comment
              reference={OOMMAIN[0].RefNo}
              uid={TOKEN.uid}
              main={OOMMAIN[0]}
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
  const fetchOimmainExt = await fetch(
    `${process.env.FS_BASEPATH}oommain_ext?RefNo=${query.Detail}`,
    {
      headers: { "x-api-key": process.env.JWT_KEY },
    }
  );

  // DEFINE FLASE VARIABLE
  var MAIN = false;
  var HOUSE = false;
  var CONTAINER = false;

  if (fetchOimmainExt.status === 200) {
    MAIN = await fetchOimmainExt.json();
  }

  // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
  if (MAIN) {
    // GET OIHMAIN FROM BLID
    const fecthOihmain = await fetch(
      `${process.env.FS_BASEPATH}oohmain?oomblid=${MAIN[0].ID}`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );
    if (fecthOihmain.status === 200) {
      HOUSE = await fecthOihmain.json();

      // IF OIHMAIN EXISTS
      if (HOUSE.length > 0) {
        // FOR EACH OIHMAIN
        for (var i = 0; i < HOUSE.length; i++) {
          var APLIST = false;
          const fetchAP = await fetch(
            `${process.env.FS_BASEPATH}aphd?table=T_OOHMAIN&tbid=${HOUSE[i].ID}`,
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

    const fecthOomContainer = await fetch(
      `${process.env.FS_BASEPATH}oomcontainer_leftjoin_oohcontainer?oomblid=${MAIN[0].ID}`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );
    CONTAINER = await fecthOomContainer.json();

    // WHEN OIM IS EMPTY, THIS WILL RETURN THE NOT FOUND PAGE
    return {
      props: {
        Cookie: cookies,
        OOMMAIN: MAIN,
        OOHMAIN: HOUSE,
        Firebase: process.env.FIREBASE_API_KEY,
        CONTAINER,
      },
    };
  }
  return { props: { Cookie: cookies } };
}

export default Detail;
