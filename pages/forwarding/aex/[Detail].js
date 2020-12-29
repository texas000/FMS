/*
FILE: [DETAIL].JS

AIR IMPORT AND EXPORT DETAIL PAGE

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

const Detail = ({ Cookie, AIR, FILE, EXTRA }) => {
  const router = useRouter()
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
  const [Master, setMaster] = useState(false)
  const [House, setHouse] = useState(false)
  const [AP, setAP] = useState(false)
  
  useEffect(() => {
    !TOKEN && router.push("/login");
    if(AIR.status) {
        setMaster(AIR.M)
        setHouse(AIR.H)
        setAP(AIR.A)
        // console.log(AIR)
    } else {
        setMaster(false)
    }
  });

  const mailSubject = `[JW] ${AIR.H[0].CUSTOMER} MBL# ${AIR.M.F_MawbNo} HBL# ${AIR.H[0].F_HAWBNo} ETD ${moment(AIR.M.F_ETD).utc().format('l')} ETA ${moment(AIR.M.F_ETA).utc().format('l')} // ${AIR.M.F_RefNo}`
  const mailBody= `Dear ${AIR.H[0].CUSTOMER}
  \nPlease note that there is an OCEAN SHIPMENT for ${AIR.H[0].CUSTOMER} scheduled to depart on ${moment(AIR.M.F_ETA).utc().format('LL')}.`
  var emailHref = `mailto:?cc=${TOKEN && TOKEN.email}&subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`

  if(TOKEN && TOKEN.group) {
  return (
    <>
      <Layout TOKEN={TOKEN} TITLE={Master.F_RefNo}>
        {Master ? (<Container fluid={true}>
            <Head REF={Master.F_RefNo} POST={Master.F_PostDate} PIC={Master.F_U2ID} EMAIL={emailHref} />
            <Row>
              <Col lg={10}>
                  <Main TYPE="AIR" Master={Master} House={House} FILES={FILE} AP={AP} USER={TOKEN} EXTRA={EXTRA} />
              </Col>
              <Col lg={2}>
                  <Route ETA={Master.F_ETA} ETD={Master.F_ETD} DISCHARGE={Master.F_Discharge} LOADING={Master.F_LoadingPort}/>
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
  
  // FETCH AEX DATA FROM FREIGHT STREAM
  const FETCH = await fetch(`${process.env.BASE_URL}api/forwarding/airDetail`, {headers: {reference: query.Detail, import: 0}})
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
    console.log(jwt.decode(cookies.jamesworldwidetoken).username+` loaded forwarding/aex/`+query.Detail)
  }
  return { props: { Cookie: cookies, AIR: FJSON, FILE: Files, EXTRA: Extra } };
}

export default Detail;