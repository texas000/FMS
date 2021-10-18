import cookie from "cookie";
import React, { useEffect, useState } from "react";
import Head from "next/head";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import BootstrapTable from "react-bootstrap-table-next";
import "quill/dist/quill.snow.css";
import moment from "moment";

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    const Fetch = await fetch(`${process.env.BASE_URL}api/board/getPost`);
    const Data = await Fetch.json();
    return {
      props: {
        token: token,
        Board: Data,
      },
    };
  } catch (err) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
}

const Index = ({ token, Board }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const columns = [
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
      setLoading(true);
      router.push(`/board/${row.ID}`);
    },
  };

  return (
    <Layout TOKEN={token} TITLE="Board" LOADING={!Board || loading}>
      <div className="flex justify-between">
        <h3 className="dark:text-white">Board</h3>

        <button
          onClick={() => {
            setLoading(true);
            router.push("/board/add");
          }}
          className="bg-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
        >
          Write <i className="fa fa-edit fa-lg ml-2"></i>
        </button>
      </div>

      <div className="p-3">
        <div className="card overflow-hidden">
          <BootstrapTable
            data={Board}
            columns={columns}
            rowEvents={rowEvents}
            wrapperClasses="w-auto"
            headerClasses="dark:text-white bg-gray-50 text-gray-700 font-semibold"
            rowClasses="hover:bg-indigo-500 hover:text-white cursor-pointer border-b border-gray-200 dark:bg-gray-700 dark:text-white"
            keyField="ID"
            condensed={true}
            bordered={false}
            defaultSorted={defaultSorted}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
