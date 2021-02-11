import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import Head from "next/head";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import { useAuthState } from "react-firebase-hooks/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBWvOh5KL16jU-rD2mYt-OY7hIhnCMBZ60",
  authDomain: "jw-web-ffaea.firebaseapp.com",
  databaseURL: "https://jw-web-ffaea.firebaseio.com",
  projectId: "jw-web-ffaea",
  storageBucket: "jw-web-ffaea.appspot.com",
  messagingSenderId: "579008207978",
  appId: "1:579008207978:web:313c48437e50d7e5637e13",
  measurementId: "G-GPMS588XP2",
};
const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [secret, setSecret] = useState("");
  // if (!firebase.apps.length) {
  //   firebase.initializeApp(firebaseConfig);
  // } else {
  //   firebase.app();
  // }
  // const auth = firebase.auth();
  const signInWithGoogle = () => {
    console.log("hello");
    // const provider = new firebase.auth.GoogleAuthProvider();
    // auth
    //   .signInWithPopup(provider)
    //   .then((result) => {
    //     if (result.additionalUserInfo.isNewUser) {
    //       alert("NEW USER");
    //     } else {
    //       console.log(result.user);
    //     }
    //   })
    //   .catch((err) => console.log(err));
  };

  useEffect(() => {
    // console.log(auth.currentUser);
    Cookie.set("jamesworldwidetoken", "");
  }, []);
  async function submitForm() {
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
    if (token) {
      setMessage("");
      const json = jwt.decode(token) as { [key: string]: string };
      Cookie.set("jamesworldwidetoken", token);
      setSuccess(`${json.username.toUpperCase()}, PLEASE WAIT...`);

      const res = await fetch("api/login/secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }).then((t) => t.json());
      if (res.secretAdminCode) {
        setSecret(res.secretAdminCode);
        router.push({ pathname: "/dashboard" });
      } else {
        setSecret("Nothing");
        router.push({ pathname: "/dashboard" });
      }
    } else {
      setMessage("Invalid Username or Password!");
    }
  }
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
          integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN"
          crossOrigin="anonymous"
        />
      </Head>
      <div className="login">
        <img src="/image/wave.png" className="wave" />
        <div className="container">
          <div className="img">
            <img src="/image/shopping.svg" />
          </div>
          <div className="login-content">
            <form onSubmit={(e) => e.preventDefault()}>
              <img src="/image/JLOGO.png" className="avatar" />
              <h2 className="title">James Worldwide</h2>
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
                className={password ? "input-div pass focus" : "input-div pass"}
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

              <a href="#">Forgot Password?</a>

              <div
                className="btn-primary py-2"
                style={{ borderRadius: "1rem", display: "none" }}
                onClick={signInWithGoogle}
              >
                Sign in with{"  "}
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1004px-Google_%22G%22_Logo.svg.png"
                  style={{ height: "30px", width: "30px" }}
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
            width: 100vw;
            height: 100vh;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 7rem;
            padding: 0 2rem;
          }
          .img {
            display: flex;
            justify-content: flex-end;
            align-items: center;
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
          .btn:hover {
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
export default Login;
