import cookie from "cookie";
import Layout from "../../components/Layout";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import moment from "moment";
import useSWR from "swr";

export async function getServerSideProps({ req, query }) {
	const cookies = cookie.parse(
		req ? req.headers.cookie || "" : window.document.cookie
	);
	try {
		const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);

		return {
			props: {
				token: token,
				q: query.Detail,
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

const Detail = ({ token, q }) => {
	const { data: post } = useSWR(`/api/board/getPostDetail?q=${q}`);
	const { data: comment, mutate } = useSWR(`/api/board/getComment?q=${q}`);
	async function handleSubmit(e) {
		e.preventDefault();
		var comment = e.target[0].value.replace(/'/g, "");
		const res = await fetch("/api/board/addComment", {
			body: `${post.ID}, N'${comment}', GETDATE(), ${token.uid}`,
			method: "POST",
		});
		if (res.status == 200) {
			mutate();
		} else {
			alert(res.status);
		}
	}

	function createMarkup(html) {
		return { __html: html };
	}

	function PostBody({ html }) {
		return <div dangerouslySetInnerHTML={createMarkup(html)} />;
	}

	return (
		<>
			<Layout TOKEN={token} TITLE="Board" LOADING={!post}>
				{post ? (
					<div className="lg:p-10 sm:p-2">
						<h3 className="dark:text-white">{post.TITLE}</h3>
						<small className="dark:text-white font-bold">
							{post.WRITER} at {moment(post.TIME).utc().format("LLL")}
						</small>
						<div className="card p-5 mx-auto my-4 leading-loose h-100">
							<PostBody html={post.BODY} />
						</div>
						<div className="card p-5 mx-auto my-4">
							<h4>Comment</h4>
							{comment ? (
								comment.map((ga) => (
									<div
										className="antialiased w-100 bg-gray-100 p-2 rounded mt-2"
										key={ga.ID}
									>
										<div className="font-semibold text-sm leading-relaxed">
											{ga.WRITER}
										</div>
										<div className="text-normal leading-snug md:leading-normal">
											{ga.COMMENT}
										</div>
										<small>{moment(ga.TIME).utc().calendar()}</small>
									</div>
								))
							) : (
								<></>
							)}
							<form
								className="w-full rounded-lg px-4 pt-2"
								onSubmit={handleSubmit}
							>
								<div className="flex flex-wrap -mx-3 mb-6">
									<h2 className="pt-3 pb-2 text-gray-800 dark:text-white text-lg">
										Add a new comment
									</h2>
									<textarea
										className="bg-gray-100 dark:bg-gray-300 text-black rounded border border-gray-400 leading-normal resize-none w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white"
										name="body"
										placeholder="Type Your Comment"
										required
									></textarea>
									<div className="ml-auto -mr-1 mt-2">
										<input
											type="submit"
											className="bg-white dark:bg-gray-700 dark:text-white text-gray-700 font-medium py-1 px-4 border border-gray-400 rounded-lg tracking-wide mr-1 hover:bg-gray-100"
											value="Post Comment"
										/>
									</div>
								</div>
							</form>
						</div>
					</div>
				) : (
					<>
						<h1>Not Found</h1>
					</>
				)}
			</Layout>
		</>
	);
};

export default Detail;
