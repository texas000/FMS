import cookie from "cookie";
import Layout from "../components/Layout";
import jwt from "jsonwebtoken";
import useSWR from "swr";
import moment from "moment";
import AsyncSelect from "react-select/async";
import {
  Button,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Classes,
  Alignment,
  Menu,
  MenuItem,
  Dialog,
  InputGroup,
} from "@blueprintjs/core";
import { useState } from "react";
import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import BootstrapTable from "react-bootstrap-table-next";
import Notification from "../components/Toaster";

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  try {
    const token = jwt.verify(cookies.jamesworldwidetoken, process.env.JWT_KEY);
    return {
      props: {
        token: token,
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

export default function humanResource({ token }) {
  const { data: users, mutate: mutateUsers } = useSWR(
    "/api/manage/getAccountMembers"
  );
  const [selectedNavigation, setSelectedNavigation] = useState(1);
  const [selectedUser, setSelectedUser] = useState(false);
  const [selectedDialog, setSelectedDialog] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [msg, setMsg] = useState(false);
  const [show, setShow] = useState(false);
  const [companySelected, setCompanySelected] = useState(false);
  const { data: assignedCompany, mutate: mutateAssigned } = useSWR(
    selectedUser
      ? `
  /api/company/getAssignedCustomer?id=${selectedUser.F_ID}
  `
      : null
  );

  const handleInputChange = (newValue) => {
    // var inputValue = newValue.replace(/'/g, "");
    return newValue;
  };
  const loadOptions = async (inputValue, callback) => {
    if (inputValue.length > 1) {
      return fetch(
        `/api/company/getCompanyList?search=${encodeURIComponent(inputValue)}`
      ).then((res) => res.json());
    }
  };

  const MemberActionMenu = (
    <Menu>
      <MenuItem
        icon="list-detail-view"
        text="Profile"
        onClick={() => setSelectedDialog(1)}
      />
      <MenuItem
        icon="office"
        text="Customer"
        onClick={() => setSelectedDialog(2)}
      />
    </Menu>
  );

  const columns = [
    {
      dataField: "F_FNAME",
      text: "First Name",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "F_LNAME",
      text: "Last Name",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "F_GROUP",
      text: "Extension",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "F_EMAIL",
      text: "Email",
      align: "center",
      classes: "uppercase truncate overflow-hidden",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "F_STATUS",
      text: "Status",

      align: "center",
      headerAlign: "center",
      formatter: (cell) => {
        if (cell) {
          if (cell == "1") {
            return "Operator";
          }
          if (cell == "5") {
            return "Manager";
          }
          if (cell == "6") {
            return "Director";
          }
          if (cell == "7") {
            return "Accounting";
          }
          if (cell == "9") {
            return "Admin";
          }
          if (cell == "0") {
            return "Suspended";
          }
        } else {
          return "Suspended";
        }
      },
      sort: true,
    },
    {
      dataField: "F_LASTACCESSDATE",
      text: "Last Sign In",
      align: "center",
      headerAlign: "center",
      sort: true,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).utc().format("lll");
        }
      },
    },
    {
      dataField: "F_ID",
      text: "Action",
      classes: "text-center py-0 align-middle",
      headerAlign: "center",
      sort: true,
      formatter: (cell) => {
        if (cell) {
          return (
            <Popover2
              content={MemberActionMenu}
              onOpening={() => {
                users.find((ele) => {
                  if (ele.F_ID == cell) {
                    // SET SELECTED USER SO THAT IT CAN BE CHANGED
                    setSelectedUser(ele);
                  }
                });
              }}
            >
              <button className="hover:bg-gray-500 py-1 px-2 border">
                Action
              </button>
            </Popover2>
          );
        }
      },
    },
  ];

  async function handleProfileUpdate() {
    const updateProfile = await fetch("/api/manage/updateMember", {
      method: "POST",
      body: JSON.stringify(selectedUser),
    });
    if (updateProfile.status == 200) {
      setMsg(`${selectedUser.F_FNAME}'s profile updated successfully`);
      mutateUsers();
      setSelectedDialog(false);
    } else {
      setMsg(`Erorr: ${updateProfile.status}`);
    }
    setShow(true);
  }
  async function handleAddUser() {
    if (
      !newUser.F_ACCOUNT ||
      !newUser.F_PASSWORD ||
      !newUser.F_EMAIL ||
      !newUser.F_FNAME ||
      !newUser.F_LNAME ||
      !newUser.F_GROUP ||
      !newUser.F_FSID ||
      !newUser.F_STATUS
    ) {
      alert("Error: Please fill out required field");
      return;
    }
    const addUser = await fetch("/api/manage/postMember", {
      method: "POST",
      body: JSON.stringify(newUser),
    });
    if (addUser.status == 200) {
      setMsg(`${newUser.F_FNAME}'s profile created successfully`);
      console.log(await addUser.text());
      mutateUsers();
      setSelectedDialog(false);
    } else {
      setMsg(`Erorr: ${addUser.status}`);
    }
    setShow(true);
  }

  async function handleAddCompany() {
    const check = confirm(
      `Would you like to add an account ${companySelected.label}?`
    );
    if (check) {
      const res = await fetch(
        `/api/company/postCompanyList?id=${companySelected.value}&pic=${
          selectedUser.F_ID
        }&company=${encodeURIComponent(companySelected.label)}`
      );
      const ret = await res.json();
      setMsg(ret.msg);
      mutateAssigned;
      setShow(true);
    }
  }
  return (
    <Layout TOKEN={token} TITLE="Human Resource" LOADING={!users}>
      <Navbar className="rounded mb-4">
        <NavbarGroup align={Alignment.LEFT}>
          <NavbarHeading>Human Resource</NavbarHeading>
          <NavbarDivider />
          <Button
            className={Classes.MINIMAL}
            icon="user"
            text="Employee"
            onClick={() => setSelectedNavigation(1)}
          />
          {/* <Button
            className={Classes.MINIMAL}
            icon="satellite"
            text="Site Map"
            onClick={() => setSelectedNavigation(2)}
          /> */}
          <Button
            className={Classes.MINIMAL}
            icon="plus"
            text="New User"
            onClick={() => setSelectedDialog(3)}
          />
        </NavbarGroup>
      </Navbar>
      {selectedNavigation === 1 && (
        <div className="p-3">
          <div className="card overflow-hidden">
            <BootstrapTable
              keyField="F_ID"
              data={users ? users : []}
              columns={columns}
              headerClasses="dark:text-white bg-gray-400 text-white font-semibold"
              rowClasses="hover:bg-indigo-500 hover:text-white border-b border-gray-200 dark:bg-gray-700 dark:text-white"
              wrapperClasses="table-responsive text-xs"
              defaultSorted={[
                {
                  dataField: "F_GROUP",
                  order: "asc",
                },
              ]}
              bordered={false}
            />
          </div>
        </div>
      )}

      <Dialog
        isOpen={selectedDialog}
        title={
          selectedDialog === 1
            ? "Profile"
            : selectedDialog === 2
            ? "Customer"
            : selectedDialog === 3
            ? "New User"
            : "null"
        }
        icon="edit"
        onClose={() => {
          setNewUser({});
          setSelectedDialog(false);
        }}
      >
        <div className={Classes.DIALOG_BODY}>
          {/* UPDATE USER */}
          {selectedDialog === 1 && (
            <div className="card p-3">
              <label htmlFor="account">Account</label>
              <InputGroup
                id="account"
                leftIcon="person"
                className="mb-2"
                value={selectedUser.F_ACCOUNT || undefined}
                disabled={true}
              />
              <label htmlFor="pass">Password</label>
              <InputGroup
                id="pass"
                value=""
                leftIcon="lock"
                disabled={true}
                className="mb-2"
              />
              <label htmlFor="first">First Name</label>
              <InputGroup
                id="first"
                leftIcon="mugshot"
                className="mb-2"
                value={selectedUser.F_FNAME || undefined}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    F_FNAME: e.target.value,
                  });
                }}
              />
              <label htmlFor="last">Last Name</label>
              <InputGroup
                id="last"
                className="mb-2"
                leftIcon="mugshot"
                value={selectedUser.F_LNAME || undefined}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    F_LNAME: e.target.value,
                  });
                }}
              />
              <label htmlFor="ext">Extension Number</label>
              <InputGroup
                id="ext"
                className="mb-2"
                leftIcon="phone"
                value={selectedUser.F_GROUP || undefined}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    F_GROUP: e.target.value,
                  });
                }}
              />
              <label htmlFor="mail">Email Address</label>
              <InputGroup
                id="mail"
                className="mb-2"
                leftIcon="envelope"
                value={selectedUser.F_EMAIL || undefined}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    F_EMAIL: e.target.value,
                  });
                }}
              />
              <label htmlFor="fsid">Freight Stream ID</label>
              <InputGroup
                id="fsid"
                className="mb-2"
                leftIcon="git-branch"
                value={selectedUser.F_FSID || undefined}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    F_FSID: e.target.value,
                  });
                }}
              />
              <label htmlFor="cell">Cell Phone Number</label>
              <InputGroup
                id="cell"
                className="mb-2"
                leftIcon="mobile-phone"
                value={selectedUser.F_PhoneNumber || undefined}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    F_PhoneNumber: e.target.value,
                  });
                }}
              />
              <label htmlFor="address">Address</label>
              <InputGroup
                id="address"
                className="mb-2"
                leftIcon="locate"
                value={selectedUser.F_Address || undefined}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    F_Address: e.target.value,
                  });
                }}
              />
              <label htmlFor="pemail">Personal Email</label>
              <InputGroup
                id="pemail"
                className="mb-2"
                leftIcon="locate"
                value={selectedUser.F_PersonalEmail || undefined}
                onChange={(e) => {
                  setSelectedUser({
                    ...selectedUser,
                    F_PersonalEmail: e.target.value,
                  });
                }}
              />
              <label htmlFor="status">Status</label>
              <div className="bp3-html-select bp3-fill">
                <select
                  id="status"
                  value={selectedUser.F_STATUS}
                  onChange={(e) =>
                    setSelectedUser({
                      ...selectedUser,
                      F_STATUS: e.target.value,
                    })
                  }
                >
                  <option selected>Choose a status...</option>
                  <option value="0">Suspended</option>
                  <option value="1">Operator</option>
                  <option value="5">Manager</option>
                  <option value="6">Director</option>
                  <option value="7">Accounting</option>
                  <option value="9">Admin</option>
                </select>
              </div>

              <p className="pt-3">
                Account created at{" "}
                {moment(selectedUser.F_CREATEDATE).utc().format("l")}
              </p>
            </div>
          )}
          {/* CUSTOMER */}
          {selectedDialog === 2 && (
            <div className="card p-3">
              <label>Company</label>
              <AsyncSelect
                instanceId="companySearch"
                className="dark:text-gray-800"
                cacheOptions
                onInputChange={handleInputChange}
                loadOptions={loadOptions}
                placeholder="SEARCH CUSTOMER NAME"
                onChange={(e) => setCompanySelected(e)}
              />
              {companySelected && (
                <button
                  onClick={handleAddCompany}
                  className="mt-2 bg-indigo-500 p-1 rounded hover:bg-indigo-300 text-white"
                >{`ADD ${companySelected.label}`}</button>
              )}

              {assignedCompany &&
                assignedCompany.map((ga) => (
                  <ul key={ga.COMPANY_ID} className="mt-3">
                    <li className="font-bold">{ga.COMPANY_NAME}</li>
                    {ga.CONTACT.map((na, i) => (
                      <li
                        key={i + ga.COMPANY_ID}
                        onClick={() =>
                          window.open(
                            `mailto:"${na.NAME}" <${na.EMAIL}>`,
                            "_blank"
                          )
                        }
                        className="pl-3 tracking-wide uppercase text-gray-400 hover:text-indigo-500 cursor-pointer"
                      >
                        <span>{na.NAME}</span>
                        <span>{`<${na.EMAIL}>`}</span>
                      </li>
                    ))}
                  </ul>
                ))}
            </div>
          )}
          {/* NEW USER */}
          {selectedDialog === 3 && (
            <div className="card p-3">
              <label htmlFor="account">
                Account <span className="text-red-500">*</span>
              </label>
              <InputGroup
                id="account"
                autoComplete="off"
                className="mb-2"
                leftIcon="person"
                value={newUser.F_ACCOUNT || undefined}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    F_ACCOUNT: e.target.value,
                  });
                }}
              />
              <label htmlFor="pass">
                Password <span className="text-red-500">*</span>
              </label>
              <InputGroup
                id="pass"
                autoComplete="off"
                className="mb-2"
                leftIcon="person"
                value={newUser.F_PASSWORD || undefined}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    F_PASSWORD: e.target.value,
                  });
                }}
              />
              <label htmlFor="mail">
                Email <span className="text-red-500">*</span>
              </label>
              <InputGroup
                id="mail"
                autoComplete="off"
                className="mb-2"
                leftIcon="person"
                value={newUser.F_EMAIL || undefined}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    F_EMAIL: e.target.value,
                  });
                }}
              />
              <label htmlFor="first">
                First Name <span className="text-red-500">*</span>
              </label>
              <InputGroup
                id="first"
                autoComplete="off"
                className="mb-2"
                leftIcon="person"
                value={newUser.F_FNAME || undefined}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    F_FNAME: e.target.value,
                  });
                }}
              />
              <label htmlFor="last">
                Last Name <span className="text-red-500">*</span>
              </label>
              <InputGroup
                id="last"
                autoComplete="off"
                className="mb-2"
                leftIcon="person"
                value={newUser.F_LNAME || undefined}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    F_LNAME: e.target.value,
                  });
                }}
              />
              <label htmlFor="ext">
                Extension Number <span className="text-red-500">*</span>
              </label>
              <InputGroup
                id="ext"
                autoComplete="off"
                className="mb-2"
                leftIcon="phone"
                value={newUser.F_GROUP || undefined}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    F_GROUP: e.target.value,
                  });
                }}
              />
              <label htmlFor="fsid">
                Freight Stream ID <span className="text-red-500">*</span>
              </label>
              <InputGroup
                id="fsid"
                autoComplete="off"
                className="mb-2"
                leftIcon="phone"
                value={newUser.F_FSID || undefined}
                onChange={(e) => {
                  setNewUser({
                    ...newUser,
                    F_FSID: e.target.value,
                  });
                }}
              />

              <label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </label>
              <div className="bp3-html-select bp3-fill">
                <select
                  id="status"
                  value={newUser.F_STATUS || undefined}
                  onChange={(e) =>
                    setNewUser({
                      ...newUser,
                      F_STATUS: e.target.value,
                    })
                  }
                >
                  <option selected>Choose a status...</option>
                  <option value="0">Suspended</option>
                  <option value="1">Operator</option>
                  <option value="5">Manager</option>
                  <option value="6">Director</option>
                  <option value="7">Accounting</option>
                  <option value="9">Admin</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              intent="primary"
              disabled={selectedDialog === 2}
              onClick={() => {
                if (selectedDialog === 1) {
                  handleProfileUpdate();
                }
                if (selectedDialog === 3) {
                  handleAddUser();
                }
              }}
            >
              Submit
            </Button>
            <Button
              onClick={() => {
                setSelectedDialog(false);
                setNewUser({});
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Dialog>
      <Notification show={show} msg={msg} setShow={setShow} />
    </Layout>
  );
}
