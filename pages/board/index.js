import cookie from "cookie";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";

const Index = ({ Cookie, Board }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [title, setTitle] = useState(false);
  const [body, setBody] = useState(false);
  const [modal, setModal] = useState(false);
  const [Text, setText] = useState("");
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;

  const toggle = () => setModal(!modal);

  const columns = [
    {
      dataField: "ID",
      text: "ID",
      align: "center",
      headerAlign: "center",
      hidden: true,
      sort: true,
    },
    {
      dataField: "TITLE",
      text: "TITLE",
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "WRITER",
      text: "WRITER",
      headerStyle: { width: "10%" },
      align: "center",
      headerAlign: "center",
    },
    {
      dataField: "VIEWS",
      text: "VIEWS",
      headerStyle: { width: "10%" },
      align: "center",
      headerAlign: "center",
      formatter: (cell) => (cell ? cell : 0),
    },
    {
      dataField: "TIME",
      text: "TIME",
      headerStyle: { width: "30%" },
      align: "center",
      headerAlign: "center",
      formatter: (cell) => moment(cell).utc().format("LLL"),
    },
  ];

  const defaultSorted = [
    {
      dataField: "ID",
      order: "desc",
    },
  ];

  const rowEvents = {
    onClick: (e, row, rowIndex) => {
      router.push(`board/${row.ID}`);
    },
  };
  const addNew = async () => {
    const value = `N'${decodeURIComponent(
      title.replace("'", "")
    )}', N'${Text.replace(/\'/g, "''")}', GETDATE(), 1, 0, ${TOKEN.uid}`;
    console.log(value);
    const Fetch = await fetch("/api/board/addPost", {
      body: value,
      method: "POST",
    });
    if (Fetch.status === 200) {
      alert("Upload success");
    } else {
      alert("Upload fail");
    }
    toggle();
    router.reload();
  };

  useEffect(() => {
    !TOKEN && router.push("/login");
  }, []);
  if (TOKEN && TOKEN.group) {
    return (
      <>
        <Head>
          <meta charSet="utf-8" />
        </Head>
        <Layout TOKEN={TOKEN} TITLE="Board">
          <Row>
            <Col>
              <div className="d-flex flex-sm-row justify-content-between">
                <h3>Board</h3>

                <Button
                  onClick={() => setModal(true)}
                  size="sm"
                  color="primary"
                  outline
                >
                  Write <i className="fa fa-edit fa-lg ml-2"></i>
                </Button>
              </div>
              {/* <p className="text-center text-primary">익명 사내 게시판은 직원 간의 정보 공유 / 기업문화 개선 제안 / 고민 상담 목적으로 만들어졌습니다</p> */}
              {/* <p className="text-center">게시판 주의사항: 칭찬 환영, 삭제 및 수정 불가</p> */}
            </Col>
            <Modal isOpen={modal} toggle={toggle} size="lg">
              <ModalHeader toggle={toggle} className="pl-4">
                Share your idea..
              </ModalHeader>
              <ModalBody className="pt-4 px-4">
                <InputGroup className="mb-2">
                  <Input
                    placeholder="TITLE"
                    onChange={(e) =>
                      setTitle(encodeURIComponent(e.target.value))
                    }
                  />
                </InputGroup>
              </ModalBody>
              <ModalBody className="px-4">
                <InputGroup className="mb-4">
                  {ReactQuill && (
                    <ReactQuill
                      value={Text}
                      onChange={setText}
                      style={{ width: "100%" }}
                    />
                  )}
                  {/* <Input
                    type="textarea"
                    placeholder="TYPE HERE"
                    style={{ height: "20rem" }}
                    onChange={(e) =>
                      setBody(encodeURIComponent(e.target.value))
                    }
                  /> */}
                </InputGroup>
              </ModalBody>
              <Button className="mx-4 my-4" color="success" onClick={addNew}>
                SUBMIT
              </Button>
            </Modal>
          </Row>
          <Card className="bg-transparent border-0">
            <Row className="my-4">
              <Col>
                <BootstrapTable
                  data={Board}
                  columns={columns}
                  rowEvents={rowEvents}
                  wrapperClasses="table-responsive"
                  keyField="ID"
                  striped
                  hover
                  condensed={true}
                  bordered={false}
                  defaultSorted={defaultSorted}
                />
              </Col>
            </Row>
          </Card>
        </Layout>
      </>
    );
  } else {
    return <p>Redirecting...</p>;
  }
};

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  const Fetch = await fetch(`${process.env.BASE_URL}api/board/getPost`);
  const Data = await Fetch.json();

  // Pass data to the page via props
  return { props: { Cookie: cookies, Board: Data } };
}

export default Index;
