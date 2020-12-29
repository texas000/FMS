import cookie from 'cookie';
import React, { useEffect } from 'react';
import jwt from 'jsonwebtoken';
import Layout from '../../components/Layout'
import { useRouter } from 'next/router';
const Account = ({Cookie}) => { 
  const router = useRouter() 
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   useEffect(()=>{
    !TOKEN && router.push("/login");
    console.log(TOKEN)
   }, [])
   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN}>
         <h1>Account</h1>
         
         <h3>User: {TOKEN.username}</h3>
         <h3>Group: {TOKEN.group}</h3>
         <h3>Accounts: {TOKEN.account && TOKEN.account.length}</h3>
       </Layout>
      )
   } else {
     return (
       <p>Redirecting...</p>
     )
   }
}

Account.getInitialProps = async ({ req }) => {
  const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
  return {
    Cookie: cookies
  }
}

export default Account;

