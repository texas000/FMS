import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookie from "js-cookie";

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [secret, setSecret] = useState("");
  useEffect(() => {
    Cookie.set("jamesworldwidetoken", "");
  }, []);
  async function submitForm() {
    const res = await fetch("api/login/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }).then(t => t.json()).catch(err=>console.log(err));
    const token = res.token;
    if (token) {
      const json = jwt.decode(token) as { [key: string]: string };
      Cookie.set("jamesworldwidetoken", token);
      setMessage(`${json.username}, PLEASE WAIT...`);

      const res = await fetch("api/login/secret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }).then((t) => t.json());
      console.log(window.history.length);

      if (res.secretAdminCode) {
        setSecret(res.secretAdminCode);
        if (window.history.length > 3) {
          router.back();
        } else {
          router.push({ pathname: "/" });
        }
      } else {
        setSecret("Nothing");
        if (window.history.length > 3) {
          router.back();
        } else {
          router.push({ pathname: "/" });
        }
      }
    } else {
      setMessage("Invalid Username or Password!");
    }
  }
  return (
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
            <div className={username ? "input-div one focus" : "input-div one"}>
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
            <input
              type="submit"
              className="btn"
              value="Login"
              onClick={submitForm}
            />
            <p className="error">{message}</p>
            {/* <p className="error">{secret}</p> */}
          </form>
        </div>
      </div>
      <style jsx>{`
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

        .error {
          color: red;
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
      <style jsx global>
        {`
          * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
          }
          body {
            font-family: "Poppins", sans-serif;
            overflow: hidden;
          }
        `}
      </style>
    </div>
  );
};
export default Login;
