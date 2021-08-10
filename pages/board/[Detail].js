import cookie from "cookie";
import Layout from "../../components/Layout";
import {
	Container,
	Row,
	Col,
	Button,
	Input,
	ButtonGroup,
	Alert,
	Card,
} from "reactstrap";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import moment from "moment";

export async function getServerSideProps({ req }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
		const FETCH = await fetch(`${process.env.BASE_URL}api/board/getPostData`, {
			headers: { reference: query.Detail },
		});
		const FJSON = await FETCH.json();

		const COMFETCH = await fetch(
			`${process.env.BASE_URL}api/board/getComment`,
			{
				headers: { reference: query.Detail },
			}
		);
		const COMMENTS = await COMFETCH.json();
		return {
			props: {
				token: token,
				Board: FJSON,
				Comments: COMMENTS,
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

// export async function getServerSideProps({ req, query }) {
//   const cookies = cookie.parse(
//     req ? req.headers.cookie || "" : window.document.cookie
//   );
//   // Fetch data from FREIGHT STREAM
//   const FETCH = await fetch(`${process.env.BASE_URL}api/board/getPostData`, {
//     headers: { reference: query.Detail },
//   });
//   const FJSON = await FETCH.json();

//   const COMFETCH = await fetch(`${process.env.BASE_URL}api/board/getComment`, {
//     headers: { reference: query.Detail },
//   });
//   const COMMENTS = await COMFETCH.json();

//   // Pass data to the page via props
//   return { props: { Cookie: cookies, Board: FJSON, Comments: COMMENTS } };
// }

const Detail = ({ Cookie, Board, Comments }) => {
	const A = Board.post;

	const addComments = async (comment) => {
		const COMMENT = comment.replace("'", "");
		const TBID = A.ID;
		const value = `'${TBID}', N'${COMMENT}', GETDATE(), ${TOKEN.uid}`;
		const Fetch = await fetch("/api/board/addComment", {
			body: value,
			method: "POST",
		});
		if (Fetch.status === 200) {
			router.reload();
		}
	};

	function createMarkup() {
		return { __html: A.BODY };
	}

	function PostBody() {
		return <div dangerouslySetInnerHTML={createMarkup()} />;
	}

	return (
		<>
			<Layout TOKEN={TOKEN} TITLE="Board">
				<div className="d-flex flex-sm-row justify-content-between">
					<div>
						<i
							id="back"
							className="fa fa-reply fa-lg"
							onClick={() => router.back()}
						></i>
					</div>
					<div className="text-right">
						<span>{moment.utc(A.TIME).format("LLL")}</span>
						<br />
						<span>WRITER: {A.WRITER}</span>
					</div>
				</div>
				{Board && Board.status ? (
					<>
						<Container>
							<Row className="my-4">
								<Col>
									<h1 className="text-primary">{A.TITLE}</h1>
								</Col>
							</Row>
							<Row className="mt-4">
								<Col lg={12}>
									<Card className="shadow h-100 py-4 px-4">
										<PostBody />
									</Card>
								</Col>
								<hr />
								<Col
									lg={12}
									style={{
										marginTop: "2rem",
										borderTop: "1px solid gray",
										paddingTop: "2rem",
									}}
								>
									<h5>COMMENT</h5>
									<Row>
										<Col>
											<Input
												className="mt-4 mb-4"
												placeholder="TYPE HERE"
												onKeyPress={(e) => {
													if (e.key == "Enter") addComments(e.target.value);
												}}
											/>
										</Col>
										{/* <Col lg="2">
                      <Button style={{position: 'absolute', top: '1.62rem', right: '0rem', borderRadius: '0'}}>SAVE</Button>
                    </Col> */}
									</Row>
									{Comments.status &&
										Comments.comments.map((ga) => (
											<Row
												key={ga.ID}
												className="mt-3"
												lg={12}
												style={{
													marginTop: "10rem",
													borderBottom: "1px solid #EBEDEF",
												}}
											>
												<Col>
													<p style={{ fontSize: "0.8rem" }}>
														<span className="text-primary">{ga.WRITER}</span>{" "}
														{moment.utc(ga.TIME).calendar()}
													</p>
													<p style={{ color: "gray" }}>{ga.COMMENT}</p>
												</Col>
												<hr />
											</Row>
										))}
								</Col>
							</Row>
						</Container>
					</>
				) : (
					<Container>
						<h1>NOT EXIST</h1>
					</Container>
				)}
			</Layout>
		</>
	);
};

export default Detail;
