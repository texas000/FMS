import cookie from "cookie";
import Layout from "../../components/Layout";
import jwt from "jsonwebtoken";
import {
  Button,
  Icon,
  Menu,
  MenuItem,
  MenuDivider,
  useHotkeys,
  Breadcrumbs,
} from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import React, { useMemo, useState } from "react";

export default function blank({ Cookie }) {
  const TOKEN = jwt.decode(Cookie.jamesworldwidetoken);
  // important: hotkeys array must be memoized to avoid infinitely re-binding hotkeys
  const hotkeys = useMemo(
    () => [
      {
        combo: "R",
        global: true,
        label: "Refresh data",
        onKeyDown: () => alert("HELLO!"),
      },
    ],
    []
  );
  const exampleMenu = (
    <Menu>
      <MenuItem icon="graph" text="Graph" />
      <MenuItem icon="map" text="Map" />
      <MenuItem icon="th" text="Table" shouldDismissPopover={false} />
      <MenuItem icon="zoom-to-fit" text="Nucleus" disabled={true} />
      <MenuDivider />
      <MenuItem icon="cog" text="Settings...">
        <MenuItem icon="add" text="Add new application" disabled={true} />
        <MenuItem icon="remove" text="Remove application" />
      </MenuItem>
    </Menu>
  );
  const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);
  const BREADCRUMBS = [
    // { href: "/dev/janet", icon: "folder-close", text: "Janet" },
    { href: "/dev", icon: "folder-close", text: "Dev" },
    { icon: "document", text: "Blank" },
  ];
  return (
    <Layout TOKEN={TOKEN} TITLE="Blank">
      <h3>Blank Page</h3>
      <Button text="button content" />
      <Button icon="refresh" intent="danger" text="Reset" />
      <Button icon="user" rightIcon="caret-down" text="Profile settings" />
      <Button rightIcon="arrow-right" intent="success" text="Next step" />

      <Icon icon="confirm"></Icon>
      <Breadcrumbs items={BREADCRUMBS} />
      <Popover2 content={exampleMenu} placement="right-end">
        <Button icon="share" text="Open in..." />
      </Popover2>
      <div tabIndex={0} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
        TRY ADD BUTTON R
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
