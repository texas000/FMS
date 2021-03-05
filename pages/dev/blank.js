import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";

export default function blank({ Cookie }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  async function hello() {
    const fetchSlack = await fetch(`/api/slack/sendMessage`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        text: "hello world from jwiusa",
      }),
    });
    if (fetchSlack.status === 200) {
      console.log("success");
    } else {
      console.log(fetchSlack.status);
    }
  }

  return (
    <Layout TOKEN={TOKEN} TITLE="Blank">
      <h3>Blank Page</h3>
      <button onClick={hello}>CLICK ME</button>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  // Pass data to the page via props
  return { props: { Cookie: cookies } };
}
