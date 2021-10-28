import cookie from "cookie";
import React, { useEffect, useMemo, useRef, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import "quill/dist/quill.snow.css";
import { post } from "axios";
import Loading from "../../components/Loader";

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);

    return {
      props: {
        token: token,
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

const Index = ({ token }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(false);
  const [Text, setText] = useState("");
  const quill = useRef(null);
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;

  const addNew = async () => {
    setLoading(true);
    const Write = {
      Title: title,
      body: Text,
      UserID: token.uid,
    };
    if (title == "") {
      alert("Error: Please add title!");
      return;
    }
    if (Text == "") {
      alert("Error: Please add text!");
      return;
    }

    const check = confirm("Would you like add the post?");
    if (check) {
      const fetchs = await fetch("/api/board/postBoard", {
        method: "POST",
        body: JSON.stringify(Write),
      });
      if (fetchs.status === 200) {
        router.push("/board");
        setLoading(false);
      } else {
        alert(fetchs.code);
        setLoading(false);
      }
    }
  };

  async function imageHandler() {
    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    const selection = quill.current.getEditorSelection();

    input.onchange = async () => {
      var file = input.files[0];
      if (file) {
        setLoading(true);
        const formData = new FormData();
        formData.append("userPhoto", file);
        try {
          const upload = new Promise((res, rej) => {
            res(
              post("/api/file/upload?ref=board", formData, {
                headers: {
                  "content-type": "multipart/form-data",
                  label: file.name,
                  level: 50,
                },
              })
            );
          });

          upload.then(async (ga) => {
            setLoading(false);
            if (ga.status == 200) {
              await quill.current.focus();
              console.log("image uploaded");
              quill.current
                .getEditor()
                .insertEmbed(
                  selection.index,
                  "image",
                  `https://jwiusa.com/api/file/get?ref=board&file=${file.name}`
                );
            } else {
              console.log("image upload failed");
            }
          });
        } catch (err) {
          setLoading(false);
          console.log(err);
        }
      }
    };
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [
            { header: "1" },
            { header: "2" },
            { header: [3, 4, 5, 6] },
            { font: [] },
          ],
          [{ size: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "video"],
          ["link", "image", "video"],
          ["clean"],
          [{ color: [] }],
          ["code-block"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );
  // useEffect(() => {
  //   console.log(quill.current.getEditorSelection());
  // }, [quill]);

  return (
    <Layout TOKEN={token} TITLE="Board" LOADING={loading}>
      <div className="flex justify-between">
        <h3 className="dark:text-white">Add Posting</h3>
      </div>
      <div className="p-3">
        <input
          className="block w-full py-2 px-4 border border-gray-500"
          placeholder="Title..."
          onChange={(e) => setTitle(e.target.value)}
        ></input>

        {ReactQuill && (
          <ReactQuill
            ref={quill}
            value={Text}
            onChange={setText}
            modules={modules}
            className="w-full my-3 bg-white"
          />
        )}
        <button
          onClick={addNew}
          className="bg-indigo-500 text-white rounded px-4 py-2 mr-1 font-bold hover:bg-indigo-700"
        >
          Save
        </button>
        <button
          onClick={() => setText("")}
          className="bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </Layout>
  );
};

export default Index;
