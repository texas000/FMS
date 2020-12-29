import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { useRouter } from "next/router";

const TopNav = ({name, level}) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const toggleNavbar = () => setCollapsed(!collapsed);
  const router = useRouter()
  const paths = router.asPath.split('/')
  // console.log(router.pathname)
  // console.log(paths)
  return (
    <div>
      <Navbar color="faded" light expand="lg" className="sticky-top">
        {/* <NavbarBrand href="/" className="mr-auto">
          <img src="/image/Logo-lg.png" style={{ width: "120px" }} />
        </NavbarBrand> */}
        {/* <Breadcrumb className="ml-4 mt-0 pt-0">
          {paths.map((ga, i) => (
            i===paths.length-1 ? <BreadcrumbItem key={i}>{ga.toUpperCase()}</BreadcrumbItem> : <BreadcrumbItem key={i}><a href={`/${ga}`}>{ga==="" ? <i className="fa fa-home"></i>: ga.toUpperCase()}</a></BreadcrumbItem>
          ))}
        </Breadcrumb> */}
        {/* <NavbarToggler onClick={toggleNavbar} className="mr-2" />
        <Collapse isOpen={!collapsed} navbar>
          <Nav navbar className="ml-auto">
            <NavItem>
              <NavLink href="/account">
                <i className="fa fa-user pr-2"></i>
                <span>{name}</span>
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/login">
                <i className="fa fa-power-off pr-2" href="/login"></i>
                <span>LOGOUT</span>
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse> */}
      </Navbar>
      <style global jsx>
        {`
          .sticky-top {
            position: sticky;
            top: 0;
            z-index: 1020;
          }
        `}
      </style>
    </div>
  );
}


export default TopNav;