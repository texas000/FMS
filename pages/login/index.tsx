import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import Head from "next/head";
import firebase from "firebase/app";
import fetch from "node-fetch";
import "firebase/auth";
import "firebase/analytics";
import Notification from "../../components/Toaster";
const Login = ({ Firebase, AccessKey }) => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Message and success that will display the error message
  const [message, setMessage] = useState("");
  // Message and success that will display the success message
  const [success, setSuccess] = useState("");

  // Define Firebase for google login feature
  const firebaseConfig = {
    apiKey: Firebase,
    authDomain: "jw-web-ffaea.firebaseapp.com",
    databaseURL: "https://jw-web-ffaea.firebaseio.com",
    projectId: "jw-web-ffaea",
    storageBucket: "jw-web-ffaea.appspot.com",
    messagingSenderId: "579008207978",
    appId: "1:579008207978:web:313c48437e50d7e5637e13",
    measurementId: "G-GPMS588XP2",
  };

  // Initialize the firebase app
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

  // Authorization define
  const auth = firebase.auth();

  // When the sign with google button is clicked, run signInWithPopup
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithPopup(provider)
      .then(async (result) => {
        if (result.user) {
          // After Google Login, fetch api to verify if the account is on the server
          const res = await fetch("api/login/withGoogle", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: `${result.user.email}`,
              displayName: result.user.displayName,
              photoURL: result.user.photoURL,
            }),
          })
            .then((t) => t.json())
            .catch((err) => console.log(err));

          const token = res.token;
          // If there is token from feching, then store token to cookie and push to dashboard
          if (token) {
            // Login Success
            const fetchToSlack = await fetch("/api/slack/sendMessage", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({
                text: `${result.user.displayName} - Access Granted with Google Login to JWIUSA.COM`,
              }),
            });
            setMessage("");
            if (fetchToSlack.status === 200) {
              console.log("login updated");
            } else {
              console.log(fetchToSlack.status);
            }
            const json = jwt.decode(token) as { [key: string]: string };
            Cookie.set("jamesworldwidetoken", token);
            setSuccess(`${json.username.toUpperCase()}, PLEASE WAIT...`);
            router.push({ pathname: "/" });
            // After fetch to slack, redirect to dashboard
            // if (fetchToSlack.status === 200) {
            //   setMessage("");
            //   const json = jwt.decode(token) as { [key: string]: string };
            //   Cookie.set("jamesworldwidetoken", token);
            //   setSuccess(`${json.username.toUpperCase()}, PLEASE WAIT...`);
            //   router.push({ pathname: "/dashboard" });
            // }
          }
          // else {
          //   // Login Fail

          //   // fetch to slack
          //   const fetchToSlack = await fetch("/api/slack/sendMessage", {
          //     method: "POST",
          //     headers: {
          //       "Content-type": "application/json",
          //     },
          //     body: JSON.stringify({
          //       type: "error",
          //       text: `${result.user.displayName} - Access Denied with Google Login to JWIUSA.COM <@URXAD41A7>`,
          //     }),
          //   });
          //   if (fetchToSlack.status === 200) {
          //     //Show the error message
          //     setSuccess("");
          //     setMessage(
          //       "PLEASE CONTACT ADMIN TO LOGIN - IT@JAMESWORLDWIDE.COM"
          //     );
          //   } else {
          //     setSuccess("");
          //     setMessage("UNKNOWN ERROR! PLEASE REPORT");
          //   }
          // }
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // console.log(auth.currentUser);
    Cookie.set("jamesworldwidetoken", "");
  }, []);

  // Login with Account Id and Password
  async function submitForm() {
    // Note that some characters are restricted for username, password.
    const res = await fetch("api/login/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((t) => t.json())
      .catch((err) => console.log(err));

    const token = res.token;
    // Login Success
    if (token) {
      setMessage("");
      // Set Cookie with encoded token
      Cookie.set("jamesworldwidetoken", token);
      // Display success message before redirect to dashboard
      setSuccess(`PLEASE WAIT...`);

      // Get first name from token
      const { first } = jwt.decode(token) as { [key: string]: string };

      // Get secret code for extra security
      const res = await fetch("api/login/secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }).then((t) => t.json());

      // If the secret code is matched with access key, then grant access
      if (res.secretAdminCode === AccessKey) {
        const fetchToSlack = await fetch("/api/slack/sendMessage", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            text: `${first.toUpperCase()} - Access Granted with Credential to JWIUSA.COM`,
          }),
        });
        if (fetchToSlack.status === 200) {
          router.push({ pathname: "/" });
        } else {
          console.log("feching to slack message is failed");
          router.push({ pathname: "/" });
        }
      } else {
        alert("Account is suspended");
      }
    } else {
      // Login Failed
      setMessage("Invalid Username or Password!");
      // const fetchToSlack = await fetch("/api/slack/sendMessage", {
      //   method: "POST",
      //   headers: {
      //     "Content-type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     text: `${username.toUpperCase()} - Access Denied to JWIUSA.COM <@URXAD41A7>`,
      //   }),
      // });
      // if (fetchToSlack.status === 200) {
      //   setMessage("Invalid Username or Password!");
      // } else {
      //   setMessage("Invalid Username or Password!" + fetchToSlack.status);
      // }
    }
  }
  return (
    <>
      <Head>
        <title>JWIUSA LOGIN</title>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <meta
          property="og:title"
          content="JAMES WORLDWIDE INC, ADDING VALUES TO YOUR CARGO!"
        ></meta>
        <meta
          name="description"
          content="James Worldwide moves your cargo in the safest and fastest way possible, keeping you informed every step of the way and providing customized and innovative solutions."
        ></meta>
        <meta
          property="og:description"
          content="James Worldwide moves your cargo in the safest and fastest way possible, keeping you informed every step of the way and providing customized and innovative solutions."
        ></meta>
        <meta property="og:url" content="https://jwiusa.com"></meta>
        <meta
          property="og:image"
          content="https://jwiusa.com/image/JLOGO.png"
        ></meta>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#2563eb" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </Head>
      <img
        src="/image/wave.png"
        className="fixed bg-cover z-0 h-screen left-0 bottom-0"
      />
      <div className="p-10 w-screen h-screen flex flex-col-reverse md:flex-row items-center justify-center gap-x-40 bg-white dark:bg-black">
        <div className="w-0 z-30 md:w-1/2">
          <img src="/image/shopping.svg" className="bg-fixed bg-cover" />
        </div>
        <div className="w-100 mx-auto flex flex-col items-center z-50 xl:w-1/2">
          <form className="shadow-lg p-4 flex flex-col rounded-lg sm:w-100">
            <div className="flex justify-center items-center">
              <img
                src="/image/JLOGO.png"
                className="w-10 bg-white rounded-full mr-2"
              />
              <h1 className="text-xl text-blue-800 font-sans font-extrabold">
                JAMES WORLDWIDE PORTAL
              </h1>
            </div>

            <div className="my-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-gray-600 dark:text-gray-400"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="Username"
                onChange={(e) => {
                  e.preventDefault();
                  setUsername(e.target.value);
                }}
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Password
                </label>
                <a
                  onClick={signInWithGoogle}
                  href="#"
                  className="text-sm text-gray-400 focus:outline-none focus:text-indigo-500 hover:text-indigo-500 dark:hover:text-indigo-300"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                id="password"
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key == "Enter") {
                    submitForm();
                  }
                }}
                placeholder="Your Password"
                className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500 dark:border-gray-600 dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>

            <div className="mb-6">
              <button
                type="button"
                className="w-full px-3 py-2 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none flex items-center justify-center"
                onClick={signInWithGoogle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path
                      fill="#4285F4"
                      d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                    />
                  </g>
                </svg>
                <span className="ml-4">Sign in with Google</span>
              </button>
            </div>
            <div className="mb-6">
              <button
                type="button"
                className="w-full px-3 py-2 text-white bg-green-600 rounded-md focus:bg-green-700 focus:outline-none"
                onClick={submitForm}
              >
                Sign in
              </button>
            </div>
          </form>
          <Notification
            show={message}
            setShow={setMessage}
            msg={message}
            intent="danger"
            icon="error"
          />
          <Notification
            show={success}
            setShow={setSuccess}
            msg={success}
            intent="success"
            icon="time"
          />
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  // Pass data to the page via props
  return {
    props: {
      Firebase: process.env.FIREBASE_API_KEY,
      AccessKey: process.env.JWT_KEY,
    },
  };
}

export default Login;
