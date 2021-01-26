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
import Info from "../../../components/Forwarding/OtherInfo";
import Forms from "../../../components/Forwarding/Forms";
import Status from "../../../components/Forwarding/Status";

const Detail = ({ Cookie, OTHER, EXTRA }) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);

  useEffect(() => {
    !TOKEN && router.push("/login");
    // console.log(OTHER);
  });

  if (TOKEN && TOKEN.group) {
    return (
      <>
        {OTHER.M ? (
          <Layout TOKEN={TOKEN} TITLE={OTHER.M.F_RefNo}>
            <Head
              REF={OTHER.M.F_RefNo}
              POST={OTHER.M.F_PostDate}
              PIC={OTHER.M.F_U2ID}
            />
            <Row>
              <Col lg={10}>
                <Row>
                  <Info Master={OTHER.M} />
                  <Col md="6">
                    <Forms Master={OTHER.M} AP={OTHER.A} />
                    <Status
                      Data={EXTRA.S}
                      Ref={OTHER.M.F_RefNo}
                      Uid={TOKEN.uid}
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={2}>
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

            <Comment
              comment={EXTRA.M}
              reference={OTHER.M.F_RefNo}
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

  // FETCH OTHER DATA FROM FREIGHT STREAM
  const fetchOther = await fetch(
    `${process.env.BASE_URL}api/forwarding/getOtherDetail`,
    { headers: { reference: query.Detail, key: cookies.jamesworldwidetoken } }
  );
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
}

export default Detail;
