import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import InputGroup from "reactstrap/lib/InputGroup";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import FormGroup from "reactstrap/lib/FormGroup";
import Button from "reactstrap/lib/Button";

const Index = ({ Cookie, Users }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState(false);
  const [ChangeUser, setChangeUser] = useState(false);
  const UsersIndex = Users.findIndex((x) => x.F_ID === TOKEN.uid);

  const toggle = () => setModal(!modal);
  useEffect(() => {
    !TOKEN && router.push("/login");
  }, []);

  const onClickSave = async () => {
    const Query = `F_FSID='${ChangeUser.F_FSID}', F_FNAME='${ChangeUser.F_FNAME}', F_LNAME='${ChangeUser.F_LNAME}', F_ACCOUNT='${ChangeUser.F_ACCOUNT}', F_GROUP=${ChangeUser.F_GROUP}, F_EMAIL='${ChangeUser.F_EMAIL}', F_UPDATEDATE=GETDATE() WHERE F_ID='${ChangeUser.F_ID}'`;
    const fetchs = await fetch("/api/admin/editUsers", {
      method: "POST",
      body: Query,
    });
    if (fetchs.status === 200) {
      alert("Saved Successfully");
      toggle();
    } else {
      alert("Please try again");
      console.log(fetchs);
    }
  };

  if (TOKEN && TOKEN.group) {
    return (
      <Layout TOKEN={TOKEN} TITLE="User">
        <div className="row ml-2">
          <h3>User Information</h3>
        </div>

        <div className="row">
          <div className="col-md-3 col-xl-2 my-3">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-header bg-white" style={{ borderRadius: 0 }}>
                <h5 className="card-title mb-0">Profile Settings</h5>
              </div>
              <div
                className="list-group listgroup-flush"
                role="tablist"
                style={{ borderRadius: 0 }}
              >
                <a
                  className={`list-group-item list-group-item-action ${
                    !activeTab && "active"
                  }`}
                  data-toggle="list"
                  href="#account"
                  onClick={() => setActiveTab(0)}
                  role="tab"
                  aria-selected="false"
                >
                  Account
                </a>
                <a
                  className={`list-group-item list-group-item-action ${
                    activeTab == 1 && "active"
                  }`}
                  data-toggle="list"
                  href="#password"
                  onClick={() => setActiveTab(1)}
                  role="tab"
                  aria-selected="false"
                >
                  Password
                </a>
                <a
                  className={`list-group-item list-group-item-action ${
                    activeTab == 2 && "active"
                  }`}
                  data-toggle="list"
                  href="#contact"
                  onClick={() => setActiveTab(2)}
                  role="tab"
                  aria-selected="false"
                >
                  Contacts
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-9 col-xl-10 my-3">
            <div className="tab-content">
              <div
                className={`tab-pane fade ${!activeTab && "show active"}`}
                id="account"
                role="tabpanel"
              >
                <div className="card shadow h-100 mb-2">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Public Info</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-8">
                          <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                              type="text"
                              className="form-control"
                              id="username"
                              placeholder="username"
                              defaultValue={
                                UsersIndex === -1
                                  ? ""
                                  : Users[UsersIndex].F_ACCOUNT
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="group">Group</label>
                            <input
                              type="text"
                              className="form-control"
                              id="group"
                              placeholder="group"
                              defaultValue={
                                UsersIndex === -1
                                  ? ""
                                  : Users[UsersIndex].F_GROUP
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="text-center">
                            <img
                              src="/image/icons/sarah.svg"
                              className="img-fluid mt-2"
                              width="128"
                              height="128"
                            />
                            <br />
                            <small>Customzied profile picture</small>
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() => alert("Please Contact Manager")}
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>
                <div className="card shadow h-100">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Private Info</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="fname">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="fname"
                              placeholder="First Name"
                              defaultValue={
                                UsersIndex === -1
                                  ? ""
                                  : Users[UsersIndex].F_FNAME
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label htmlFor="lname">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="lname"
                              placeholder="Last Name"
                              defaultValue={
                                UsersIndex === -1
                                  ? ""
                                  : Users[UsersIndex].F_LNAME
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                              type="text"
                              className="form-control"
                              id="email"
                              placeholder="E-mail"
                              defaultValue={
                                UsersIndex === -1
                                  ? ""
                                  : Users[UsersIndex].F_EMAIL
                              }
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="fsid">
                              Freight Stream Username
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="fsid"
                              placeholder="Freight Stream"
                              defaultValue={
                                UsersIndex === -1
                                  ? ""
                                  : Users[UsersIndex].F_FSID
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() => alert("Please Contact Manager")}
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-content">
              <div
                className={`tab-pane fade ${activeTab == 1 && "show active"}`}
                id="password"
                role="tabpanel"
              >
                <div className="card shadow h-100">
                  <div className="card-header">
                    <h5 className="card-title mb-0">Password</h5>
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="row">
                        <div className="col-md-12" style={{ display: "none" }}>
                          <div className="form-group">
                            <label htmlFor="current">Username</label>
                            <input
                              type="text"
                              className="form-control"
                              autoComplete="true"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="current">Current password</label>
                            <input
                              type="password"
                              className="form-control"
                              id="current"
                              autoComplete="true"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="new">New Password</label>
                            <input
                              type="password"
                              className="form-control"
                              id="new"
                              autoComplete="new-password"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="verify">Verify Password</label>
                            <input
                              type="password"
                              className="form-control"
                              id="verify"
                              autoComplete="new-password"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() => alert("Please Contact Manager")}
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div className="tab-content">
              <div
                className={`tab-pane fade ${activeTab == 2 && "show active"}`}
                id="contacts"
                role="tabpanel"
              >
                <div className="card shadow h-100">
                  <div className="card-header">
                    <div className="d-flex flex-sm-row justify-content-between">
                      <h5 className="card-title mb-0">Contacts</h5>
                      {/* <Button size="sm" color="primary" outline>
                        Add New<i className="fa fa-edit fa-lg ml-2"></i>
                      </Button> */}
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Extension</th>
                            <th>Number</th>
                            <th>Email</th>
                            {TOKEN.admin && <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody style={{ fontSize: "0.8rem" }}>
                          {Users &&
                            Users.sort((a, b) =>
                              a.F_GROUP > b.F_GROUP ? 1 : -1
                            ).map((ga) => (
                              <tr key={ga.F_ID}>
                                <td>{ga.F_FNAME + " " + ga.F_LNAME}</td>
                                <td>{ga.F_GROUP}</td>
                                <td>
                                  {ga.F_GROUP > 1 && ga.F_GROUP < 200
                                    ? "562-393-8800"
                                    : ga.F_GROUP >= 200 && ga.F_GROUP < 300
                                    ? "562-393-8900"
                                    : ga.F_GROUP >= 300 && ga.F_GROUP < 400
                                    ? "562-393-8877"
                                    : ga.F_GROUP >= 400 && ga.F_GROUP < 500
                                    ? "562-393-8899"
                                    : ga.F_GROUP >= 500 && ga.F_GROUP < 600
                                    ? "562-304-9988"
                                    : ga.F_GROUP >= 600 && ga.F_GROUP < 700
                                    ? "562-321-5400"
                                    : ""}
                                </td>
                                <td>
                                  <a
                                    href={`mailto:${ga.F_EMAIL}`}
                                    target="_blank"
                                  >
                                    {ga.F_EMAIL}
                                  </a>
                                </td>
                                {TOKEN.admin && (
                                  <td>
                                    <i
                                      className="fa fa-pencil pr-2 text-primary"
                                      type="button"
                                      onClick={() => {
                                        setModal(true);
                                        setChangeUser(ga);
                                      }}
                                    />
                                    <i
                                      className="fa fa-minus-circle text-danger"
                                      type="button"
                                      onClick={() => {
                                        if (confirm("Are you sure?")) {
                                          alert("Please contact admin team");
                                        }
                                      }}
                                    />
                                  </td>
                                )}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle} className="px-4">
            Change User Information
          </ModalHeader>
          <ModalBody className="py-4 px-4">
            <FormGroup className="mb-2">
              <Label for="account">Account</Label>
              <Input
                id="account"
                placeholder="Account *"
                defaultValue={ChangeUser.F_ACCOUNT}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    F_ACCOUNT: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="first">First Name</Label>
              <Input
                id="first"
                placeholder="First Name *"
                defaultValue={ChangeUser.F_FNAME}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    F_FNAME: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="last">Last Name</Label>
              <Input
                id="last"
                placeholder="Last Name *"
                defaultValue={ChangeUser.F_LNAME}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    F_LNAME: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="group">Group</Label>
              <Input
                id="group"
                placeholder="Group *"
                defaultValue={ChangeUser.F_GROUP}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="email">Email</Label>
              <Input
                placeholder="Email *"
                defaultValue={ChangeUser.F_EMAIL}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    F_EMAIL: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="fs">Freight Stream Account</Label>
              <Input
                id="fs"
                placeholder="Freight Stream Account *"
                defaultValue={ChangeUser.F_FSID}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    F_FSID: val,
                  }));
                }}
              />
            </FormGroup>
          </ModalBody>
          <Button color="primary" onClick={onClickSave}>
            Save
          </Button>
        </Modal>
      </Layout>
    );
  } else {
    return <p>Redirecting...</p>;
  }
};

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );

  const users = await fetch(`${process.env.BASE_URL}api/admin/getFmsUsers`, {
    headers: { key: cookies.jamesworldwidetoken },
  }).then((t) => t.json());

  // Pass data to the page via props
  return { props: { Cookie: cookies, Users: users } };
}

export default Index;
