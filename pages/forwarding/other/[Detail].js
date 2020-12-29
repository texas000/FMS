/*
FILE: [DETAIL].JS

OTHER DETAIL PAGE

CONSIST WITH THREE PART - HEAD, ROUTE, MAIN

HEAD - HEADER / BACK, SHARE BUTTONS
MAIN - [LEFT] OVERALL INFO WITH HOUSE, CONTAINER INFO
ROUTE - DISCHARGE, ARRIVAL
*/
import cookie from 'cookie'
import Layout from "../../../components/Layout";
import { Container, Row, Col, Button, Alert } from "reactstrap";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import Head from "../../../components/Forwarding/Head";
import Main from "../../../components/Forwarding/Main";
import Route from "../../../components/Forwarding/Route";
import moment from 'moment';

import jwt from 'jsonwebtoken'

const Detail = ({ Cookie, OTHER, FILE, EXTRA }) => {
  const router = useRouter()
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
  const [Oth, setOth] = useState(false)
  const [AP, setAP] = useState(false)
  
  useEffect(() => {
    !TOKEN && router.push("/login");
    if(OTHER.status) {
        setOth(OTHER.M)
        setAP(OTHER.A)
        // console.log(OTHER)
    } else {
        setOth(false)
    }
  });

  const mailSubject = `[JW] ${Oth.CUSTOMER} ${Oth.F_Mblno&&'MBL# '+Oth.F_Mblno+' '}${Oth.F_Hblno&&'HBL# '+Oth.F_Hblno} ETD ${moment(Oth.F_ETD).utc().format('l')} ETA ${moment(Oth.F_ETA).utc().format('l')} // ${Oth.F_RefNo}`
  const mailBody= `Dear ${Oth.CUSTOMER}
  \nPlease note that there is an OCEAN SHIPMENT for ${Oth.CUSTOMER} scheduled to depart on ${moment(Oth.F_ETA).utc().format('LL')}.`
  var emailHref = `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

  if(TOKEN && TOKEN.group) {
  return (
    <>
      <Layout TOKEN={TOKEN} TITLE={Oth.F_RefNo}>
        {Oth ? (<Container fluid={true}>
            <Head REF={Oth.F_RefNo} PIC={Oth.F_U2ID} POST={Oth.F_PostDate} EMAIL={emailHref}/>
            <Row>
              <Col lg={10}>
                  <Main TYPE="OTHER" CUST={Oth.CUSTOMER} OTHER={Oth} MBL={Oth.F_Mblno} HBL={Oth.F_Hblno} FILES={FILE} AP={AP} USER={TOKEN} EXTRA={EXTRA} />
              </Col>
              <Col lg={2}>
                  <Route ETA={Oth.F_ETA} ETD={Oth.F_ETD} DISCHARGE={Oth.F_Discharge} LOADING={Oth.F_LoadingPort}/>
              </Col>
            </Row>
            </Container>
        ) : (
            <Container fluid={true}>
            <Row>
              <Col className="text-center">
                <Alert color="danger">
                  ERROR: {router.query.Detail} NOT FOUND!
                </Alert>
                <Button
                  color="secondary"
                  style={{borderRadius: '0'}}
                  onClick={() => router.back()}
                >
                  Return To Page
                </Button>
              </Col>
            </Row>
          </Container>
        )
        }
      </Layout>
    </>
  )} else {
    return (<p>Redirecting...</p>)
  }
};

export async function getServerSideProps({req, query}) {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  
  // FETCH OTHER DATA FROM FREIGHT STREAM
  const FETCH = await fetch(`${process.env.BASE_URL}api/forwarding/otherDetail`, {headers: {reference: query.Detail}})
  const FJSON = await FETCH.json();

  // FETCH FILE DATA FROM SYNOLOGY
  const Fetch = await fetch(`${process.env.BASE_URL}api/files/FORWARDING/${query.Detail}`)
  var Files=null;
  if(Fetch.status===200) {
    Files = await Fetch.json()
  }

  // FETCH EXTRA DATA FROM FMS
  const EX_Fetch = await fetch(`${process.env.BASE_URL}api/forwarding/getExtra`, {headers: {ref: query.Detail}})
  var Extra=null;
  if(EX_Fetch.status==200) {
    Extra = await EX_Fetch.json()
  }

  //LOG
  if(cookies.jamesworldwidetoken) {
    console.log(jwt.decode(cookies.jamesworldwidetoken).username+' LOADED FORWARDING/OTHER/'+query.Detail)
  }
  return { props: { Cookie: cookies, OTHER: FJSON, FILE: Files, EXTRA: Extra } };
}

export default Detail;