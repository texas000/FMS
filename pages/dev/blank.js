import cookie from "cookie";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

export default function blank ({Cookie}) {
    const router = useRouter()
    const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
    return (
        <Layout TOKEN={TOKEN} TITLE="Blank">
            <h3>Blank Page</h3>
        </Layout>
    )
}

export async function getServerSideProps({req}) {
    const cookies = cookie.parse(req? req.headers.cookie || "" : window.document.cookie)
    // Pass data to the page via props
    return { props: { Cookie: cookies } };
  }