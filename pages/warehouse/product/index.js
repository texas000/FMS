import cookie from 'cookie';
import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router';
import { Row, Col } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';

const Product = ({Cookie, Products}) => { 
  const router = useRouter() 
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   useEffect(()=>{
    !TOKEN && router.push("/login");
    console.log(Products)
   }, [])

   const columns = [{
    dataField: 'title',
    text: 'Title',
    sort: true,
  }, {
    dataField: 'product_type',
    text: 'Type',
    sort: true,
  }, {
    dataField: 'vendor',
    text: 'Vendor',
    sort: true,
  }, {
    dataField: 'variants[0].inventory_quantity',
    text: 'QTY',
    sort: true,
  }, {
    dataField: 'variants[0].sku',
    text: 'SKU',
    sort: true,
  }];

  const defaultSorted = [{
    dataField: 'id',
    order: 'desc'
  }];

   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN}>
         <h1>Product</h1>
         {Products && (
         <Row>
           <Col>
              <BootstrapTable
                  hover
                  keyField="id"
                  columns={columns}
                  data={Products.products}
                  rowStyle={{ height: "30px" }}
                  defaultSorted={defaultSorted}
              />
           </Col>
         </Row>)
         }
       </Layout>
      )
   } else {
     return (
       <p>Redirecting...</p>
     )
   }
}

Product.getInitialProps = async ({ req }) => {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  
  try {
    const res = await fetch(
      "https://jamesworldwide.myshopify.com/admin/api/2020-07/products.json",
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.APIKEY}:${process.env.APIPASS}`
            ).toString("base64"),
        },
      }
    );

    const productData = await res.json();

    return {
      Products: productData,
      Cookie: cookies,
    };
  } catch (error) {
    return { Cookie: cookies };
  }
}

export default Product;

