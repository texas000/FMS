import cookie from 'cookie';
import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
// import fetch from 'node-fetch';
import Layout from '../../components/Layout'
import { Button, Col, FormGroup, FormText, Input, Label, Row } from 'reactstrap';
import { useRouter } from 'next/router';
import readXlsxFile from 'read-excel-file'

const Index = ({Cookie}) => { 
   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   const router = useRouter()

   const [File, setFile] = useState(false);

   const showFile = async (e) => {
        e.preventDefault();
        var f = e.target.files[0];
        if(f) {
            console.log(f)
            readXlsxFile(e.target.files[0]).then(async (rows)=>{
                var Query = ''
                rows.map((ga, i) => {
                    if(i) {
                        Query += `UPDATE T_FREIGHT_ADD SET F_HBL=N'${ga[0]}', F_OF=N'${ga[1]}', F_DO=N'${ga[2]}', F_STATUS=N'${ga[3]}', F_AN=N'${ga[4]}', F_CB=N'${ga[5]}', F_ARRIVAL=N'${ga[6]}', F_REF=N'${ga[7]}' WHERE F_HBL=N'${ga[0]}'
                        IF @@ROWCOUNT=0 INSERT INTO T_FREIGHT_ADD (${rows[0].toString()}) VALUES (N'${ga[0]}', N'${ga[1]}', N'${ga[2]}', N'${ga[3]}', N'${ga[4]}', N'${ga[5]}', N'${ga[6]}', N'${ga[7]}');`
                    }
                })
                return Query
            }).then(async queryText=>{
                setFile(queryText)
            })
        } else {
            console.log("NO FILE SELECTED")
        }
   }

   async function HandleUpload (){
        const fetchs = await fetch('/api/test', {method: 'POST', body: File});
        if(fetchs.status===200) {
            alert("SUCCESS")
        } else {
            alert("FAIL")
        }
   }

   useEffect(()=>{
     !TOKEN && router.push("/login");
   }, [])
   if(TOKEN && TOKEN.group) {
     return (
       <Layout TOKEN={TOKEN}>
         <h1 className="mb-4">DATA IMPORT</h1>
        <Row>
            <Col>
        <Label>Excel File</Label>
        <Input type="file" name="file" onChange={showFile}/>
        <FormText color="muted">
          This is some placeholder block-level help text for the above input.
          It's a bit lighter and easily wraps to a new line.
        </FormText>
        {File && <Button onClick={HandleUpload}>Import</Button>}
        </Col>
        <Col>
        {File && <p>{File}</p>}
        </Col>
        </Row>
         <FormGroup>
      </FormGroup>
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

