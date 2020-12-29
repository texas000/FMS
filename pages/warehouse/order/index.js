import cookie from 'cookie';
import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../../components/Layout'
import { useRouter } from 'next/router';
import BootstrapTable from 'react-bootstrap-table-next';
import { Row, Col } from 'reactstrap';
import moment from 'moment'

const Order = ({Cookie, Orders}) => { 
  const router = useRouter() 
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   useEffect(()=>{
    !TOKEN && router.push("/login");
    console.log(Orders)
   }, [])
   const columns = [{
    dataField: 'order_number',
    text: 'Order',
    sort: true,
  }, {
    dataField: 'line_items[0].name',
    text: 'Item',
    sort: true,
  }, {
    dataField: 'line_items',
    text: 'QTY',
    sort: true,
    formatter: (cell)=> {
      var items = 0
      cell.map(ga=>{
        items += ga.quantity
      })
      return(items)
    }
  }, {
    dataField: 'created_at',
    text: 'Created',
    sort: true,
    formatter: (cell)=> {
      return(moment(cell).format('ll'))
    }
  }];

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      router.push("/warehouse/order/[Detail]", `/warehouse/order/${row.id}`)
    }
  };

  const defaultSorted = [{
    dataField: 'id',
    order: 'desc'
  }];

   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN}>
         <h1>Order</h1>
         
         <Row>
           <Col>
            <BootstrapTable
              hover
              keyField="id"
              columns={columns}
              data={Orders ? Orders.orders : []}
              rowEvents={rowEvents}
              rowStyle={{ height: "30px" }}
              defaultSorted={defaultSorted}
            />
           </Col>
         </Row>
       </Layout>
      )
   } else {
     return (
       <p>Redirecting...</p>
     )
   }
}

export async function getServerSideProps({req}) {
  // Fetch data from external API
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  try {
    const res = await fetch(
      "https://jamesworldwide.myshopify.com/admin/api/2020-07/orders.json?status=any",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(
              `${process.env.APIKEY}:${process.env.APIPASS}`
            ).toString("base64"),
        },
      }
    );
    const orderData = await res.json();
      
    // Pass data to the page via props
      return {
        props: {
          Orders: orderData,
          Cookie: cookies
        }
      };
    } catch (error) {
      return {
        props : {
          Cookie: cookies}
        };
  }
}

export default Order;

