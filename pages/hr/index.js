import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function humanResource({ Cookie }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  useEffect(() => {
    !TOKEN && router.push("/login");
  }, []);

  return (
    <Layout TOKEN={TOKEN} TITLE="Human Resource">
      <h3>Blank Page</h3>
    </Layout>
  );
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  //   const fetchMember = await fetch(`${process.env.FS_BASEPATH}member`, {
  //     headers: { "x-api-key": process.env.JWT_KEY },
  //   });

  //   if (fetchMember.status) {
  //     const a = await fetchMember.json();
  //     console.log(a);
  //   }

  // Pass data to the page via props
  return { props: { Cookie: cookies } };
}
