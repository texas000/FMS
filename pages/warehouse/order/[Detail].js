import cookie from 'cookie'
import Layout from "../../../components/Layout";
import { Container, Row, Col, Button, Card, CardHeader, CardBody } from "reactstrap";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";

import moment from "moment";
import jwt from 'jsonwebtoken'

const Detail = ({ Cookie, Orders }) => {
  const router = useRouter();
  const [Data, setData] = useState();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
  async function A() {
      const res = await fetch("/api/order/detail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Order: Orders }),
      });
      const A = await res.json()
      setData(A.order)
      console.log(A)
  }


  useEffect(() => {
    A()
  }, []);
  return (
    <Layout TOKEN={TOKEN}>
      <h1>Order Detail</h1>
      {Data && (<Row>
          <Col>
          <h3>{Data.order_number}</h3>
          <Row>
          {Data.line_items.map((ga,i)=>(
              <Card key={i} className="ml-2 mr-2 mt-2">
                  <CardHeader>{ga.name}</CardHeader>
                  <CardBody>
                      <p>SKU: {ga.sku}</p>
                      <p>QTY: {ga.quantity}</p>
                      <p>Vendor: {ga.vendor}</p>
                  </CardBody>
              </Card>
          ))}
          </Row>
          </Col>
      </Row>
      )}
    </Layout>
  );
};

Detail.getInitialProps = async ({ req, query }) => {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  var OrderNum = query.Detail;
  return {
      Cookie: cookies,
      Orders: OrderNum
  }
};

export default Detail;