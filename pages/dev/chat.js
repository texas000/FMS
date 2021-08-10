import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/analytics";
import "firebase/firestore";
import moment from "moment";
import { Input } from "reactstrap";
import React from "react";

export default function blank({ Cookie, Firebase }) {
	const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
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
	if (!firebase.apps.length) {
		firebase.initializeApp(firebaseConfig);
	} else {
		firebase.app();
	}

	function addMessages() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				firebase
					.firestore()
					.collection("messages")
					.add({
						createdAt: firebase.firestore.Timestamp.now(),
						photoURL: user.photoURL,
						uid: user.uid,
						displayName: user.displayName,
						text: mytext,
					})
					.then(setMytext(""));
			} else {
				alert("PLEASE LOGIN WITH GOOGLE ACCOUNT");
			}
		});
	}
	const [mytext, setMytext] = React.useState("");
	const [messages, setMessages] = React.useState([]);
	const [limits, setLimit] = React.useState(8);
	const [Uid, setUid] = React.useState(false);
	React.useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				setUid(user.uid);
				firebase
					.firestore()
					.collection("messages")
					.orderBy("createdAt", "desc")
					.limit(limits)
					.onSnapshot((querySnapshot) => {
						var msg = [];
						querySnapshot.forEach((doc) => {
							msg.push(doc.data());
						});
						setMessages(msg.reverse());
					});
			} else {
				console.log("no google user");
			}
		});
	}, [limits]);
	return (
		<Layout TOKEN={TOKEN} TITLE="Chat">
			<div className="container-fluid px-1 bootstrap snippets bootdey shadow">
				<div className="row">
					<div className="col-md-4 bg-white sticky-top">
						<div
							className="row border-bottom py-2 px-2"
							style={{ height: "40px" }}
						>
							Chat List
						</div>
						<ul className="friend-list">
							<li className="active bounceInDown">
								<a href="#" className="clearfix">
									<img src="/image/JLOGO.png" alt="" className="img-circle" />
									<div className="friend-name">
										<strong>JAMES WORLDWIDE INC</strong>
									</div>
									<div className="last-message text-muted">
										{messages.length ? messages[messages.length - 1].text : ""}
									</div>
									<small className="time text-muted">Just now</small>
									<small className="chat-alert label label-danger">1</small>
								</a>
							</li>
							{/* <li>
                <a href="#" className="clearfix">
                  <img
                    src="https://bootdey.com/img/Content/user_2.jpg"
                    alt=""
                    className="img-circle"
                  />
                  <div className="friend-name">
                    <strong>Jane Doe</strong>
                  </div>
                  <div className="last-message text-muted">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <small className="time text-muted">5 mins ago</small>
                  <small className="chat-alert text-muted">
                    <i className="fa fa-check"></i>
                  </small>
                </a>
              </li>
              <li>
                <a href="#" className="clearfix">
                  <img
                    src="https://bootdey.com/img/Content/user_3.jpg"
                    alt=""
                    className="img-circle"
                  />
                  <div className="friend-name">
                    <strong>Kate</strong>
                  </div>
                  <div className="last-message text-muted">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <small className="time text-muted">Yesterday</small>
                  <small className="chat-alert text-muted">
                    <i className="fa fa-reply"></i>
                  </small>
                </a>
              </li>
              <li>
                <a href="#" className="clearfix">
                  <img
                    src="https://bootdey.com/img/Content/user_1.jpg"
                    alt=""
                    className="img-circle"
                  />
                  <div className="friend-name">
                    <strong>Kate</strong>
                  </div>
                  <div className="last-message text-muted">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <small className="time text-muted">Yesterday</small>
                  <small className="chat-alert text-muted">
                    <i className="fa fa-reply"></i>
                  </small>
                </a>
              </li>
              <li>
                <a href="#" className="clearfix">
                  <img
                    src="https://bootdey.com/img/Content/user_2.jpg"
                    alt=""
                    className="img-circle"
                  />
                  <div className="friend-name">
                    <strong>Kate</strong>
                  </div>
                  <div className="last-message text-muted">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <small className="time text-muted">Yesterday</small>
                  <small className="chat-alert text-muted">
                    <i className="fa fa-reply"></i>
                  </small>
                </a>
              </li>
              <li>
                <a href="#" className="clearfix">
                  <img
                    src="https://bootdey.com/img/Content/user_6.jpg"
                    alt=""
                    className="img-circle"
                  />
                  <div className="friend-name">
                    <strong>Kate</strong>
                  </div>
                  <div className="last-message text-muted">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <small className="time text-muted">Yesterday</small>
                  <small className="chat-alert text-muted">
                    <i className="fa fa-reply"></i>
                  </small>
                </a>
              </li>
              <li>
                <a href="#" className="clearfix">
                  <img
                    src="https://bootdey.com/img/Content/user_5.jpg"
                    alt=""
                    className="img-circle"
                  />
                  <div className="friend-name">
                    <strong>Kate</strong>
                  </div>
                  <div className="last-message text-muted">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <small className="time text-muted">Yesterday</small>
                  <small className="chat-alert text-muted">
                    <i className="fa fa-reply"></i>
                  </small>
                </a>
              </li>
              <li>
                <a href="#" className="clearfix">
                  <img
                    src="https://bootdey.com/img/Content/user_2.jpg"
                    alt=""
                    className="img-circle"
                  />
                  <div className="friend-name">
                    <strong>Jane Doe</strong>
                  </div>
                  <div className="last-message text-muted">
                    Lorem ipsum dolor sit amet.
                  </div>
                  <small className="time text-muted">5 mins ago</small>
                  <small className="chat-alert text-muted">
                    <i className="fa fa-check"></i>
                  </small>
                </a>
              </li> */}
						</ul>
					</div>
					<div className="col-md-8 main-chat pr-0">
						<div className="chat-message">
							<ul className="chat px-4">
								<li className="clearfix text-center">
									<button
										className="btn btn-outline-primary"
										onClick={() => setLimit(limits + 5)}
									>
										Load more
									</button>
								</li>
							</ul>
							<ul className="chat px-4">
								{messages.map((ga, i) => (
									<li
										className={`${ga.uid == Uid ? "right" : "left"} clearfix`}
										key={ga.createdAt}
									>
										<span
											className={`chat-img pull-${
												ga.uid == Uid ? "right" : "left"
											}`}
										>
											<img
												src={
													ga.photoURL ||
													"https://bootdey.com/img/Content/user_2.jpg"
												}
												alt="User Avatar"
											/>
										</span>
										<div className="chat-body clearfix">
											<div className="header">
												<strong className="primary-font">
													{ga.displayName}
												</strong>
												<small className="pull-right text-muted">
													<i className="fa fa-clock-o"></i>{" "}
													{moment(ga.createdAt.seconds * 1000).fromNow()}
												</small>
											</div>
											<p>{ga.text}</p>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="chat-box bg-white w-100">
						<div className="input-group">
							<Input
								id="text-input"
								className="form-control border no-shadow no-rounded"
								placeholder="Type your message here"
								autoFocus={true}
								value={mytext}
								onKeyPress={(e) => {
									if (e.key == "Enter") {
										e.preventDefault();
										addMessages();
									}
								}}
								onChange={(e) => setMytext(e.target.value)}
							/>
							<span className="input-group-btn">
								<button
									className="btn btn-success no-rounded"
									type="button"
									onClick={addMessages}
								>
									Send
								</button>
							</span>
						</div>
					</div>
					{/* <button onClick={() => setLimit(limits + 5)}>get more message</button> */}
				</div>
			</div>
			<style jsx>
				{`
					body {
						padding-top: 0;
						font-size: 12px;
						color: #777;
						background: #f9f9f9;
						font-family: "Open Sans", sans-serif;
						margin-top: 20px;
					}
					.main-chat {
						height: 80vh;
						overflow: scroll;
						background-color: #f9f9f9;
					}
					.container {
						height: 80vh;
					}

					.bg-white {
						background-color: #fff;
					}

					.friend-list {
						list-style: none;
						margin-left: -40px;
					}

					.friend-list li {
						border-bottom: 1px solid #eee;
					}

					.friend-list li a img {
						float: left;
						width: 45px;
						height: 45px;
						margin-right: 10px;
					}

					.friend-list li a {
						position: relative;
						display: block;
						padding: 10px;
						transition: all 0.2s ease;
						-webkit-transition: all 0.2s ease;
						-moz-transition: all 0.2s ease;
						-ms-transition: all 0.2s ease;
						-o-transition: all 0.2s ease;
					}

					.friend-list li.active a {
						background-color: #f1f5fc;
					}

					.friend-list li a .friend-name,
					.friend-list li a .friend-name:hover {
						color: #777;
					}

					.friend-list li a .last-message {
						width: 65%;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					.friend-list li a .time {
						position: absolute;
						top: 10px;
						right: 8px;
					}

					small,
					.small {
						font-size: 85%;
					}

					.friend-list li a .chat-alert {
						position: absolute;
						right: 8px;
						top: 27px;
						font-size: 10px;
						padding: 3px 5px;
					}

					.chat-message {
						padding: 30px 20px 30px;
					}

					.chat {
						list-style: none;
						margin: 0;
					}

					.chat-message {
						background: #f9f9f9;
					}

					.chat li img {
						width: 45px;
						height: 45px;
						border-radius: 50em;
						-moz-border-radius: 50em;
						-webkit-border-radius: 50em;
					}

					img {
						max-width: 100%;
					}

					.chat-body {
						padding-bottom: 20px;
					}

					.chat li.left .chat-body {
						margin-left: 70px;
						background-color: #fff;
					}

					.chat li .chat-body {
						position: relative;
						font-size: 11px;
						padding: 10px;
						border: 1px solid #f1f5fc;
						box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
						-moz-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
						-webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
					}

					.chat li .chat-body .header {
						padding-bottom: 5px;
						border-bottom: 1px solid #f1f5fc;
					}

					.chat li .chat-body p {
						margin: 0;
					}

					.chat li.left .chat-body:before {
						position: absolute;
						top: 10px;
						left: -8px;
						display: inline-block;
						background: #fff;
						width: 16px;
						height: 16px;
						border-top: 1px solid #f1f5fc;
						border-left: 1px solid #f1f5fc;
						content: "";
						transform: rotate(-45deg);
						-webkit-transform: rotate(-45deg);
						-moz-transform: rotate(-45deg);
						-ms-transform: rotate(-45deg);
						-o-transform: rotate(-45deg);
					}

					.chat li.right .chat-body:before {
						position: absolute;
						top: 10px;
						right: -8px;
						display: inline-block;
						background: #fff;
						width: 16px;
						height: 16px;
						border-top: 1px solid #f1f5fc;
						border-right: 1px solid #f1f5fc;
						content: "";
						transform: rotate(45deg);
						-webkit-transform: rotate(45deg);
						-moz-transform: rotate(45deg);
						-ms-transform: rotate(45deg);
						-o-transform: rotate(45deg);
					}

					.chat li {
						margin: 15px 0;
					}

					.chat li.right .chat-body {
						margin-right: 70px;
						background-color: #fff;
					}

					.chat-box {
						/*
  position: fixed;
  bottom: 0;
  left: 444px;
  right: 0;
*/
						padding: 15px;
						border-top: 1px solid #eee;
						transition: all 0.5s ease;
						-webkit-transition: all 0.5s ease;
						-moz-transition: all 0.5s ease;
						-ms-transition: all 0.5s ease;
						-o-transition: all 0.5s ease;
					}

					.primary-font {
						color: #3c8dbc;
					}

					a:hover,
					a:active,
					a:focus {
						text-decoration: none;
						outline: 0;
					}
				`}
			</style>
		</Layout>
	);
}

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	// console.time("fecth_time");

	// console.timeEnd("fecth_time");

	// Pass data to the page via props
	return { props: { Cookie: cookies, Firebase: process.env.FIREBASE_API_KEY } };
}
