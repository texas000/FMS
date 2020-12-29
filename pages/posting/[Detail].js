import cookie from 'cookie'
import Layout from "../../components/Layout";
import { Container, Row, Col, Button, Input, ButtonGroup, Alert, Card } from "reactstrap";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import jwt from 'jsonwebtoken'

import moment from 'moment';

const Detail = ({ Cookie, Board, Comments}) => {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
  const A = Board.post
  useEffect(() => {
    !TOKEN && router.push("/login");
    console.log(Board)
    console.log(Comments)
  });

  const addComments = async (comment) => {
      const COMMENT = comment.replace("'", "")
      const TBID = A.ID
      const value = `'${TBID}', N'${COMMENT}', GETDATE()`
      const Fetch = await fetch("/api/board/addComment", {body: value, method: "POST"})
      if(Fetch.status===200) {
        router.reload()
      }
  }

  return (
    <>
      <Layout TOKEN={TOKEN}>
        <i id="back" className="fa fa-reply fa-lg" onClick={()=>router.back()}></i>
        {Board && Board.status ? (
          <>
            <Container>
              <Row className="mt-4">
                <Col>
                  <h1>{A.TITLE}</h1>
                  <span
                    style={{ position: "fixed", top: "2rem", right: "2rem" }}
                  >
                    {moment.utc(A.TIME).format("LLL")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={12}>
                  <h5>{A.BODY}</h5>
                </Col>
                <hr />
                <Col
                  lg={12}
                  style={{
                    marginTop: "10rem",
                    borderTop: "1px solid gray",
                    paddingTop: "2rem",
                  }}
                >
                  <h5>COMMENT</h5>
                  <Row>
                    <Col>
                      <Input className="mt-4 mb-4" placeholder="TYPE HERE" onKeyPress={(e) => {if (e.key == "Enter") addComments(e.target.value);}}/>
                    </Col>
                    {/* <Col lg="2">
                      <Button style={{position: 'absolute', top: '1.62rem', right: '0rem', borderRadius: '0'}}>SAVE</Button>
                    </Col> */}
                  </Row>
                  {Comments.status && 
                  Comments.comments.map(ga=>(    
                  <Row key={ga.ID} className="mt-3" lg={12} style={{marginTop: "10rem", borderBottom: "1px solid #EBEDEF"}}>
                      <Col>
                        <p style={{fontSize: '0.8rem'}}>{moment.utc(ga.TIME).calendar()}</p>
                        <p style={{color: 'gray'}}>{ga.COMMENT}</p>
                      </Col>
                      <hr />
                  </Row>
                  ))
                  }
                </Col>
              </Row>
            </Container>
          </>
        ) : (
          <Container>
            <h1>NOT EXIST</h1>
          </Container>
        )}
        <style jsx>
          {`
            @font-face {
              font-family: "NEXON Lv2 Gothic";
              src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                format("woff");
              font-weight: normal;
              font-style: normal;
            }
            h1, h2, h3, h4, h5, p {
              font-family: "NEXON Lv2 Gothic";
            }
            #back {
              color: 'blue'
            }
          `}
        </style>
      </Layout>
    </>
  );
};

export async function getServerSideProps({req, query}) {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  // Fetch data from FREIGHT STREAM
  const FETCH = await fetch(`${process.env.BASE_URL}api/board/getPostData`, {headers: {reference: query.Detail}})
  const FJSON = await FETCH.json();

  const COMFETCH = await fetch(`${process.env.BASE_URL}api/board/getComment`, {headers: {reference: query.Detail}})
  const COMMENTS = await COMFETCH.json();

  console.log(jwt.decode(cookies.jamesworldwidetoken).username+' LOADED BOARD/'+query.Detail)

  // Pass data to the page via props
  return { props: { Cookie: cookies, Board: FJSON, Comments: COMMENTS} };
}

export default Detail;