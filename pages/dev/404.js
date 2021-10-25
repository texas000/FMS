import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";
import cookie from "cookie";

export default function errors({ Cookie }) {
  const router = useRouter();
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  return (
    <Layout TOKEN={TOKEN} TITLE="404">
      <div className="container-fluid">
        {/* <!-- 404 Error Text --> */}
        <div className="text-center">
          <div className="error mx-auto" data-text="404">
            404
          </div>
          <p className="lead text-gray-800 mb-5">Page Not Found</p>
          <p className="text-gray-500 mb-0">
            It looks like you found a glitch in the matrix...
          </p>
          <a href="#" onClick={() => router.push("/")}>
            &larr; Back to Dashboard
          </a>
        </div>
      </div>
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
