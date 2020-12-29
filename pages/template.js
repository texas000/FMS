import cookie from 'cookie';
import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../components/Layout'
import { useRouter } from 'next/router';

const Index = ({Cookie}) => {
   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   const router = useRouter()

   useEffect(()=>{
     !TOKEN && router.push("/login");
   }, [])
   if(TOKEN && TOKEN.group) {
     return (
       <>
         <Layout TOKEN={TOKEN}>
           <h1>Hello World</h1>
         </Layout>
       </>
     );
   } else {
      return(<p>Redirecting...</p>)
   }
}

export async function getServerSideProps({req}) {
    const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)

    console.log(jwt.decode(cookies.jamesworldwidetoken).username+' LOADED TEMPLATE')
    // Pass data to the page via props
    return { props: { Cookie: cookies } };
  }

export default Index;

