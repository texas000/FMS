import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarGroup,
  NavbarHeading,
  NavbarDivider,
  Button,
  Alignment,
  Classes,
} from "@blueprintjs/core";
import AmazonTable from "../../components/Utils/AmazonTable";
import AmazonUpload from "../../components/Utils/AmazonUpload";

export default function blank({ Cookie }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [SelectedMenu, setSelectedMenu] = useState(1);
  useEffect(() => {
    !TOKEN && router.push("/login");
  }, []);

  return (
    <Layout TOKEN={TOKEN} TITLE="Amazon">
      <Navbar>
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Amazon Management</NavbarHeading>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon="panel-table"
            text="Table View"
            onClick={() => setSelectedMenu(1)}
          />
          <Button
            className={Classes.MINIMAL}
            icon="document-share"
            text="Upload Data"
            onClick={() => setSelectedMenu(2)}
          />
        </NavbarGroup>
      </Navbar>
      {SelectedMenu === 1 && <AmazonTable />}
      {SelectedMenu === 2 && <AmazonUpload />}
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
