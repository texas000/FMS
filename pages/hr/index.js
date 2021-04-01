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
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import BootstrapTable from "react-bootstrap-table-next";
import moment from "moment";

export default function humanResource({ Cookie, Member }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  const [Selected, setSelected] = useState(1);
  const [SelectedUser, setSelectedUser] = useState(false);
  const [SelectedMenu, setSelectedMenu] = useState(false);
  const router = useRouter();
  useEffect(() => {
    !TOKEN && router.push("/login");
  }, []);

  // Employee Table Action

  const ActionMenu = (
    <Menu>
      <MenuItem
        icon="list-detail-view"
        text="Detail"
        onClick={() => setSelectedMenu(1)}
      />
      <MenuItem
        icon="error"
        text="Suspend"
        onClick={() => setSelectedMenu(2)}
      />
      <MenuItem
        icon="envelope"
        text="Alert"
        onClick={() => setSelectedMenu(3)}
      />
    </Menu>
  );

  const columns = [
    {
      dataField: "FNAME",
      text: "First Name",
      headerClasses: "text-white bg-primary font-weight-light",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "LNAME",
      text: "Last Name",
      headerClasses: "text-white bg-primary font-weight-light",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "GROUP",
      text: "Extension",
      headerClasses: "text-white bg-primary font-weight-light",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "EMAIL",
      text: "Email",
      headerClasses: "text-white bg-primary font-weight-light",
      align: "center",
      headerAlign: "center",
      sort: true,
    },
    {
      dataField: "STATUS",
      text: "Status",
      headerClasses: "text-white bg-primary font-weight-light",
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
      headerClasses: "text-white bg-primary font-weight-light",
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
      headerClasses: "text-white bg-primary font-weight-light",
      classes: "text-center py-0 align-middle",
      headerAlign: "center",
      sort: true,
      formatter: (cell) => {
        if (cell) {
          return (
            <Popover2
              content={ActionMenu}
              onOpening={() =>
                Member.find((ele) => ele.ID == cell && setSelectedUser(ele))
              }
            >
              <Button
                icon="edit"
                text="Action"
                rightIcon="caret-down"
                className="my-0"
                small={true}
                outlined={true}
              />
            </Popover2>
          );
        }
      },
    },
  ];

  const defaultSorted = [
    {
      dataField: "GROUP",
      order: "asc",
    },
  ];

  return (
    <Layout TOKEN={TOKEN} TITLE="Human Resource">
      <Navbar>
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
        </NavbarGroup>
      </Navbar>
      {/* {JSON.stringify(SelectedUser)}
      {SelectedUser.ID} */}
      {Selected === 1 && (
        <div className="container-fluid">
          <div className="row my-3">
            <BootstrapTable
              keyField="ID"
              data={Member}
              columns={columns}
              wrapperClasses="table-responsive text-xs rounded"
              defaultSorted={defaultSorted}
              bordered={false}
            />
          </div>
        </div>
      )}
      {Selected === 2 && <div className="container-fluid">Team</div>}

      <Dialog
        isOpen={SelectedMenu}
        title={
          SelectedMenu === 1
            ? "Detail"
            : SelectedMenu === 2
            ? "Suspend"
            : "Alert"
        }
        icon="edit"
        onClose={() => setSelectedMenu(false)}
      >
        <div className={Classes.DIALOG_BODY}>
          <Text>{JSON.stringify(SelectedUser)}</Text>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={() => setSelectedMenu(false)}>Cancel</Button>
          </div>
        </div>
      </Dialog>
    </Layout>
  );
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
