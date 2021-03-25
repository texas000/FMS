import cookie from "cookie";
import React, { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import Modal from "reactstrap/lib/Modal";
import ModalHeader from "reactstrap/lib/ModalHeader";
import ModalBody from "reactstrap/lib/ModalBody";
import Input from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import FormGroup from "reactstrap/lib/FormGroup";
import Button from "reactstrap/lib/Button";

const Index = ({ Cookie, Users, Member }) => {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [modal, setModal] = useState(false);
  const [ChangeUser, setChangeUser] = useState(false);

  const [types, setType] = useState("");
  const UsersIndex = Users.findIndex((x) => x.F_ID === TOKEN.uid);

  // const MemberIndex = Member.findIndex((x) => x.ID === TOKEN.uid);

  const toggle = () => setModal(!modal);
  useEffect(() => {
    !TOKEN && router.push("/login");
    console.log(TOKEN);
  }, []);

  const onClickSave = async () => {
    setType("Edit");
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

  function handleAddUser() {
    setType("Add");
    setChangeUser(false);
    setModal(true);
  }

  async function onAddUser() {
    console.log(ChangeUser);
    const fetchs = await fetch("/api/admin/postMember", {
      method: "POST",
      body: JSON.stringify({ ...ChangeUser, ISLOGIN: 0, STATUS: 1 }),
    });
    if (fetchs.status === 200) {
      const Info = await fetchs.json();
      console.log(Info);
    } else {
      console.log(fetchs);
    }
  }

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
                    </div>
                  </div>
                  <div className="card-body">
                    {TOKEN.admin && (
                      <div className="text-right">
                        <Button
                          size="sm"
                          color="primary"
                          outline
                          className="my-2"
                          onClick={handleAddUser}
                        >
                          Add New <i className="fa fa-edit fa-lg ml-2"></i>
                        </Button>
                      </div>
                    )}
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
                          {Member &&
                            Member.sort((a, b) =>
                              a.GROUP > b.GROUP ? 1 : -1
                            ).map(
                              (ga) =>
                                ga.STATUS !== "0" && (
                                  <tr key={ga.ID}>
                                    <td>{ga.FNAME + " " + ga.LNAME}</td>
                                    <td className="font-weight-bold">
                                      {ga.GROUP}
                                    </td>
                                    <td>
                                      {ga.GROUP > 1 && ga.GROUP < 200
                                        ? "562-393-8800"
                                        : ga.GROUP >= 200 && ga.GROUP < 300
                                        ? "562-393-8900"
                                        : ga.GROUP >= 300 && ga.GROUP < 400
                                        ? "562-393-8877"
                                        : ga.GROUP >= 400 && ga.GROUP < 500
                                        ? "562-393-8899"
                                        : ga.GROUP >= 500 && ga.GROUP < 600
                                        ? "562-304-9988"
                                        : ga.GROUP >= 600 && ga.GROUP < 700
                                        ? "562-321-5400"
                                        : ""}
                                    </td>
                                    <td>
                                      <a
                                        href={`mailto:${ga.EMAIL}`}
                                        target="_blank"
                                      >
                                        {ga.EMAIL}
                                      </a>
                                    </td>
                                    {TOKEN.admin && (
                                      <td>
                                        <i
                                          className="fa fa-pencil pr-2 text-primary"
                                          type="button"
                                          onClick={() => {
                                            setType("Edit");
                                            setModal(true);
                                            setChangeUser(ga);
                                          }}
                                        />
                                        <i
                                          className="fa fa-minus-circle text-danger"
                                          type="button"
                                          onClick={() => {
                                            if (confirm("Are you sure?")) {
                                              alert(
                                                "Please contact admin team"
                                              );
                                            }
                                          }}
                                        />
                                      </td>
                                    )}
                                  </tr>
                                )
                            )}
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
            {types} User
          </ModalHeader>
          <ModalBody className="py-4 px-4">
            <FormGroup className="mb-2">
              <Label for="account">Account</Label>
              <Input
                id="account"
                placeholder="Account *"
                defaultValue={ChangeUser.ACCOUNT}
                disabled={types === "Edit"}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    ACCOUNT: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="first">First Name</Label>
              <Input
                id="first"
                placeholder="First Name *"
                defaultValue={ChangeUser.FNAME}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    FNAME: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="last">Last Name</Label>
              <Input
                id="last"
                placeholder="Last Name *"
                defaultValue={ChangeUser.LNAME}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    LNAME: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="group">Group</Label>
              <Input
                id="group"
                placeholder="Group *"
                defaultValue={ChangeUser.GROUP}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    GROUP: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="email">Email</Label>
              <Input
                placeholder="Email *"
                defaultValue={ChangeUser.EMAIL}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    EMAIL: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="fs">Freight Stream Account</Label>
              <Input
                id="fs"
                placeholder="Freight Stream Account *"
                defaultValue={ChangeUser.FSID}
                autoComplete="false"
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    FSID: val,
                  }));
                }}
              />
            </FormGroup>
            <FormGroup className="mb-2">
              <Label for="password">Password</Label>
              <Input
                id="password"
                placeholder="Password *"
                type="password"
                name="new-password"
                defaultValue={ChangeUser.PASSWORD}
                onChange={(e) => {
                  var val = e.target.value || "";
                  setChangeUser((prev) => ({
                    ...prev,
                    PASSWORD: val,
                  }));
                }}
              />
            </FormGroup>
          </ModalBody>
          {types === "Edit" && (
            <Button color="primary" onClick={onClickSave}>
              EDIT USER
            </Button>
          )}
          {types === "Add" && (
            <Button color="primary" onClick={onAddUser}>
              ADD USER
            </Button>
          )}
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

  const member = await fetch(`${process.env.FS_BASEPATH}member`, {
    headers: { "x-api-key": process.env.JWT_KEY },
  }).then((t) => t.json());

  // Pass data to the page via props
  return { props: { Cookie: cookies, Users: users, Member: member } };
}

export default Index;
