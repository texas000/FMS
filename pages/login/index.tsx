import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import Head from "next/head";
import firebase from "firebase/app";
import fetch from "node-fetch";
import "firebase/auth";
import "firebase/analytics";

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
            router.push({ pathname: "/dashboard" });
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
        router.push({ pathname: "/dashboard" });
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
          router.push({ pathname: "/dashboard" });
        } else {
          console.log("feching to slack message is failed");
          router.push({ pathname: "/dashboard" });
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
      </Head>
      <div className="login d-flex w-100 h-100 align-items-center">
        <img src="/image/wave.png" className="wave" />
        <div className="container d-flex align-items-center justify-content-center">
          <div className="d-flex flex-row">
            <div className="img pt-4 mt-4 mr-4">
              <img src="/image/shopping.svg" className="pt-4 px-4" />
            </div>

            <div className="login-content">
              <form onSubmit={(e) => e.preventDefault()}>
                <img src="/image/JLOGO.png" className="avatar" />
                <h2 className="title mb-4">James Worldwide</h2>
                <div
                  className={username ? "input-div one focus" : "input-div one"}
                >
                  <div className="i">
                    <i className="fa fa-user"></i>
                  </div>
                  <div className="div">
                    <h5>Username</h5>
                    <input
                      className="input"
                      type="text"
                      name="username"
                      autoComplete="on"
                      onChange={(e) => {
                        e.preventDefault();
                        setUsername(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div
                  className={
                    password ? "input-div pass focus" : "input-div pass"
                  }
                >
                  <div className="i">
                    <i className="fa fa-lock"></i>
                  </div>
                  <div className="div">
                    <h5>Password</h5>
                    <input
                      className="input"
                      name="password"
                      type="password"
                      autoComplete="on"
                      onChange={(e) => {
                        e.preventDefault();
                        setPassword(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key == "Enter") {
                          submitForm();
                        }
                      }}
                    />
                  </div>
                </div>

                <a href="#" onClick={signInWithGoogle}>
                  Forgot Password?
                </a>

                <div
                  className="btn-primary btn-google text-center"
                  onClick={signInWithGoogle}
                >
                  SIGN IN WITH {"  "}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png"
                    className="img-fluid"
                    style={{
                      height: "20px",
                      width: "20px",
                      marginLeft: "8px",
                    }}
                  />
                </div>

                <div className="center">
                  <input
                    type="submit"
                    className="btn"
                    value="Login"
                    onClick={submitForm}
                  />
                  {message && <div className="error">{message}</div>}
                  {success && <div className="success">{success}</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
        <style jsx>{`
          body {
            font-family: "Poppins", sans-serif;
            overflow: hidden;
          }
          .wave {
            position: fixed;
            height: 100%;
            left: 0;
            bottom: 0;
            z-index: -1;
          }
          .container {
            height: 100vh;
             {
              /* display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 7rem;
            padding: 0 2rem; */
            }
          }
          .login-content {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            text-align: center;
          }

          .img img {
            width: 500px;
          }

          form {
            width: 500px;
          }

          .login-content img {
            height: 100px;
          }

          .avatar {
            width: 100px;
          }

          .login-content h2 {
            margin: 15px 0;
            color: #333;
            text-transform: uppercase;
            font-size: 2.9rem;
          }

          .login-content .input-div {
            position: relative;
            display: grid;
            grid-template-columns: 7% 93%;
            margin: 25px 0;
            padding: 5px 0;
            border-bottom: 2px solid #d9d9d9;
          }

          .login-content .input-div.one {
            margin-top: 0;
          }

          .i {
            color: #d9d9d9;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .i i {
            transition: 0.3s;
          }

          .input-div > div {
            position: relative;
            height: 45px;
          }

          .input-div > div > h5 {
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            font-size: 18px;
            transition: 0.3s;
          }

          .center {
            text-align: center;
          }
          .error {
            display: block;
            width: 100%;
            border: 1px solid;
            border-radius: 20px;
            margin: 10px 0px;
            padding: 15px 10px 15px 50px;
            font-size: 11px;
            background-repeat: no-repeat;
            background-position: 10px center;
            color: #d8000c;
            background-color: #ffbaba;
            background-image: url("https://i.imgur.com/GnyDvKN.png");
          }
          .success {
            display: block;
            width: 100%;
            border: 1px solid;
            border-radius: 20px;
            margin: 10px 0px;
            padding: 15px 10px 15px 50px;
            font-size: 11px;
            background-repeat: no-repeat;
            background-position: 10px center;
            color: #4f8a10;
            background-color: #dff2bf;
            background-image: url("https://i.imgur.com/Q9BGTuy.png");
          }

          .input-div:before,
          .input-div:after {
            content: "";
            position: absolute;
            bottom: -2px;
            width: 0%;
            height: 2px;
            background-color: #38d39f;
            transition: 0.4s;
          }

          .input-div:before {
            right: 50%;
          }

          .input-div:after {
            left: 50%;
          }

          .input-div.focus:before,
          .input-div.focus:after {
            width: 50%;
          }

          .input-div.focus > div > h5 {
            top: -5px;
            font-size: 15px;
          }

          .input-div.focus > .i > i {
            color: #38d39f;
          }

          .input-div > div > input {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            background: none;
            padding: 0.5rem 0.7rem;
            font-size: 1.2rem;
            color: #555;
            font-family: "poppins", sans-serif;
          }

          .input-div.pass {
            margin-bottom: 4px;
          }

          a {
            display: block;
            text-align: right;
            text-decoration: none;
            color: #999;
            font-size: 0.9rem;
            transition: 0.3s;
          }

          a:hover {
            color: #38d39f;
          }

          .btn {
            display: block;
            width: 100%;
            height: 50px;
            border-radius: 25px;
            outline: none;
            border: none;
            background-image: linear-gradient(
              to right,
              #32be8f,
              #38d39f,
              #32be8f
            );
            background-size: 200%;
            font-size: 1.2rem;
            color: #fff;
            font-family: "Poppins", sans-serif;
            text-transform: uppercase;
            margin: 1rem 0;
            cursor: pointer;
            transition: 0.5s;
          }
          .btn-google {
            display: block;
            width: 100%;
            padding: 10px 0 10px 0;
            border-radius: 25px;
            background-image: linear-gradient(
              to right,
              #4e73df,
              #4f80df,
              #4e73df
            );
            outline: none;
            border: none;
            font-size: 1.2rem;
            font-family: "Poppins", sans-serif;
            text-transform: uppercase;
            margin: 1rem 0;
            cursor: pointer;
            transition: 0.5s;
          }

          .btn:hover {
            background-position: right;
          }
          .btn-google:hover {
            background-position: right;
          }
          .input {
            margin-top: 3px;
          }

          @media screen and (max-width: 1050px) {
            .container {
              grid-gap: 5rem;
            }
          }

          @media screen and (max-width: 1000px) {
            form {
              width: 290px;
            }

            .login-content h2 {
              font-size: 2.4rem;
              margin: 8px 0;
            }

            .img img {
              width: 400px;
            }
          }

          @media screen and (max-width: 900px) {
            .container {
              grid-template-columns: 1fr;
            }

            .img {
              display: none;
            }

            .wave {
              display: none;
            }

            .login-content {
              justify-content: center;
            }
          }
        `}</style>
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
