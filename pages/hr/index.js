import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Menu,
  MenuItem,
  Dialog,
  Text,
  InputGroup,
  Toast,
  Toaster,
  RadioGroup,
  Radio,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";
import SiteMap from "../../components/Hr/SiteMap";
// import AutomateNoti from "../../components/Hr/AutomateNoti";
import fetch from "node-fetch";
import { Fragment } from "react";

export default function humanResource({ Cookie, Member }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [Selected, setSelected] = useState(1);
  const [SelectedUser, setSelectedUser] = useState({});
  const [SelectedMenu, setSelectedMenu] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  const router = useRouter();
  useEffect(() => {
    !TOKEN && router.push("/login");
    if (TOKEN.admin === 9) {
      console.log("ACCESS GRANTED");
    } else {
      alert("YOU ARE NOT AUTORIZED TO ACCESS");
      router.push("/dashboard");
    }
  }, []);

  // Employee Table Action
  const ActionMenu = (
    <Menu>
      <MenuItem
        icon="list-detail-view"
        text="Detail"
        onClick={() => setSelectedMenu(1)}
      />
      <MenuItem icon="time" text="Date" onClick={() => setSelectedMenu(2)} />
      <MenuItem
        icon="envelope"
        text="Email"
        onClick={() => setSelectedMenu(3)}
      />
    </Menu>
  );

  const FormsToaster = () => {
    if (show) {
      return (
        <Toaster position="top">
          <Toast
            message={msg}
            intent="success"
            onDismiss={() => setShow(false)}
          ></Toast>
        </Toaster>
      );
    } else {
      return <Fragment></Fragment>;
    }
  };

  const columns = [
    {
      dataField: "FNAME",
      text: "First Name",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "LNAME",
      text: "Last Name",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "GROUP",
      text: "Extension",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "EMAIL",
      text: "Email",
      align: "center",
      classes: "uppercase truncate overflow-hidden",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "STATUS",
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
      dataField: "LASTACCESSDATE",
      text: "Last Sign In",
      align: "center",
      headerAlign: "center",
      sort: true,
      formatter: (cell) => {
        if (cell) {
          return moment(cell).format("lll");
        }
      },
    },
    {
      dataField: "ID",
      text: "Action",
      classes: "text-center py-0 align-middle",
      headerAlign: "center",
      sort: true,
      formatter: (cell) => {
        if (cell) {
          return (
            <Popover2
              content={ActionMenu}
              onOpening={() => {
                Member.find((ele) => {
                  if (ele.ID == cell) {
                    // IF THE PASSWORD IS EMPTY, PASSWORD WILL NOT BE UPDATED
                    delete ele.PASSWORD;

                    // SET SELECTED USER SO THAT IT CAN BE CHANGED
                    setSelectedUser(ele);
                  }
                });
              }}
            >
              <button className="hover:text-white py-1 px-2 border">
                Action
              </button>
            </Popover2>
          );
        }
      },
    },
  ];

  // FETCH - ADD EMAIL NOTIFICATION (SERVER WILL AUTOMTICALLY SEND EMAIL AT SEPCIFIC TIME)
  async function uploadEmailNoti(time, name, anni) {
    //F_MAILTO, F_SUBJECT, F_CONTENT, F_TARGET, F_RECURR, F_SENT, F_PERIOD_INT, F_PERIOD_STR, F_CATEGORY
    var mailto = "KEVIN@JAMESWORLDWIDE.COM";
    var subject = `${name} ANNIVERSARY NOTIFICATION`;
    var content = `<h1>${name} Anniversary(Work Start) Date is ${moment(
      time
    ).format(
      "L"
    )}</h1><p>This is automated email message. Please do not reply</p>`;
    var anniverary = `${moment(anni).format("L")}`;
    var recurring = 1;
    var sent = 0;
    var period_int = 1;
    var period_string = "year";
    var catagory = "HR";
    const summary = `'${mailto}', '${subject}', '${content}', '${anniverary}', ${recurring}, ${sent}, ${period_int}, '${period_string}', '${catagory}'`;

    const fetchNoti = await fetch(`/api/admin/postAutomateNoti`, {
      method: "POST",
      body: summary,
    });
    if (fetchNoti.status === 200) {
      // UPDATED
      setMsg("UPDATE SUCCESSFUL");
      setShow(true);
      if (moment(time).isAfter(moment().subtract(3, "months"))) {
        console.log("set 90days passed notification");
        subject = `${name} 3 MONTH PASSED NOTIFICATION`;
        content = `<h1>${name} Has been working from ${moment(time).format(
          "L"
        )}</h1>`;
        anniverary = moment(time).add(3, "months").format("L");
        recurring = 0;
        sent = 0;
        const threeMonth = `'${mailto}', '${subject}', '${content}', '${anniverary}', ${recurring}, ${sent}, NULL, NULL, '${catagory}'`;
        const fetchThreeMonth = await fetch(`/api/admin/postAutomateNoti`, {
          method: "POST",
          body: threeMonth,
        });
        if (fetchThreeMonth.status === 200) {
          console.log("3 MONTH FECTHCED");
        } else {
          console.log(await fetchThreeMonth.json());
        }
      }
    } else {
      // FAILED
      const resultNoti = await fetchNoti.json();
      setMsg(JSON.stringify(resultNoti));
      setShow(true);
    }
  }

  // CALCULATE NEXT NOTIFICATION DATE AND DISPLAY NOTIFICATION SET BUTTON TO CALL uploadEmailNoti FUNCTION
  const CalculateNextNoti = ({ Time, Name }) => {
    if (Time && moment(Time).month() != "NaN" && moment(Time).date() != "NaN") {
      // IF TIME IS ENTERED, MONTH, DATE IS EXIST

      // MM/DD/YYYY
      var tempDate = `${moment(Time).month() + 1}/${moment(
        Time
      ).date()}/${moment().year()}`;
      // IF THE MONTH AND DATE IS BEFORE TODAY
      if (moment(tempDate).subtract(3, "months").isBefore(moment())) {
        // MM/DD/YYYY
        tempDate = `${moment(Time).month() + 1}/${moment(Time).date()}/${
          moment().year() + 1
        }`;
        var nextYear = moment(tempDate).subtract(3, "months").format("L");
        // IF THE TARGET DATE IS LESS THAN 90 DAYS FROM TODAY, THEN SET THE DATE AS THIS YEAR
        return (
          <div className="d-flex flex-column">
            <span className="text-primary">TARGET: {nextYear}</span>
            <Button
              text="Set Notification"
              icon="notifications-snooze"
              className="my-2"
              onClick={() => uploadEmailNoti(Time, Name, nextYear)}
            />
          </div>
        );
      } else {
        var thisYear = moment(tempDate).subtract(3, "months").format("L");
        return (
          <div className="d-flex flex-column">
            <span className="text-primary">TARGET: {thisYear}</span>
            <Button
              text="Set Notification"
              icon="notifications-snooze"
              className="my-2"
              onClick={() => uploadEmailNoti(Time, Name, thisYear)}
            />
          </div>
        );
      }
    } else {
      return <span className="text-danger">WORK START TIME IS NOT VALID</span>;
    }
  };

  const defaultSorted = [
    {
      dataField: "GROUP",
      order: "asc",
    },
  ];

  async function handleInfoChange() {
    const fetchPutMember = await fetch(`/api/admin/putMember`, {
      method: "PUT",
      headers: {
        id: SelectedUser.ID,
      },
      body: JSON.stringify(SelectedUser),
    });
    if (fetchPutMember.status === 200) {
      const PutMember = await fetchPutMember.json();
      setMsg(`USER: ${PutMember[0].ACCOUNT} UPDATED SUCCESSFULLY`);
      setShow(true);
      setSelectedMenu(false);
      router.reload();
    } else {
      setMsg(`ERROR: ${fetchPutMember.status}`);
      setShow(true);
    }
  }
  async function handleDateChange() {
    const fetchPutMember = await fetch(`/api/admin/putMember`, {
      method: "PUT",
      headers: {
        id: SelectedUser.ID,
      },
      body: JSON.stringify(SelectedUser),
    });
    if (fetchPutMember.status === 200) {
      const PutMember = await fetchPutMember.json();
      setMsg(`USER: ${PutMember[0].ACCOUNT} UPDATED SUCCESSFULLY`);
      setShow(true);
      setSelectedMenu(false);
      router.reload();
    } else {
      setMsg(`ERROR: ${fetchPutMember.status}`);
      setShow(true);
    }
  }
  async function handleAddMember() {
    // Handle require field
    if (
      newUser.ACCOUNT === undefined ||
      newUser.PASSWORD === undefined ||
      newUser.EMAIL === undefined ||
      newUser.FNAME === undefined ||
      newUser.LNAME === undefined ||
      newUser.GROUP === undefined ||
      newUser.STATUS === undefined
    ) {
      setMsg(`ERROR: PLEAE TYPE REQUIRED FILED`);
      setShow(true);
    } else {
      const fetchPostMember = await fetch(`/api/admin/postMember`, {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      if (fetchPostMember.status === 200) {
        // Upload Success
        const PostMember = await fetchPostMember.json();
        setMsg(`USER: ${PostMember[0].ACCOUNT} CREATED SUCCESSFULLY`);
        setShow(true);
        setSelectedMenu(false);
        setNewUser({});
      } else {
        // Upload Fail
        const PostMember = await fetchPostMember.json();
        setMsg(`ERROR: ${PostMember.statusCode}`);
        setShow(true);
      }
    }
  }
  if (TOKEN) {
    if (TOKEN.admin === 9) {
      return (
        <Layout TOKEN={TOKEN} TITLE="Human Resource">
          <Navbar className="rounded mb-4">
            <NavbarGroup align={Alignment.LEFT}>
              <NavbarHeading>Human Resource</NavbarHeading>
              <NavbarDivider />
              <Button
                className={Classes.MINIMAL}
                icon="user"
                text="Employee"
                onClick={() => setSelected(1)}
              />
              <Button
                className={Classes.MINIMAL}
                icon="people"
                text="Team"
                onClick={() => setSelected(2)}
              />
              <Button
                className={Classes.MINIMAL}
                icon="satellite"
                text="Site Map"
                onClick={() => setSelected(3)}
              />
              {/* <Button
								className={Classes.MINIMAL}
								icon="envelope"
								text="Automate Notification"
								onClick={() => setSelected(4)}
							/> */}
              <Button
                className={Classes.MINIMAL}
                icon="plus"
                text="Add User"
                onClick={() => setSelectedMenu(4)}
              />
            </NavbarGroup>
          </Navbar>
          {Selected === 1 && (
            <div className="p-3">
              <div className="card overflow-hidden">
                <BootstrapTable
                  keyField="ID"
                  data={Member}
                  columns={columns}
                  headerClasses="dark:text-white bg-gray-400 text-white font-semibold"
                  rowClasses="hover:bg-indigo-500 hover:text-white border-b border-gray-200 dark:bg-gray-700 dark:text-white"
                  wrapperClasses="table-responsive text-xs"
                  defaultSorted={defaultSorted}
                  bordered={false}
                />
              </div>
            </div>
          )}
          {Selected === 2 && (
            <div className="container-fluid">
              <div className="row mt-3">Team function is not supported yet</div>
            </div>
          )}
          {Selected === 3 && (
            <div className="container-fluid">
              <SiteMap />
            </div>
          )}
          {/* {Selected === 4 && (
						<div className="container-fluid">
							<AutomateNoti />
						</div>
					)} */}

          <Dialog
            isOpen={SelectedMenu}
            title={
              SelectedMenu === 1
                ? "Detail"
                : SelectedMenu === 2
                ? "Date"
                : SelectedMenu === 3
                ? "Email"
                : SelectedMenu === 4
                ? "Add User"
                : "NONE"
            }
            icon="edit"
            onClose={() => setSelectedMenu(false)}
          >
            <div className={Classes.DIALOG_BODY}>
              {SelectedMenu === 1 && (
                <>
                  <Text>User ID</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="person"
                    value={SelectedUser.ACCOUNT}
                    disabled={true}
                  />
                  <Text>Password</Text>
                  <InputGroup
                    type="password"
                    className="mb-2"
                    leftIcon="lock"
                    autoComplete="new-password"
                    value={SelectedUser.PASSWORD}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        PASSWORD: e.target.value,
                      })
                    }
                  />
                  <Text>First Name</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="person"
                    value={SelectedUser.FNAME}
                    onChange={(e) => {
                      e.preventDefault();
                      setSelectedUser({
                        ...SelectedUser,
                        FNAME: e.target.value,
                      });
                    }}
                  />
                  <Text>Last Name</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="person"
                    value={SelectedUser.LNAME}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        LNAME: e.target.value,
                      })
                    }
                  />
                  <Text>Extension Number</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="phone"
                    value={SelectedUser.GROUP}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        GROUP: e.target.value,
                      })
                    }
                  />
                  <Text>Email Address</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="envelope"
                    value={SelectedUser.EMAIL}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        EMAIL: e.target.value,
                      })
                    }
                  />
                  <Text>Freight Stream ID</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="selection"
                    value={SelectedUser.FSID}
                    onChange={(e) =>
                      setSelectedUser({ ...SelectedUser, FSID: e.target.value })
                    }
                  />
                  <Text>Cell Phone Number</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="mobile-phone"
                    value={SelectedUser.PhoneNumber}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        PhoneNumber: e.target.value,
                      })
                    }
                  />
                  <Text>Address</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="locate"
                    value={SelectedUser.Address}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        Address: e.target.value,
                      })
                    }
                  />
                  <Text>Backup Email</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="envelope"
                    value={SelectedUser.PersonalEmail}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        PersonalEmail: e.target.value,
                      })
                    }
                  />

                  <Text>Status</Text>
                  <InputGroup
                    type="number"
                    className="mb-2"
                    leftIcon="log-in"
                    value={SelectedUser.STATUS}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        STATUS: e.target.value,
                      })
                    }
                  />
                  <Text>0: Suspended</Text>
                  <Text>1: Operator</Text>
                  <Text>5: Manager</Text>
                  <Text className="mb-3">9: Admin</Text>
                  <Text>
                    Account created at{" "}
                    {moment(SelectedUser.CREATDATE).format("LL")}
                  </Text>
                </>
              )}
              {/* ================== Dates (Work, Insurance) Input =================== */}
              {SelectedMenu === 2 && (
                <>
                  <Text>WORK START</Text>
                  <InputGroup
                    type="date"
                    className="mb-2"
                    leftIcon="menu-open"
                    value={moment(SelectedUser.WorkBegin).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        WorkBegin: e.target.value,
                      })
                    }
                  />
                  <Text>WORK END</Text>
                  <InputGroup
                    type="date"
                    className="mb-2"
                    leftIcon="menu-open"
                    value={moment(SelectedUser.WorkEnd).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        WorkEnd: e.target.value,
                      })
                    }
                  />
                  <Text>INSURANCE START</Text>
                  <InputGroup
                    type="date"
                    className="mb-2"
                    leftIcon="menu-open"
                    value={moment(SelectedUser.InsuranceBegin).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        InsuranceBegin: e.target.value,
                      })
                    }
                  />
                  <Text>INSURANCE END</Text>
                  <InputGroup
                    type="date"
                    className="mb-2"
                    leftIcon="menu-open"
                    value={moment(SelectedUser.InsuranceEnd).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        InsuranceEnd: e.target.value,
                      })
                    }
                  />
                  <Text>EYE DENTAL START</Text>
                  <InputGroup
                    type="date"
                    className="mb-2"
                    leftIcon="menu-open"
                    value={moment(SelectedUser.EyeDentalBegin).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        EyeDentalBegin: e.target.value,
                      })
                    }
                  />
                  <Text>EYE DENTAL END</Text>
                  <InputGroup
                    type="date"
                    className="mb-2"
                    leftIcon="menu-open"
                    value={moment(SelectedUser.EyeDentalEnd).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        EyeDentalEnd: e.target.value,
                      })
                    }
                  />
                  <Text>LIFE INSURANCE START</Text>
                  <InputGroup
                    type="date"
                    className="mb-2"
                    leftIcon="menu-open"
                    value={moment(SelectedUser.LifeInsBegin).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        LifeInsBegin: e.target.value,
                      })
                    }
                  />
                  <Text>LIFE INSURANCE END</Text>
                  <InputGroup
                    type="date"
                    className="mb-2"
                    leftIcon="menu-open"
                    value={moment(SelectedUser.LifeInsEnd).format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        LifeInsEnd: e.target.value,
                      })
                    }
                  />
                  <RadioGroup
                    label="INSURANCE TYPE"
                    onChange={(e) =>
                      setSelectedUser({
                        ...SelectedUser,
                        InsuranceType: e.target.value,
                      })
                    }
                    selectedValue={SelectedUser.InsuranceType}
                  >
                    <Radio label="None" value="0" />
                    <Radio label="Self" value="1" />
                    <Radio label="Family" value="2" />
                  </RadioGroup>
                  <Text className="font-weight-bold">
                    * Anniversary Notification{" "}
                    <CalculateNextNoti
                      Time={SelectedUser.WorkBegin}
                      Name={SelectedUser.FNAME + " " + SelectedUser.LNAME}
                    />
                  </Text>
                </>
              )}
              {/* Email */}
              {SelectedMenu === 3 && (
                <a href={`mailto:${SelectedUser.EMAIL}`} target="__blank">
                  <Button text="SEND EMAIL" />
                </a>
              )}
              {/* Adding New User */}
              {SelectedMenu === 4 && (
                <>
                  <Text>
                    Account <span className="text-danger">*</span>
                  </Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="person"
                    value={newUser.ACCOUNT}
                    autoComplete="off"
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        ACCOUNT: e.target.value,
                      })
                    }
                  />
                  <Text>
                    Password <span className="text-danger">*</span>
                  </Text>
                  <InputGroup
                    type="password"
                    className="mb-2"
                    leftIcon="lock"
                    autoComplete="new-password"
                    value={newUser.PASSWORD}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        PASSWORD: e.target.value,
                      })
                    }
                  />
                  <Text>
                    Email <span className="text-danger">*</span>
                  </Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="envelope"
                    value={newUser.EMAIL}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        EMAIL: e.target.value,
                      })
                    }
                  />
                  <Text>
                    First Name <span className="text-danger">*</span>
                  </Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="person"
                    value={newUser.FNAME}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        FNAME: e.target.value,
                      })
                    }
                  />
                  <Text>
                    Last Name <span className="text-danger">*</span>
                  </Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="person"
                    value={newUser.LNAME}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        LNAME: e.target.value,
                      })
                    }
                  />
                  <Text>
                    Extension Number <span className="text-danger">*</span>
                  </Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="phone"
                    value={newUser.GROUP}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        GROUP: e.target.value,
                      })
                    }
                  />
                  <Text>Freight Stream ID</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="selection"
                    value={newUser.FSID}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        FSID: e.target.value,
                      })
                    }
                  />
                  <Text>Cell Phone Number</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="mobile-phone"
                    value={newUser.PhoneNumber}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        PhoneNumber: e.target.value,
                      })
                    }
                  />
                  <Text>Address</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="locate"
                    value={newUser.Address}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        Address: e.target.value,
                      })
                    }
                  />
                  <Text>Backup Email</Text>
                  <InputGroup
                    className="mb-2"
                    leftIcon="envelope"
                    value={newUser.PersonalEmail}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        PersonalEmail: e.target.value,
                      })
                    }
                  />
                  <Text>
                    Status <span className="text-danger">*</span>
                  </Text>
                  <InputGroup
                    type="number"
                    className="mb-2"
                    leftIcon="log-in"
                    value={newUser.STATUS}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        STATUS: e.target.value,
                      })
                    }
                  />
                  <Text>0: Suspended</Text>
                  <Text>1: Operator</Text>
                  <Text>5: Manager</Text>
                  <Text>6: Director</Text>
                  <Text>7: Accounting</Text>
                  <Text className="mb-3">9: Admin</Text>
                </>
              )}
              {/* <Text>{JSON.stringify(SelectedUser)}</Text> */}
            </div>
            <div className={Classes.DIALOG_FOOTER}>
              <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                <Button
                  onClick={() => {
                    if (SelectedMenu === 1) {
                      handleInfoChange();
                    }
                    if (SelectedMenu === 2) {
                      handleDateChange();
                    }
                    if (SelectedMenu === 3) {
                      setSelectedMenu(false);
                    }
                    if (SelectedMenu === 4) {
                      handleAddMember();
                    }
                  }}
                  intent="primary"
                >
                  Submit
                </Button>
                <Button onClick={() => setSelectedMenu(false)}>Cancel</Button>
              </div>
            </div>
          </Dialog>
          <FormsToaster />
        </Layout>
      );
    } else {
      return <p>Unauthorized</p>;
    }
  } else {
    return <p>Redirecting...</p>;
  }
}

export async function getServerSideProps({ req }) {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : window.document.cookie
  );
  var Member = false;
  const fetchMember = await fetch(`${process.env.FS_BASEPATH}member`, {
    headers: { "x-api-key": process.env.JWT_KEY },
  });

  if (fetchMember.status) {
    Member = await fetchMember.json();
    Member.pop();
  }

  // Pass data to the page via props
  return { props: { Cookie: cookies, Member } };
}
