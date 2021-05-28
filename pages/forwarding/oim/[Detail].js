import cookie from "cookie";
import Layout from "../../../components/Layout";
import { Row, Col, Alert, Button } from "reactstrap";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect } from "react";
import Head from "../../../components/Forwarding/Head";
import Route from "../../../components/Forwarding/Route";
import moment from "moment";
import { Comment } from "../../../components/Forwarding/Comment";
import jwt from "jsonwebtoken";
import Info from "../../../components/Forwarding/Info";
import Forms from "../../../components/Forwarding/Forms";
import Status from "../../../components/Forwarding/Status";

const Detail = ({ Cookie, OIMMAIN, OIHMAIN, CONTAINER, Firebase }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    !TOKEN && router.push("/login");
    if (OIMMAIN) {
      addLogData(OIMMAIN[0]);
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
  if (OIMMAIN) {
    mailSubject =
      OIHMAIN.length > 0
        ? `[JW] ${OIHMAIN && OIHMAIN[0].Customer_SName} MBL# ${
            OIMMAIN[0].MBLNo
          } HBL# ${OIHMAIN && OIHMAIN.map((na) => `${na.HBLNo}`)} CNTR# ${
            CONTAINER && CONTAINER.map((ga) => `${ga.oimcontainer.ContainerNo}`)
          } ETD ${moment(OIMMAIN[0].ETD).utc().format("l")} ETA ${moment(
            OIMMAIN[0].ETA
          )
            .utc()
            .format("l")} // ${OIMMAIN[0].RefNo}`
        : "";

    mailBody =
      OIMMAIN.length === 1
        ? `Dear ${OIHMAIN && OIHMAIN[0].Customer_SName}
      \nPlease note that there is an OCEAN IMPORT SHIPMENT for ${
        OIHMAIN && OIHMAIN[0].Customer_SName
      } scheduled to depart on ${moment(OIMMAIN[0].ETA).utc().format("LL")}.`
        : "";

    emailHref =
      OIHMAIN.length > 0
        ? `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(
            mailSubject
          )}&body=${encodeURIComponent(mailBody)}`
        : "";
  }

  if (TOKEN && TOKEN.group) {
    return (
      <>
        {OIMMAIN ? (
          <Layout TOKEN={TOKEN} TITLE={OIMMAIN[0].RefNo}>
            {/* HEAD - DONE */}
            <Head
              REF={OIMMAIN[0].RefNo}
              POST={OIMMAIN[0].PostDate}
              EMAIL={emailHref}
              CUSTOMER={OIHMAIN && OIHMAIN[0].Customer_SName}
            />
            {/* Display only at print screen */}
            <p className="d-none d-print-block">
              Printed at {moment().format("lll")}
            </p>
            <Row>
              <Col lg={10}>
                <Row>
                  <Info
                    Master={OIMMAIN[0]}
                    House={OIHMAIN}
                    Containers={CONTAINER}
                  />
                  <Col lg="6">
                    <Forms
                      Master={OIMMAIN[0]}
                      House={OIHMAIN}
                      Containers={CONTAINER}
                      User={TOKEN}
                      Type="ocean"
                    />
                    <Status
                      Ref={OIMMAIN[0].RefNo}
                      Uid={TOKEN.uid}
                      Main="oimmain"
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2} className="mb-4">
                {/* ROUTE - DONE */}
                <Route
                  ETA={OIMMAIN[0].ETA}
                  ETD={OIMMAIN[0].ETD}
                  FETA={OIMMAIN[0].FETA}
                  DISCHARGE={OIMMAIN[0].DisCharge}
                  LOADING={OIMMAIN[0].LoadingPort}
                  DEST={OIMMAIN[0].FinalDest}
                />
              </Col>
            </Row>

            <Comment
              reference={OIMMAIN[0].RefNo}
              uid={TOKEN.uid}
              main={OIMMAIN[0]}
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
  // DEFINE FLASE VARIABLE, WHEN THE DATA IS NOT FETCHED, RETURN FALSE
  var MAIN = false;
  var HOUSE = false;
  var CONTAINER = false;

  // ----- FETCH OIM EXT (OIMMAIN DATA + STATUS DATA)
  const fetchOimmainExt = await fetch(
    `${process.env.FS_BASEPATH}oimmain_ext?RefNo=${query.Detail}`,
    {
      headers: { "x-api-key": process.env.JWT_KEY },
    }
  );
  // ASSIGN MAIN
  if (fetchOimmainExt.status === 200) {
    MAIN = await fetchOimmainExt.json();
    // ----- GET OIHMAIN FROM BLID
    const fecthOihmain = await fetch(
      `${process.env.FS_BASEPATH}oihmain?oimblid=${MAIN[0].ID}`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );
    if (fecthOihmain.status === 200) {
      HOUSE = await fecthOihmain.json();

      if (HOUSE.length > 0) {
        for (var i = 0; i < HOUSE.length; i++) {
          var APLIST = false;
          const fetchAP = await fetch(
            `${process.env.FS_BASEPATH}aphd?table=T_OIHMAIN&tbid=${HOUSE[i].ID}`,
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
    // ----- FETCH CONTAINER FROM BLID
    const fecthOimContainer = await fetch(
      `${process.env.FS_BASEPATH}oimcontainer_leftjoin_oihcontainer?oimblid=${MAIN[0].ID}`,
      {
        headers: { "x-api-key": process.env.JWT_KEY },
      }
    );
    // ASSIGN CONTAINER
    if (fecthOimContainer.status === 200) {
      CONTAINER = await fecthOimContainer.json();
    }
    return {
      props: {
        Cookie: cookies,
        OIMMAIN: MAIN,
        OIHMAIN: HOUSE,
        Firebase: process.env.FIREBASE_API_KEY,
        CONTAINER,
      },
    };
  } else {
    return { props: { Cookie: cookies } };
  }
}

export default Detail;
