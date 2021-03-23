import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import {
  Button,
  Breadcrumbs,
  InputGroup,
  Callout,
  TagInput,
} from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";

export default function blank({ Cookie }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const BREADCRUMBS = [{ href: "/dev", icon: "folder-close", text: "Dev" }];
  const [message, setMessage] = React.useState("");
  async function hello() {
    const fetchSlack = await fetch(`/api/slack/sendMessage`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    });
    if (fetchSlack.status === 200) {
      alert("SUCCESS");
      setMessage("");
    } else {
      alert("FAILED");
      console.log(fetchSlack.status);
    }
  }

  return (
    <Layout TOKEN={TOKEN} TITLE="Dev">
      <Breadcrumbs items={BREADCRUMBS} />
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col">
            <div className="card">
              <div className="card-header">DEV PROJECTS</div>
              <div className="card-body">
                <div className="row">
                  <Callout title={"Chat System"} icon="chat" intent="success">
                    Real time chat is available by using firebase firestore
                    database. User must be logged in with google account in
                    order to read and write data.
                  </Callout>
                </div>
                <div className="row my-2">
                  <Callout
                    title={"Purchase Order Management"}
                    icon="dollar"
                    intent="success"
                  >
                    Purchase page is available for tracking purhcase order.
                  </Callout>
                </div>
                <div className="row my-2">
                  <Callout
                    title={"Payment for Customer Portal"}
                    icon="data-lineage"
                    intent="success"
                  >
                    Payment is integrated with Stripe.
                  </Callout>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card">
              <div className="card-header">SEND MESSAGE TO SLACK</div>
              {/* <TagInput
                leftIcon="user"
                placeholder="Separate values with commas..."
                values={React.ReactNode[["Casper"]]}
              /> */}
              <div className="card-body row">
                <div className="col-md-8">
                  <InputGroup
                    disabled={false}
                    leftIcon="emoji"
                    placeholder="Please enter your message..."
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    small={true}
                  />
                </div>
                <div className="col-md-4">
                  <Button
                    icon="send-message"
                    intent="success"
                    text="Reset Message to Slack"
                    onClick={hello}
                    small={true}
                  />
                </div>
              </div>
            </div>
          </div>
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