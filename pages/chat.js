import Layout from "../components/Layout";
import cookie from "cookie";
import jwt from "jsonwebtoken";
// import Select from "react-select";
import AsyncSelect from "react-select/async";
import useSWR from "swr";
import Link from "next/link";
import { createRef, useEffect, useState } from "react";
import router from "next/router";
import moment from "moment";

export async function getServerSideProps({ req, query }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    return {
      props: {
        token: token,
        selected: query.user || false,
      },
    };
  } catch (err) {
    return {
      props: { token: false },
    };
  }
}

export default function search(props) {
  const messageBottom = createRef(null);
  const scrollToBottom = () => {
    if (messageBottom.current) {
      messageBottom.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const { data: users } = useSWR("/api/message/getChatableUser");

  const [selectedUser, setSelectedUser] = useState(false);
  const [msg, setMsg] = useState("");

  const { data: message, mutate: getMessage } = useSWR(
    props.selected
      ? `/api/message/getSingleUserChat?id=${props.selected}`
      : null,
    { refreshInterval: 1100 }
  );
  async function sendAnnounce(e) {
    await fetch("/api/message/oneSignalPostNew", {
      method: "POST",
      body: e,
    });
  }

  useEffect(() => {
    if (props.selected && users) {
      const user = users.filter((user) => user.F_ID == props.selected);
      if (user.length) {
        setSelectedUser(user[0]);
      }
    }
    getMessage();
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  }, [message, messageBottom]);
  async function sendMessage() {
    if (!selectedUser) {
      alert("PLEASE SELECT USER TO SEND MESSAGE");
      return;
    }
    if (!msg || msg == "") {
      alert("PLEASE TYPE SOMETHING");
      return;
    }
    const postMsg = await fetch("/api/message/sendMessageFromChat", {
      method: "POST",
      body: JSON.stringify({
        message: msg,
        sendto: selectedUser.F_ID,
      }),
    });
    if (postMsg.status == 200) {
      getMessage();
      setMsg("");
    } else {
      alert(postMsg.status);
    }
    if (selectedUser.F_SlackID) {
      await fetch(
        `/api/message/oneSignalPostToUser?id=${selectedUser.F_SlackID}`,
        {
          method: "POST",
          body: JSON.stringify({
            english: msg,
            title: `MESSAGE FROM ${props.token.first}`,
            url: `/chat?user=${props.token.uid}`,
            to: selectedUser.F_SlackID,
          }),
        }
      );
    }

    // console.log(send);
  }
  return (
    <Layout TOKEN={props.token} TITLE="Chat">
      <div className="flex flex-sm-row justify-between">
        <h3 className="dark:text-white mb-3">Chat</h3>
      </div>
      <div className="flex my-2">
        <input
          type="text"
          placeholder="Announcement message to all"
          className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-full py-3 border-2 border-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendAnnounce(e.target.value);
            }
          }}
        />
      </div>
      <div className="grid grid-flow-col grid-cols-4 gap-4">
        <div className="col-span-1">
          <div
            className="card overflow-auto"
            style={{ minHeight: "780px", maxHeight: "780px" }}
          >
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    colSpan={2}
                    className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider"
                  >
                    Users
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 text-xs text-gray-500 dark:text-white">
                {users &&
                  users.map((ga) => (
                    <tr
                      key={ga.F_ID}
                      className={
                        props.selected == ga.F_ID
                          ? "bg-indigo-500 text-white font-bold"
                          : "hover:bg-indigo-500 hover:text-white cursor-pointer"
                      }
                      onClick={() => {
                        setSelectedUser(ga);
                        router.push(`/chat?user=${ga.F_ID}`);
                      }}
                    >
                      <td className="px-6 py-2 whitespace-nowrap">
                        {ga.F_FNAME} {ga.F_LNAME}
                      </td>
                      <td className="px-6 py-2 whitespace-nowrap">
                        {ga.F_GROUP}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-span-3">
          <div className="card overflow-auto">
            <div className="px-6 py-3 bg-gray-50 text-left text-xs font-bold uppercase tracking-wider border-b border-gray-200">
              Chat
            </div>
            <div
              className="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch"
              style={{ minHeight: "660px", maxHeight: "660px" }}
            >
              {message &&
                message.reverse().map((ga, i) => (
                  <div
                    className={`bg-white dark:bg-gray-800 dark:text-gray-200 px-4 pb-0 antialiased flex w-100 ${
                      props.token.uid == ga.F_UID
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                    key={`${i}-message`}
                  >
                    <div
                      className={`w-8 h-8 overflow-hidden flex items-center justify-center bg-indigo-500 text-white mt-1 rounded-full ${
                        props.token.uid == ga.F_UID ? "ml-2" : "mr-2"
                      }`}
                      style={{ width: "2rem", minWidth: "2rem" }}
                    >
                      <span className="inline-block">
                        {ga.CREATOR.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-3xl px-4 pt-2 pb-2.5">
                        <div className="font-semibold text-sm leading-relaxed">
                          {ga.CREATOR}
                        </div>
                        <div className="text-normal leading-snug md:leading-normal">
                          {ga.F_BODY}
                        </div>
                      </div>
                      <div
                        className={`text-sm mt-0.5 text-gray-500 dark:text-gray-400 ${
                          props.token.uid == ga.F_UID
                            ? "text-right mr-4"
                            : "text-left ml-4"
                        }`}
                      >
                        {new Date(ga.F_DATE) <
                        new Date(new Date().toDateString())
                          ? moment(ga.F_DATE).utc().format("MM/DD hh:mm A")
                          : moment(ga.F_DATE).utc().format("LT")}
                      </div>
                      {/* <div className="bg-white dark:bg-gray-700 border border-white dark:border-gray-700 rounded-full float-right -mt-8 mr-0.5 flex shadow items-center cursor-pointer">
                        <img
                          src="https://cdn-icons-png.flaticon.com/512/126/126497.png"
                          width="20"
                          height="20"
                        />
                      </div> */}
                    </div>
                  </div>
                ))}
              <a ref={messageBottom}></a>
            </div>
            <div className="border-t-2 border-gray-200 px-4 pt-2 mb-2 sm:mb-0">
              <div className="relative flex">
                <span className="absolute inset-y-0 flex items-center">
                  {/* <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      ></path>
                    </svg>
                  </button> */}
                </span>
                <input
                  type="text"
                  placeholder="Write Something"
                  className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-12 bg-gray-200 rounded-full py-3"
                  value={msg}
                  onChange={(e) => {
                    setMsg(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
                <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      ></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      ></path>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </button>
                  {/* Send Button */}
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full h-12 w-12 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
                    onClick={sendMessage}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-6 w-6 transform rotate-90"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
