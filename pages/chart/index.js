import cookie from 'cookie';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';
import Layout from '../../components/Layout'
import Header from '../../components/Index/Header'
import YearChart from '../../components/Index/YearChart'
import OIM from '../../components/Index/OIM'
import AIM from '../../components/Index/AIM'
import { Row } from 'reactstrap';
import { useRouter } from 'next/router';

const Index = ({Cookie}) => { 
   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   const router = useRouter()
   const [Year, setYear] = useState({})
   const [Ocean, setOcean] = useState([])
   const [Air, setAir] = useState([])

   async function GET() {
    const year = await fetch('/api/chart/TotalYear').then(t=>t.json())    
    setYear(year[0])
    const ocean = await fetch('/api/chart/ocean').then(t=>t.json())    
    setOcean(ocean)
    const air = await fetch('/api/chart/AIM').then(t=>t.json())    
    setAir(air)
   }
   useEffect(()=>{
     console.log(TOKEN)
     !TOKEN && router.push("/login");
     GET()
   }, [])
   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN}>
         <Header />
         <Row>
           {Year && <YearChart Data={Year}/>}
           {Ocean && <OIM Data={Ocean}/>}
           {Air && <AIM Data={Air}/>}
         </Row>
       </Layout>
      )
   } else {
      return(<p>Redirecting...</p>)
   }
}

Index.getInitialProps = async ({ req }) => {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  return {
    Cookie: cookies
  }
}

export default Index;

