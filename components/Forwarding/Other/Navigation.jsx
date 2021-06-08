import {
  Alignment,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Button,
} from "@blueprintjs/core";

export const Navigation = ({ menu, setMenu, Reference }) => (
  <Navbar fixedToTop={false} className="my-1 shadow" style={{ zIndex: 0 }}>
    <NavbarGroup align={Alignment.LEFT}>
      <NavbarHeading>{Reference}</NavbarHeading>
      <NavbarDivider />
      <Button
        icon="shield"
        text="Master"
        small={true}
        minimal={true}
        intent={menu === 1 ? "primary" : "none"}
        onClick={() => setMenu(1)}
      ></Button>
      <Button
        icon="dollar"
        text="Profit"
        small={true}
        minimal={true}
        intent={menu === 3 ? "primary" : "none"}
        onClick={() => setMenu(3)}
      ></Button>
      <Button
        icon="document"
        text="File"
        small={true}
        minimal={true}
        intent={menu === 4 ? "primary" : "none"}
        onClick={() => setMenu(4)}
      ></Button>
    </NavbarGroup>
  </Navbar>
);
export default Navigation;
