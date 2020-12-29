import { useRouter } from "next/router";
// import { Nav } from "reactstrap";
import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
import{ useEffect } from 'react'

const Sidebar = ({level}) => {
  const [mobile, setMobile] = React.useState(false)
  const router = useRouter()
  useEffect(() => {
    if(window.innerWidth<600) {
      setMobile(true)
    }
  }, [])
  
  const desktopView = {
    background: "#fff",
    backgroundImage: 'linear-gradient(to top, #bdffe2 0%, #ffad8a 100%)',
    borderRight: "1px solid #ddd",
    boxShadow: '1px 2px 2px #DCDCDC',
    position: "fixed",
    minWidth: '64px',
  }
  const mobileView = {
    background: "#fff",
    backgroundImage: 'linear-gradient(to top, #66ffbd 0%, #ff7b63 100%)',
    borderRight: "1px solid #ddd",
    boxShadow: '1px 2px 2px #DCDCDC',
    position: "fixed",
    minWidth: '32px',
    width: '32px',
  }
  const mobileIcon = {textAlign: 'left'}
  const desktopIcon = {textAlign: 'center'}

  const TextStyle = {paddingRight: 20, color: 'DarkGoldenRod'}
  return (
    <>
      <SideNav
        onSelect={(selected) => {
          router.push(`/${selected}`);
        }}
        style={mobile?mobileView:desktopView}
        id="side"
      >
        <SideNav.Toggle style={mobile?{width: '30px'}:desktopIcon} />
        <SideNav.Nav defaultSelected="home">
          <NavItem eventKey="">
            <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-home"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: "white",
                }}
              />
            </NavIcon>
            <NavText
              style={TextStyle}
              title="HOME"
            >
              {level ? "ADMIN" : "HOME"}
            </NavText>
          </NavItem>

          <NavItem eventKey="user">
            <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-user"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: "white",
                }}
              />
            </NavIcon>
            <NavText
              style={TextStyle}
              title="USER"
            >
              USER
            </NavText>
          </NavItem>

          <NavItem eventKey="board">
          <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-list-alt"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: "white",
                }}
              />
            </NavIcon>
            <NavText
              style={TextStyle}
              title="BOARD"
            >
              BOARD
            </NavText>
          </NavItem>

          <NavItem eventKey="forwarding">
          <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-ship"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: 'white',
                }}
              />
            </NavIcon>
            <NavText
              style={TextStyle}
              title="FORWARDING"
            >
              FORWARDING
            </NavText>
            
            {/* <NavItem eventKey="forwarding/md">
              <NavText title="MD" style={{ color: "#a9a9a9" }}>
              MD DIRECT
              </NavText>
            </NavItem> */}
          </NavItem>

          {/* <NavItem eventKey="forwarding/ocean">
          <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-ship"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: 'white',
                }}
              />
            </NavIcon>
            <NavText
              style={{ paddingRight: 20 }}
              title="OCEAN"
            >
              OCEAN
            </NavText>
          </NavItem> */}

          <NavItem eventKey="forwarding/trucking">
          <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-truck"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: 'white',
                }}
              />
            </NavIcon>
            <NavText
              style={TextStyle}
              title="TRUCKING"
            >
              TRUCKING
            </NavText>
          </NavItem>

          <NavItem eventKey="warehouse/staff">
          <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-industry"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: 'white',
                }}
              />
            </NavIcon>
            {/* <NavText
              style={TextStyle}
              title="WAREHOUSE"
            >
              WAREHOUSE
            </NavText> */}
            
              <NavText style={TextStyle} title="STAFF">
                STAFF
              </NavText>
            {/* <NavItem eventKey="warehouse/staff/summary">
              <NavText title="STAFF SUMMARY">
                STAFF SUMMARY
              </NavText>
            </NavItem> */}
            {/* <NavItem eventKey="warehouse/order">
              <NavText title="ORDER" style={{ color: "#a9a9a9" }}>
                ORDER
              </NavText>
            </NavItem>
            <NavItem eventKey="warehouse/product">
              <NavText title="PRODUCT" style={{ color: "#a9a9a9" }}>
                PRODUCT
              </NavText>
            </NavItem> */}
          </NavItem>

          <NavItem eventKey="calendar">
          <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-calendar"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: 'white',
                }}
              />
            </NavIcon>
            <NavText
              style={TextStyle}
              title="CALENDAR"
            >
              CALENDAR
            </NavText>
          </NavItem>

          {level && 
          <NavItem eventKey="import">
            <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-file"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: 'white',
                }}
              />
            </NavIcon>
            <NavText
              style={TextStyle}
              title="import"
            >
              IMPORT
            </NavText>
            <NavItem eventKey="import/freight">
              <NavText title="FREIGHT">
                FREIGHT
              </NavText>
            </NavItem>
          </NavItem>
          }
          {level && (
            <NavItem eventKey="admin/users">
              <NavIcon style={mobile?mobileIcon:desktopIcon}>
                <i
                  className="fa fa-fw fa-user"
                  style={{
                    fontSize: "1.75em",
                    verticalAlign: "middle",
                    color: 'white',
                  }}
                />
              </NavIcon>
              <NavText
                style={TextStyle}
                title="ADMIN"
              >
                ADMIN
              </NavText>
            </NavItem>
          )}

          <NavItem eventKey="login">
          <NavIcon style={mobile?mobileIcon:desktopIcon}>
              <i
                className="fa fa-fw fa-power-off"
                style={{
                  fontSize: "1.75em",
                  verticalAlign: "middle",
                  color: 'white',
                }}
              />
            </NavIcon>
            <NavText
              style={TextStyle}
              title="SIGN OUT"
            >
              SIGN OUT
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    </>
  );
};

export default Sidebar;