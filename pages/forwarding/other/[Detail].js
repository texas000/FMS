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

const Detail = ({ Cookie, OTHER, GENMAIN }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    !TOKEN && router.push("/login");
    addLogData(GENMAIN[0]);
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
        {OTHER && OTHER.M ? (
          <Layout TOKEN={TOKEN} TITLE={OTHER.M.F_RefNo}>
            <Head
              REF={OTHER.M.F_RefNo}
              POST={OTHER.M.F_PostDate}
              PIC={OTHER.M.F_U2ID}
              CUSTOMER={OTHER.M.CUSTOMER || ""}
            />
            {/* Display only at print screen */}
            <p className="d-none d-print-block">
              Printed at {moment().format("lll")}
            </p>
            <Row>
              <Col lg={10}>
                <Row>
                  <Info Master={OTHER.M} />
                  <Col lg="6" className="mb-4">
                    <Forms
                      Master={OTHER.M}
                      AP={OTHER.A}
                      User={TOKEN}
                      Type="other"
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2} className="mb-4">
                <Route
                  ETA={OTHER.M.F_ETA}
                  ETD={OTHER.M.F_ETD}
                  FETA={OTHER.M.F_FETA}
                  DISCHARGE={OTHER.M.F_DisCharge}
                  LOADING={OTHER.M.F_LoadingPort}
                  DEST={OTHER.M.F_FinalDest}
                />
              </Col>
            </Row>

            <Comment reference={OTHER.M.F_RefNo} uid={TOKEN.uid} />
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

  if (fetchGenmainExt.status === 200) {
    MAIN = await fetchGenmainExt.json();
  }

  // IF DATA IS LOADED, FECTH OIM DETAIL INCLUDING HOUSE, AP, CONTAINER
  if (MAIN) {
    // FETCH OIM DATA FROM FREIGHT STREAM
    const fetchGen = await fetch(
      `${process.env.BASE_URL}api/forwarding/getOtherDetail`,
      { headers: { reference: query.Detail, key: cookies.jamesworldwidetoken } }
    );

    if (fetchGen.status === 200) {
      // WHEN OIM IS EMPTY, THIS WILL RETURN THE NOT FOUND PAGE
      const Gen = await fetchGen.json();
      return {
        props: {
          Cookie: cookies,
          OTHER: Gen,
          GENMAIN: MAIN,
        },
      };
    }
  }
  return { props: { Cookie: cookies } };

  // FETCH OTHER DATA FROM FREIGHT STREAM
  const fetchOther = await fetch(
    `${process.env.BASE_URL}api/forwarding/getOtherDetail`,
    { headers: { reference: query.Detail, key: cookies.jamesworldwidetoken } }
  );
  if (fetchOther.status === 200) {
    const Other = await fetchOther.json();
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
      props: { Cookie: cookies, OTHER: Other, EXTRA: Extra },
    };
  } else {
    return {
      props: { Cookie: cookies },
    };
  }
}

export default Detail;
