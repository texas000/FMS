import cookie from 'cookie';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import jwt from 'jsonwebtoken';
import Layout from '../../components/Layout'
import { useRouter } from 'next/router';
import { Button, Card, Col, Input, Row, InputGroup, InputGroupAddon, InputGroupText, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import moment from 'moment'

const Index = ({Cookie, Board}) => {
   const TOKEN = jwt.decode(Cookie.jamesworldwidetoken)
   const router = useRouter()
   const [title, setTitle] = React.useState(false)
   const [body, setBody] = React.useState(false)
   const [modal, setModal] = useState(false);
   const toggle = () => setModal(!modal);
   
   const columns = [
      {
        dataField: "ID",
        text: "ID",
        headerStyle: { fontFamily: "NEXON Lv2 Gothic" }, 
        style: {fontFamily: "NEXON Lv2 Gothic"},
        align: 'center',
        headerAlign: 'center',
        hidden: true,
        sort: true,
      },
      {
        dataField: "TITLE",
        text: "TITLE",
        headerStyle: { fontFamily: "NEXON Lv2 Gothic" }, 
        style: {fontFamily: "NEXON Lv2 Gothic"},
        align: 'center',
        headerAlign: 'center',
      },
      {
        dataField: "VIEWS",
        text: "VIEWS",
        headerStyle: { width: '10%', fontFamily: "NEXON Lv2 Gothic" }, 
        style: {fontFamily: "NEXON Lv2 Gothic"},
        align: 'center',
        headerAlign: 'center',
        formatter: (cell)=>(cell ? cell : 0),
      },
      {
        dataField: "TIME",
        text: "TIME",
        headerStyle: { width: '20%', fontFamily: "NEXON Lv2 Gothic" }, 
        style: {fontFamily: "NEXON Lv2 Gothic"},
        align: 'center',
        headerAlign: 'center',
        formatter: (cell)=>(moment(cell).utc().format('LLL')),
      },
   ]

   const defaultSorted = [{
    dataField: 'ID',
    order: 'desc',
    }];

   const rowEvents = {
       onClick: (e, row, rowIndex) => {
           router.push(`board/${row.ID}`)
       }
   }
   const addNew = async () => {
       const value = (`N'${decodeURIComponent(title.replace("'", ""))}', N'${decodeURIComponent((body.replace('%0A', `'+CHAR(13)+N'`)))}', GETDATE(), 1`)
       console.log(value)
       const Fetch = await fetch("/api/board/addPost", {body: value, method: "POST"})
       console.log(Fetch.status)
       toggle()
       router.reload();
   }

   useEffect(()=>{
     !TOKEN && router.push("/login");
   }, [])
   if(TOKEN && TOKEN.group) {
     return (
       <>
         <Head>
           <meta charSet="utf-8" />
         </Head>
         <Layout TOKEN={TOKEN} TITLE="BOARD">
           <Row>
             <Col>
               <h3 style={{fontFamily: 'Roboto, sans-serif', fontWeight: '700'}}>Board</h3>
               <p>익명 사내 게시판</p>
               <p className="text-center text-primary">익명 사내 게시판은 직원 간의 정보 공유 목적 / 기업문화 개선 제안 목적 / 고민 상담 목적으로 만들어졌습니다</p>
               <p className="text-center">게시판 주의사항: 험담 금지, 칭찬 환영, 삭제 및 수정 불가</p>
               <a style={{ position: "fixed", right: "2rem", top: "2rem", color: '#4582ec' }} onClick={() => setModal(true)}>
                <span>작성하기</span>
               <i
                 className="fa fa-edit fa-lg ml-2"
               ></i>
               </a>
             </Col>
             <Modal isOpen={modal} toggle={toggle} size="lg">
               <ModalHeader
                 toggle={toggle}
                 className="pl-4"
                 style={{ fontFamily: "NEXON Lv2 Gothic" }}
               >
                 게시글 작성
               </ModalHeader>
               <ModalBody className="pt-4 px-4">
                 <InputGroup className="mb-2">
                   <Input placeholder="TITLE" style={{ fontFamily: "NEXON Lv2 Gothic" }} onChange={e=>setTitle(encodeURIComponent(e.target.value))} />
                 </InputGroup>
               </ModalBody>
               <ModalBody className="px-4">
                 <InputGroup className="mb-2">
                   <Input type="textarea" placeholder="TYPE HERE" style={{ fontFamily: "NEXON Lv2 Gothic", height: '20rem' }} onChange={e=>setBody(encodeURIComponent(e.target.value))} />
                 </InputGroup>
               </ModalBody>
               <Button className="mx-4 my-4" color="success" onClick={addNew}>SUBMIT</Button>
             </Modal>
           </Row>
           {/* {encodeURIComponent(text)} */}
           <Row className="my-4">
             <Col>
               <BootstrapTable
                 data={Board}
                 columns={columns}
                 rowEvents={rowEvents}
                 keyField="ID"
                 striped
                 hover
                 condensed={true}
                 bordered={false}
                 defaultSorted={defaultSorted}
               />
             </Col>
           </Row>
           <style jsx>
             {`
               @font-face {
                 font-family: "NEXON Lv2 Gothic";
                 src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff")
                   format("woff");
                 font-weight: normal;
                 font-style: normal;
               }
               h1,
               h4, h5,
               p {
                 font-family: "NEXON Lv2 Gothic";
               }
             `}
           </style>
         </Layout>
       </>
     );
   } else {
      return(<p>Redirecting...</p>)
   }
}

export async function getServerSideProps({req}) {
    const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
    
    const Fetch = await fetch(`${process.env.BASE_URL}api/board/getPost`)
    const Data = await Fetch.json()

    if(cookies.jamesworldwidetoken) {
      console.log(jwt.decode(cookies.jamesworldwidetoken).username+' loaded board')
    }
    // Pass data to the page via props
    return { props: { Cookie: cookies, Board: Data } };
  }

export default Index;

