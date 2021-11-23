import moment from "moment";
import { useState } from "react";
import useSWR from "swr";

export default function Comments({ tbname, tbid, uid }) {
  const { data: comment, mutate } = useSWR(
    tbname && tbid ? `/api/comments/list?tbid=${tbid}&tbname=${tbname}` : null
  );
  // For Comment Textfield
  const ReactQuill =
    typeof window === "object" ? require("react-quill") : () => false;
  const [commentHtml, setCommentHtml] = useState("");
  async function handleCommentPost() {
    const postComment = await fetch(
      `/api/comments/post?tbid=${tbid}&tbname=${tbname}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ content: commentHtml }),
      }
    );
    if (postComment.status == 200) {
      mutate();
      setCommentHtml("");
    }
  }
  async function handleCommentHide(id) {
    const hideComment = await fetch(`/api/comments/hide?id=${id}`);
    if (hideComment.status == 200) {
      mutate();
    }
  }
  const Comments = ({ Comment }) => {
    if (Comment) {
      return (
        <div>
          {Comment.map((ga) => {
            if (ga.F_Show == "1") {
              return (
                <div
                  key={ga.F_ID}
                  className="bg-white dark:bg-gray-800 dark:text-gray-200 px-4 pb-2 antialiased flex w-100"
                >
                  {/* rounded-full h-8 w-8 mr-2 mt-1 */}
                  <div className="w-8 h-8 flex items-center justify-center bg-indigo-500 text-white mt-1 mr-2 rounded-full">
                    <span className="inline-block">{ga.FNAME.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl px-4 pt-2 pb-2.5">
                      <div className="font-semibold text-sm leading-relaxed">
                        {ga.FNAME} {ga.LNAME}
                      </div>
                      <div
                        className="text-normal leading-snug md:leading-normal"
                        dangerouslySetInnerHTML={{ __html: ga.F_Comment }}
                      ></div>
                    </div>
                    <div className="text-sm ml-4 mt-0.5 text-gray-500 dark:text-gray-400">
                      {moment(moment(ga.F_Date).utc().format("LLL")).fromNow()}
                    </div>
                    {uid == ga.F_UserID && (
                      <div
                        className="bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-full float-right -mt-10 mr-0.5 flex shadow items-center cursor-pointer"
                        onClick={() => handleCommentHide(ga.F_ID)}
                      >
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/126/126497.png"
                          width="20"
                          height="20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          })}
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="px-6 py-2 font-bold text-left text-gray-800 uppercase tracking-wider dark:text-white bg-gray-50 dark:bg-gray-800 border-b border-gray-200">
        COMMENT
      </div>
      {/* <div className="w-100 py-2 px-7 font-bold bg-gray-50 dark:bg-gray-700 tracking-wider border-b border-gray-200 mb-2">
        COMMENT
      </div> */}
      {ReactQuill && (
        <div className="p-3">
          <ReactQuill
            className="dark:text-white dark:placeholder-white"
            value={commentHtml}
            placeholder="Add a comment..."
            modules={{
              toolbar: {
                container: [
                  [{ header: [1, 2, 3, 4, 5, 6, false] }],
                  // [{ font: [] }],
                  // [{ align: [] }],
                  ["bold", "italic", "underline"],
                  [
                    { list: "ordered" },
                    { list: "bullet" },
                    {
                      color: [
                        "#000000",
                        "#e60000",
                        "#ff9900",
                        "#ffff00",
                        "#008a00",
                        "#0066cc",
                        "#9933ff",
                        "#ffffff",
                        "#facccc",
                        "#ffebcc",
                        "#ffffcc",
                        "#cce8cc",
                        "#cce0f5",
                        "#ebd6ff",
                        "#bbbbbb",
                        "#f06666",
                        "#ffc266",
                        "#ffff66",
                        "#66b966",
                        "#66a3e0",
                        "#c285ff",
                        "#888888",
                        "#a10000",
                        "#b26b00",
                        "#b2b200",
                        "#006100",
                        "#0047b2",
                        "#6b24b2",
                        "#444444",
                        "#5c0000",
                        "#663d00",
                        "#666600",
                        "#003700",
                        "#002966",
                        "#3d1466",
                        "custom-color",
                      ],
                    },
                    { background: [] },
                    "link",
                    // "image",
                  ],
                ],
              },
            }}
            theme="snow"
            onChange={setCommentHtml}
          />
        </div>
      )}
      <div className="px-3 mb-3">
        <button
          className="bg-indigo-500 text-white rounded px-4 py-2 mr-1 font-bold hover:bg-indigo-700"
          onClick={handleCommentPost}
          disabled={!commentHtml}
        >
          Save
        </button>
        <button
          className="bg-white dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-600 rounded px-4 py-2"
          onClick={() => setCommentHtml("")}
        >
          Cancel
        </button>
      </div>

      <Comments Comment={comment} />
    </div>
  );
}
